"use client";

import { useEffect, useRef, useState } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import * as THREE from "three";

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  detectionConfidence: 0.6,
  trackingConfidence: 0.6,
  presenceConfidence: 0.6,

  palmSmoothing: 0.28,
  zoomSmoothing: 0.25,

  movementDeadZone: 0.0015,
  movementSensitivity: 1.25,

  zoomSensitivity: 2.8,
  minZoom: 2,
  maxZoom: 300,
};

// ============================================
// HELPERS
// ============================================

function distance3D(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y, (a.z || 0) - (b.z || 0));
}

function getPalmCenter(hand) {
  const points = [hand[0], hand[5], hand[9], hand[13], hand[17]];

  return {
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
  };
}

// ============================================
// GESTURE RECOGNITION
// ============================================

function isOpenPalm(hand) {
  if (!hand || hand.length < 21) return false;

  const wrist = hand[0];

  const fingers = [
    [8, 6],
    [12, 10],
    [16, 14],
    [20, 18],
  ];

  let extendedCount = 0;

  fingers.forEach(([tip, pip]) => {
    const tipDistance = distance3D(wrist, hand[tip]);
    const pipDistance = distance3D(wrist, hand[pip]);

    if (tipDistance > pipDistance * 1.12) {
      extendedCount++;
    }
  });

  return extendedCount >= 3;
}

function getHandDistance(hand1, hand2) {
  const p1 = getPalmCenter(hand1);
  const p2 = getPalmCenter(hand2);

  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

// ============================================
// GESTURE GUIDE
// ============================================

function GestureGuide({ onClose }) {
  const gestures = [
    {
      icon: "✋",
      title: "OPEN PALM",
      subtitle: "Move the entire space",
      description: "Move one open hand to pan the universe.",
      color: "#42dfff",
      number: "01",
    },
    {
      icon: "✋  ✋",
      title: "TWO HANDS",
      subtitle: "Zoom in and out",
      description: "Move both hands apart or closer together.",
      color: "#b58cff",
      number: "02",
    },
  ];

  return (
    <div
      style={{
        position: "absolute",
        bottom: "165px",
        left: "25px",
        width: "245px",
        padding: "16px",
        borderRadius: "13px",
        border: "1px solid rgba(66, 223, 255, 0.2)",
        background: "rgba(5, 15, 30, 0.94)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: "0 10px 35px rgba(0,0,0,0.3)",
        color: "#edf5ff",
        fontFamily: "Arial, sans-serif",
        zIndex: 8,
        animation: "holoxGuideIn 0.25s ease both",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "10px",
              letterSpacing: "1.8px",
              fontWeight: 700,
              color: "#42dfff",
            }}
          >
            GESTURE GUIDE
          </div>

          <div
            style={{
              fontSize: "9px",
              color: "#71869f",
              marginTop: "4px",
            }}
          >
            INTERACTION PROTOCOL
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close gesture guide"
          style={{
            background: "transparent",
            border: "none",
            color: "#829ab5",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>

      {gestures.map((gesture, index) => (
        <div
          key={gesture.number}
          style={{
            display: "flex",
            gap: "12px",
            padding: "12px 0",
            borderTop:
              index === 0
                ? "1px solid rgba(130,175,230,0.12)"
                : "1px solid rgba(130,175,230,0.12)",
          }}
        >
          <div
            style={{
              width: "43px",
              height: "43px",
              flexShrink: 0,
              display: "grid",
              placeItems: "center",
              borderRadius: "9px",
              background: `${gesture.color}12`,
              border: `1px solid ${gesture.color}35`,
              color: gesture.color,
              fontSize: gesture.number === "02" ? "15px" : "23px",
            }}
          >
            {gesture.icon}
          </div>

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                color: gesture.color,
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "1px",
              }}
            >
              {gesture.number} / {gesture.title}
            </div>

            <div
              style={{
                fontSize: "11px",
                color: "#e3efff",
                fontWeight: 600,
                marginTop: "4px",
              }}
            >
              {gesture.subtitle}
            </div>

            <div
              style={{
                color: "#8298b3",
                fontSize: "9px",
                lineHeight: 1.5,
                marginTop: "4px",
              }}
            >
              {gesture.description}
            </div>
          </div>
        </div>
      ))}

      <div
        style={{
          paddingTop: "10px",
          borderTop: "1px solid rgba(130,175,230,0.12)",
          color: "#657f9e",
          fontSize: "9px",
          lineHeight: 1.6,
        }}
      >
        Keep your hands visible and well-lit for better tracking.
      </div>
    </div>
  );
}

// ============================================
// MAIN HAND TRACKER
// ============================================

export default function HandTracker({ enabled, controlsRef, onStatus }) {
  const videoRef = useRef(null);

  const [showGuide, setShowGuide] = useState(true);

  useEffect(() => {
    if (!enabled) return;

    let stream = null;
    let landmarker = null;
    let animationId = null;
    let active = true;

    let lastVideoTime = -1;

    let previousPalm = null;
    let previousDistance = null;

    let smoothMovement = { x: 0, y: 0 };
    let smoothZoom = 0;

    let previousStatus = "";

    const setStatus = (status) => {
      if (previousStatus === status) return;

      previousStatus = status;
      onStatus?.(status);
    };

    // ========================================
    // MOVE SPACE
    // ========================================

    function moveSpace(dx, dy, controls) {
      const camera = controls.object;

      const distance = camera.position.distanceTo(controls.target);

      const sensitivity = distance * CONFIG.movementSensitivity;

      const right = new THREE.Vector3(1, 0, 0)
        .applyQuaternion(camera.quaternion)
        .normalize();

      const up = new THREE.Vector3(0, 1, 0)
        .applyQuaternion(camera.quaternion)
        .normalize();

      const movement = new THREE.Vector3()
        .addScaledVector(right, -dx * sensitivity)
        .addScaledVector(up, -dy * sensitivity);

      camera.position.add(movement);
      controls.target.add(movement);

      controls.update();
    }

    // ========================================
    // ZOOM SPACE
    // ========================================

    function zoomSpace(delta, controls) {
      const camera = controls.object;
      const target = controls.target;

      const direction = camera.position.clone().sub(target);

      const currentDistance = direction.length();

      const factor = Math.exp(-delta * CONFIG.zoomSensitivity);

      const nextDistance = THREE.MathUtils.clamp(
        currentDistance * factor,
        CONFIG.minZoom,
        CONFIG.maxZoom,
      );

      direction.setLength(nextDistance);

      camera.position.copy(target.clone().add(direction));

      controls.update();
    }

    // ========================================
    // CAMERA + MEDIAPIPE INITIALIZATION
    // ========================================

    async function startTracking() {
      try {
        setStatus("REQUESTING CAMERA");

        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Camera API unavailable");
        }

        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
            frameRate: { ideal: 30, max: 30 },
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

        const modelOptions = {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU",
          },

          runningMode: "VIDEO",
          numHands: 2,

          minHandDetectionConfidence: CONFIG.detectionConfidence,
          minHandPresenceConfidence: CONFIG.presenceConfidence,
          minTrackingConfidence: CONFIG.trackingConfidence,
        };

        try {
          landmarker = await HandLandmarker.createFromOptions(
            vision,
            modelOptions,
          );
        } catch (gpuError) {
          console.warn(
            "HOLOX: GPU delegate unavailable. Switching to CPU.",
            gpuError,
          );

          if (!active) return;

          landmarker = await HandLandmarker.createFromOptions(vision, {
            ...modelOptions,
            baseOptions: {
              modelAssetPath: modelOptions.baseOptions.modelAssetPath,
              delegate: "CPU",
            },
          });
        }

        if (!active) {
          landmarker.close();
          landmarker = null;
          return;
        }

        setStatus("SHOW YOUR HANDS");

        // ====================================
        // DETECTION LOOP
        // ====================================

        function detect() {
          if (!active || !landmarker || !videoRef.current) {
            return;
          }

          if (video.readyState >= 2 && video.currentTime !== lastVideoTime) {
            lastVideoTime = video.currentTime;

            try {
              const results = landmarker.detectForVideo(
                video,
                performance.now(),
              );

              const hands = results.landmarks || [];
              const controls = controlsRef.current;

              if (controls && hands.length === 2) {
                // TWO HANDS = ZOOM

                const distance = getHandDistance(hands[0], hands[1]);

                if (previousDistance !== null) {
                  const rawDelta = THREE.MathUtils.clamp(
                    distance - previousDistance,
                    -0.05,
                    0.05,
                  );

                  smoothZoom += (rawDelta - smoothZoom) * CONFIG.zoomSmoothing;

                  if (Math.abs(smoothZoom) > 0.0005) {
                    zoomSpace(smoothZoom, controls);
                  }
                }

                previousDistance = distance;
                previousPalm = null;

                smoothMovement = { x: 0, y: 0 };

                setStatus("TWO HANDS: ZOOM");
              } else if (
                controls &&
                hands.length === 1 &&
                isOpenPalm(hands[0])
              ) {
                // ONE OPEN PALM = MOVE SPACE

                const palm = getPalmCenter(hands[0]);

                if (previousPalm) {
                  const rawDx = THREE.MathUtils.clamp(
                    palm.x - previousPalm.x,
                    -0.06,
                    0.06,
                  );

                  const rawDy = THREE.MathUtils.clamp(
                    palm.y - previousPalm.y,
                    -0.06,
                    0.06,
                  );

                  smoothMovement.x +=
                    (rawDx - smoothMovement.x) * CONFIG.palmSmoothing;

                  smoothMovement.y +=
                    (rawDy - smoothMovement.y) * CONFIG.palmSmoothing;

                  const dx =
                    Math.abs(smoothMovement.x) > CONFIG.movementDeadZone
                      ? smoothMovement.x
                      : 0;

                  const dy =
                    Math.abs(smoothMovement.y) > CONFIG.movementDeadZone
                      ? smoothMovement.y
                      : 0;

                  if (dx !== 0 || dy !== 0) {
                    moveSpace(dx, dy, controls);
                  }
                }

                previousPalm = palm;
                previousDistance = null;
                smoothZoom = 0;

                setStatus("OPEN PALM: MOVE SPACE");
              } else {
                // NO VALID GESTURE

                previousPalm = null;
                previousDistance = null;

                smoothMovement = { x: 0, y: 0 };
                smoothZoom = 0;

                if (hands.length === 0) {
                  setStatus("SHOW YOUR HANDS");
                } else if (hands.length === 1) {
                  setStatus("OPEN YOUR PALM");
                } else {
                  setStatus("GESTURE NOT RECOGNIZED");
                }
              }
            } catch (error) {
              console.error("HOLOX detection error:", error);
              setStatus("DETECTION ERROR");
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
          } else if (error.name === "NotReadableError") {
            setStatus("CAMERA ALREADY IN USE");
          } else {
            setStatus("TRACKING ERROR");
          }
        }
      }
    }

    startTracking();

    // ========================================
    // CLEANUP
    // ========================================

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
        landmarker = null;
      }

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      }
    };
  }, [enabled, controlsRef, onStatus]);

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ display: "none" }}
      />

      <style>
        {`
          @keyframes holoxGuideIn {
            from {
              opacity: 0;
              transform: translateY(8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      {/* GESTURE GUIDE */}
      {enabled && (
        <>
          {showGuide ? (
            <GestureGuide onClose={() => setShowGuide(false)} />
          ) : (
            <button
              type="button"
              onClick={() => setShowGuide(true)}
              style={{
                position: "absolute",
                bottom: "165px",
                left: "25px",
                zIndex: 8,
                padding: "10px 13px",
                borderRadius: "8px",
                border: "1px solid rgba(66,223,255,0.25)",
                background: "rgba(5,15,30,0.92)",
                color: "#42dfff",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "1px",
                cursor: "pointer",
              }}
            >
              ⓘ GESTURE GUIDE
            </button>
          )}
        </>
      )}
    </>
  );
}
