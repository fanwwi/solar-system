"use client";

import { useCallback, useRef, useState } from "react";

import HologramScene from "./components/HologramScene";
import HandTracker from "./components/HandTracker";

export default function Home() {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraStatus, setCameraStatus] = useState("CAMERA OFF");

  const rotationRef = useRef({
    x: 0,
    y: 0,
    scale: 1,
  });

  const handleCameraStatus = useCallback((status) => {
    setCameraStatus(status);
  }, []);

  const toggleCamera = () => {
    if (cameraEnabled) {
      setCameraEnabled(false);
      setCameraStatus("CAMERA OFF");

      rotationRef.current = {
        x: 0,
        y: 0,
        scale: 1,
      };
    } else {
      setCameraEnabled(true);
      setCameraStatus("STARTING CAMERA");
    }
  };

  const isTracking = cameraStatus === "HAND DETECTED";

  return (
    <main className="app">
      {/* HAND TRACKING */}
      <HandTracker
        enabled={cameraEnabled}
        rotationRef={rotationRef}
        onStatus={handleCameraStatus}
      />

      {/* HEADER */}
      <header className="header">
        <a className="logo" href="/">
          HOLO<span>X</span>
        </a>

        <div className="header-status">
          <span className="status-dot" />
          SYSTEM READY
        </div>

        <div className="header-version">VERSION 1.0.0</div>
      </header>

      <section className="workspace">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="section-label">ENVIRONMENT</div>

          <div className="control-group">
            <span className="control-label">SCENE</span>

            <div className="scene-card active">
              <span className="scene-icon">▦</span>

              <div>
                <strong>Minecraft World</strong>
                <small>Grass Block</small>
              </div>

              <span className="active-indicator" />
            </div>
          </div>

          <div className="control-group">
            <span className="control-label">INTERACTION</span>

            <div className="interaction-item">
              <span>✋</span>
              Hand Tracking
              <span className="coming-soon">LIVE</span>
            </div>

            <div className="interaction-item">
              <span>↻</span>
              Mouse Rotation
            </div>

            <div className="interaction-item">
              <span>⌖</span>
              Gesture Control
            </div>
          </div>

          {/* CAMERA STATUS */}
          <div className="control-group">
            <span className="control-label">TRACKING STATUS</span>

            <div className="tracking-status">
              <span
                className={`status-dot ${isTracking ? "tracking-active" : ""}`}
              />

              <span>{cameraStatus}</span>
            </div>
          </div>

          <div className="sidebar-bottom">
            <div className="connection">
              <span className="status-dot" />
              LOCAL RENDERING
            </div>

            <small>HOLOX ENGINE © 2026</small>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section className="main-content">
          <div className="scene-heading">
            <div>
              <div className="eyebrow">3D INTERACTIVE ENVIRONMENT</div>

              <h1>
                Minecraft <span>Grass Block</span>
              </h1>

              <p>Control a voxel object using natural hand gestures.</p>
            </div>

            <div className="scene-badge">
              <span className="status-dot" />
              LIVE SCENE
            </div>
          </div>

          {/* 3D VIEWPORT */}
          <div className="viewport">
            <HologramScene rotationRef={rotationRef} />

            <div className="viewport-top">
              <span>VIEWPORT / 001</span>
              <span>3D SPACE</span>
            </div>

            <div className="viewport-bottom">
              <span>X: {rotationRef.current.x.toFixed(2)}</span>

              <span>Y: {rotationRef.current.y.toFixed(2)}</span>

              <span>SCALE: {rotationRef.current.scale.toFixed(2)}x</span>
            </div>
          </div>

          {/* BOTTOM PANEL */}
          <div className="bottom-panel">
            <div className="panel-info">
              <span className="panel-icon">✦</span>

              <div>
                <strong>Hand interaction</strong>

                <small>
                  {cameraEnabled
                    ? cameraStatus
                    : "Enable camera to control the 3D object"}
                </small>
              </div>
            </div>

            <button
              className={`camera-button ${cameraEnabled ? "enabled" : ""}`}
              onClick={toggleCamera}
            >
              {cameraEnabled ? "DISABLE CAMERA" : "ENABLE CAMERA"}

              <span>↗</span>
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}
