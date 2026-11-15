"use client";

import { useEffect, useRef } from "react";

import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

import * as THREE from "three";

export default function HandTracker({ enabled, controlsRef, onStatus }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    let stream = null;
    let landmarker = null;
    let animationId = null;
    let active = true;
    let lastVideoTime = -1;

    let previousPalm = null;
    let previousDistance = null;
    let previousStatus = "";

    const setStatus = (status) => {
      if (previousStatus === status) return;

      previousStatus = status;
      onStatus?.(status);
    };

    function getPalmCenter(hand) {
      const points = [hand[0], hand[5], hand[9], hand[13], hand[17]];

      return {
        x: points.reduce((sum, point) => sum + point.x, 0) / points.length,

        y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
      };
    }

    function isOpenPalm(hand) {
      const fingers = [
        [8, 6],
        [12, 10],
        [16, 14],
        [20, 18],
      ];

      const extended = fingers.filter(
        ([tip, pip]) => hand[tip].y < hand[pip].y,
      );

      return extended.length >= 3;
    }

    function getHandDistance(hand1, hand2) {
      const p1 = getPalmCenter(hand1);
      const p2 = getPalmCenter(hand2);

      return Math.hypot(p1.x - p2.x, p1.y - p2.y);
    }

    function moveSpace(dx, dy, controls) {
      const camera = controls.object;

      const distance = camera.position.distanceTo(controls.target);

      const sensitivity = distance * 1.4;

      // Screen horizontal and vertical directions
      const right = new THREE.Vector3(1, 0, 0)
        .applyQuaternion(camera.quaternion)
        .normalize();

      const up = new THREE.Vector3(0, 1, 0)
        .applyQuaternion(camera.quaternion)
        .normalize();

      // Inverse camera movement makes the scene
      // appear to follow the palm.
      const movement = new THREE.Vector3()
        .addScaledVector(right, -dx * sensitivity)
        .addScaledVector(up, -dy * sensitivity);

      controls.object.position.add(movement);
      controls.target.add(movement);

      controls.update();
    }

    async function startTracking() {
      try {
        setStatus("REQUESTING CAMERA");

        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
          audio: false,
        });

        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        const video = videoRef.current;

        if (!video) return;

        video.srcObject = stream;

        await new Promise((resolve, reject) => {
          video.onloadeddata = resolve;
          video.onerror = reject;
        });

        await video.play();

        if (!active) return;

        setStatus("LOADING MEDIAPIPE");

        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm",
        );

        landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU",
          },

          runningMode: "VIDEO",
          numHands: 2,

          minHandDetectionConfidence: 0.55,
          minHandPresenceConfidence: 0.55,
          minTrackingConfidence: 0.55,
        });

        if (!active) return;

        setStatus("SHOW YOUR HANDS");

        function detect() {
          if (!active || !landmarker || !videoRef.current) {
            return;
          }

          if (video.readyState >= 2 && video.currentTime !== lastVideoTime) {
            lastVideoTime = video.currentTime;

            const results = landmarker.detectForVideo(video, performance.now());

            const hands = results.landmarks || [];
            const controls = controlsRef.current;

            if (controls && hands.length === 2) {
              // TWO HANDS: ZOOM
              const distance = getHandDistance(hands[0], hands[1]);

              if (previousDistance !== null) {
                const delta = THREE.MathUtils.clamp(
                  distance - previousDistance,
                  -0.04,
                  0.04,
                );

                const camera = controls.object;
                const target = controls.target;

                const direction = camera.position.clone().sub(target);

                const factor = Math.exp(-delta * 3.5);

                const nextDistance = THREE.MathUtils.clamp(
                  direction.length() * factor,
                  5,
                  110,
                );

                direction.setLength(nextDistance);

                camera.position.copy(target.clone().add(direction));

                controls.update();
              }

              previousDistance = distance;
              previousPalm = null;

              setStatus("TWO HANDS: ZOOM");
            } else if (controls && hands.length === 1 && isOpenPalm(hands[0])) {
              // ONE OPEN PALM: MOVE SPACE
              const palm = getPalmCenter(hands[0]);

              if (previousPalm) {
                const dx = THREE.MathUtils.clamp(
                  palm.x - previousPalm.x,
                  -0.06,
                  0.06,
                );

                const dy = THREE.MathUtils.clamp(
                  palm.y - previousPalm.y,
                  -0.06,
                  0.06,
                );

                moveSpace(dx, dy, controls);
              }

              previousPalm = palm;
              previousDistance = null;

              setStatus("OPEN PALM: MOVE SPACE");
            } else {
              previousPalm = null;
              previousDistance = null;

              setStatus(
                hands.length === 1 ? "OPEN YOUR PALM" : "SHOW YOUR HANDS",
              );
            }
          }

          animationId = requestAnimationFrame(detect);
        }

        detect();
      } catch (error) {
        console.error("HOLOX Hand Tracking:", error);

        if (active) {
          if (error.name === "NotAllowedError") {
            setStatus("CAMERA PERMISSION DENIED");
          } else if (error.name === "NotFoundError") {
            setStatus("CAMERA NOT FOUND");
          } else {
            setStatus("TRACKING ERROR");
          }
        }
      }
    }

    startTracking();

    return () => {
      active = false;

      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      if (landmarker) {
        landmarker.close();
      }

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      }
    };
  }, [enabled, controlsRef, onStatus]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      style={{ display: "none" }}
    />
  );
}
