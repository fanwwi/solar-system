"use client";

import { useCallback, useRef, useState } from "react";
import HologramScene from "./components/HologramScene";
import HandTracker from "./components/HandTracker";


export default function Home() {
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraStatus, setCameraStatus] = useState("CAMERA OFF");

  const controlsRef = useRef(null);

  const handleStatus = useCallback((status) => {
    setCameraStatus(status);
  }, []);

  const toggleCamera = () => {
    if (cameraEnabled) {
      setCameraEnabled(false);
      setCameraStatus("CAMERA OFF");
    } else {
      setCameraEnabled(true);
      setCameraStatus("STARTING CAMERA");
    }
  };

  return (
    <main
      style={{
        width: "100%",
        height: "100vh",
        background: "#03060d",
        color: "#fff",
        overflow: "hidden",
        position: "relative",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <HandTracker
        enabled={cameraEnabled}
        controlsRef={controlsRef}
        onStatus={handleStatus}
      />

      {/* HEADER */}
      <header
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 75,
          padding: "0 30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(100,180,220,0.15)",
          background: "rgba(3, 8, 18, 0.8)",
          zIndex: 5,
        }}
      >
        <div>
          <h1 style={{ letterSpacing: 5, margin: 0 }}>
            HOLO<span style={{ color: "#42dfff" }}>X</span>
          </h1>

          <small style={{ color: "#8195aa", letterSpacing: 2 }}>
            SOLAR SYSTEM EXPLORER
          </small>
        </div>

        <div style={{ color: "#7fdcff", fontSize: 12 }}>● SYSTEM ONLINE</div>
      </header>

      {/* 3D SCENE */}
      <div
        style={{
          position: "absolute",
          inset: "75px 0 0",
        }}
      >
        <HologramScene
          selectedPlanet={selectedPlanet}
          onSelect={setSelectedPlanet}
          controlsRef={controlsRef}
        />
      </div>

      {/* PLANET INFORMATION */}
      {selectedPlanet && (
        <aside
          style={{
            position: "absolute",
            right: 25,
            top: 100,
            width: 260,
            padding: 22,
            border: "1px solid rgba(66,223,255,0.3)",
            borderRadius: 14,
            background: "rgba(5,15,28,0.92)",
            backdropFilter: "blur(15px)",
            zIndex: 4,
          }}
        >
          <button
            onClick={() => setSelectedPlanet(null)}
            style={{
              float: "right",
              background: "transparent",
              color: "white",
              border: 0,
              cursor: "pointer",
              fontSize: 20,
            }}
          >
            ×
          </button>

          <small style={{ color: "#42dfff" }}>PLANET DATABASE</small>

          <h2 style={{ fontSize: 28 }}>{selectedPlanet.name}</h2>

          <p style={{ color: "#91a9bd" }}>{selectedPlanet.subtitle}</p>

          <hr style={{ borderColor: "#243b50" }} />

          <p>Type: {selectedPlanet.type}</p>
          <p>Diameter: {selectedPlanet.facts.diameter}</p>
          <p>Distance: {selectedPlanet.facts.distanceFromSun}</p>
          <p>Orbital period: {selectedPlanet.facts.orbitalPeriod}</p>
          <p>Rotation: {selectedPlanet.facts.rotationPeriod}</p>
          <p>Temperature: {selectedPlanet.facts.temperature}</p>
          <p>Moons: {selectedPlanet.facts.moons}</p>
        </aside>
      )}

      {/* CAMERA CONTROL */}
      <div
        style={{
          position: "absolute",
          bottom: 25,
          left: 25,
          zIndex: 5,
          padding: 16,
          width: 260,
          background: "rgba(5,15,28,0.9)",
          border: "1px solid rgba(66,223,255,0.25)",
          borderRadius: 12,
        }}
      >
        <div style={{ fontSize: 11, color: "#8195aa" }}>HAND TRACKING</div>

        <div style={{ margin: "10px 0", fontSize: 13 }}>● {cameraStatus}</div>

        <button
          onClick={toggleCamera}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 7,
            border: "1px solid #42dfff",
            background: cameraEnabled
              ? "rgba(255,70,90,0.15)"
              : "rgba(66,223,255,0.12)",
            color: "white",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {cameraEnabled ? "DISABLE CAMERA" : "ENABLE CAMERA"}
        </button>
      </div>

      {/* CONTROLS HINT */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          right: 30,
          zIndex: 3,
          color: "#8297ad",
          fontSize: 11,
          textAlign: "right",
          lineHeight: 1.8,
          pointerEvents: "none",
        }}
      >
        MOUSE — ROTATE
        <br />
        SCROLL — ZOOM
        <br />
        CLICK — SELECT PLANET
        <br />
        HANDS — GESTURE CONTROL
      </div>
    </main>
  );
}
