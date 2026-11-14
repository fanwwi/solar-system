"use client";

import { useEffect, useRef } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

export default function HandTracker({ enabled, rotationRef, onStatus }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    let stream = null;
    let landmarker = null;
    let animationId = null;
    let active = true;
    let lastVideoTime = -1;

    let initialDistance = null;
    let initialScale = 1;
    let currentScale = rotationRef.current.scale ?? 1;
    let previousStatus = "";

    function setTrackingStatus(status) {
      if (status !== previousStatus) {
        previousStatus = status;
        onStatus?.(status);
      }
    }

    // Центр ладони по нескольким ключевым точкам
    function getPalmCenter(hand) {
      const points = [
        hand[0], // Wrist
        hand[5], // Index MCP
        hand[9], // Middle MCP
        hand[13], // Ring MCP
        hand[17], // Pinky MCP
      ];

      return {
        x: points.reduce((sum, p) => sum + p.x, 0) / points.length,
        y: points.reduce((sum, p) => sum + p.y, 0) / points.length,
      };
    }

    // Расстояние между двумя ладонями
    function getDistance(hand1, hand2) {
      const p1 = getPalmCenter(hand1);
      const p2 = getPalmCenter(hand2);

      return Math.hypot(p1.x - p2.x, p1.y - p2.y);
    }

    async function startTracking() {
      try {
        setTrackingStatus("REQUESTING CAMERA");

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

        setTrackingStatus("LOADING MEDIAPIPE");

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
          minHandDetectionConfidence: 0.5,
          minHandPresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        if (!active) return;

        setTrackingStatus("SHOW BOTH HANDS");

        function detect() {
          if (!active || !landmarker || !videoRef.current) return;

          if (video.readyState >= 2 && video.currentTime !== lastVideoTime) {
            lastVideoTime = video.currentTime;

            const results = landmarker.detectForVideo(video, performance.now());

            const hands = results.landmarks || [];

            // --------------------------------
            // ONE HAND: ROTATION
            // --------------------------------

            if (hands.length >= 1) {
              const palm = getPalmCenter(hands[0]);

              rotationRef.current.x = (palm.y - 0.5) * Math.PI * 0.8;

              rotationRef.current.y = (0.5 - palm.x) * Math.PI * 2;
            }

            // --------------------------------
            // TWO HANDS: SCALE
            // --------------------------------

            if (hands.length === 2) {
              const distance = getDistance(hands[0], hands[1]);

              // Первое обнаружение двух рук:
              // фиксируем начальное расстояние
              if (initialDistance === null) {
                initialDistance = distance;
                initialScale = currentScale;
              }

              // Изменение относительно начального расстояния
              const ratio = distance / initialDistance;

              const targetScale = Math.min(
                2.5,
                Math.max(0.5, initialScale * ratio),
              );

              // Плавное масштабирование
              currentScale += (targetScale - currentScale) * 0.2;

              rotationRef.current.scale = currentScale;

              setTrackingStatus("TWO HANDS DETECTED");
            } else if (hands.length === 1) {
              initialDistance = null;

              setTrackingStatus("ONE HAND DETECTED");
            } else {
              initialDistance = null;

              setTrackingStatus("SHOW YOUR HANDS");
            }
          }

          animationId = requestAnimationFrame(detect);
        }

        detect();
      } catch (error) {
        console.error("HOLOX Tracking Error:", error);

        if (active) {
          if (error.name === "NotAllowedError") {
            setTrackingStatus("CAMERA PERMISSION DENIED");
          } else if (error.name === "NotFoundError") {
            setTrackingStatus("CAMERA NOT FOUND");
          } else {
            setTrackingStatus("TRACKING ERROR");
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
  }, [enabled, rotationRef, onStatus]);

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
