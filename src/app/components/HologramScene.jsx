"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import SolarSystem from "./solar-system/SolarSystem";
import CameraRig from "./solar-system/CameraRig";

import SpaceBackground from "./SpaceBackground";
import StarField from "./StarField";
import NebulaSystems from "./NebulaSystems";
import GalaxyDistribution from "./GalaxyDistribution";

import { planets, sunData } from "../data/planets";

const LABELS = {
  diameter: "Diameter",
  distanceFromSun: "Distance from Sun",
  orbitalPeriod: "Orbital Period",
  rotationPeriod: "Rotation Period",
  dayLength: "Day Length",
  temperature: "Temperature",
  gravity: "Gravity",
  escapeVelocity: "Escape Velocity",
  mass: "Mass",
  density: "Density",
  moons: "Known Moons",
  rings: "Ring System",
  magneticField: "Magnetic Field",
  atmosphere: "Atmosphere",
  atmosphereComposition: "Atmospheric Composition",
  surface: "Surface",
  composition: "Composition",
  notableFeatures: "Notable Features",
  exploration: "Space Exploration",
};

const panelStyle = {
  position: "absolute",
  top: "20px",
  right: "20px",
  width: "min(360px, calc(100% - 40px))",
  maxHeight: "calc(100% - 40px)",
  overflowY: "auto",
  padding: "22px",
  border: "1px solid rgba(110, 180, 255, 0.25)",
  borderRadius: "16px",
  background:
    "linear-gradient(145deg, rgba(8, 18, 38, 0.94), rgba(7, 12, 27, 0.88))",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  color: "#edf5ff",
  boxShadow: "0 12px 50px rgba(0, 0, 0, 0.35)",
  zIndex: 10,
  fontFamily: "Arial, sans-serif",
  scrollbarWidth: "thin",
  scrollbarColor: "rgba(110, 180, 255, 0.4) transparent",
};

function CloseButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close information panel"
      title="Close panel"
      style={{
        width: "30px",
        height: "30px",
        flexShrink: 0,
        display: "grid",
        placeItems: "center",
        borderRadius: "8px",
        border: "1px solid rgba(130, 175, 230, 0.2)",
        background: "rgba(125, 165, 215, 0.08)",
        color: "#a9c5e8",
        fontSize: "20px",
        lineHeight: 1,
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255, 90, 110, 0.15)";
        e.currentTarget.style.borderColor = "rgba(255, 110, 130, 0.5)";
        e.currentTarget.style.color = "#ff8b9b";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(125, 165, 215, 0.08)";
        e.currentTarget.style.borderColor = "rgba(130, 175, 230, 0.2)";
        e.currentTarget.style.color = "#a9c5e8";
      }}
    >
      ×
    </button>
  );
}

function PlanetInfoPanel({ data, onClose }) {
  if (!data) return null;

  const isSun = data.id === "sun";

  const details = isSun
    ? [
        ["Diameter", data.diameter],
        ["Age", data.age],
        ["Surface Temperature", data.temperature],
        ["Core Temperature", data.coreTemperature],
        ["Mass", data.mass],
        ["Gravity", data.gravity],
        ["Rotation", data.rotationPeriod],
        ["Luminosity", data.luminosity],
        ["Spectral Class", data.spectralClass],
        ["Distance from Earth", data.distanceFromEarth],
        ["Composition", data.composition],
        ["Energy Source", data.energySource],
        ["Layers", data.layers],
        ["Notable Features", data.notableFeatures],
      ]
    : Object.entries(data.facts || {}).map(([key, value]) => [
        LABELS[key] || key,
        value,
      ]);

  return (
    <div
      style={{
        ...panelStyle,
        animation: "holoxPanelIn 0.3s ease both",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "18px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
          }}
        >
          <div
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#64e8bd",
              boxShadow: "0 0 12px #64e8bd",
            }}
          />

          <div
            style={{
              fontSize: "10px",
              letterSpacing: "2px",
              color: "#75baff",
              fontWeight: 700,
            }}
          >
            HOLOX / CELESTIAL DATABASE
          </div>
        </div>

        <CloseButton onClick={onClose} />
      </div>

      {/* Planet identity */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "13px",
          marginBottom: "16px",
        }}
      >
        <div
          style={{
            width: "42px",
            height: "42px",
            flexShrink: 0,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 30%, white, ${
              data.atmosphere || data.color || "#ffae42"
            }, #111827)`,
            boxShadow: `0 0 22px ${
              data.atmosphere || data.color || "#ffae42"
            }66`,
          }}
        />

        <div>
          <div
            style={{
              fontSize: "25px",
              fontWeight: 700,
              letterSpacing: "-0.7px",
            }}
          >
            {data.name}
          </div>

          <div
            style={{
              color: "#8faac9",
              fontSize: "11px",
              marginTop: "3px",
            }}
          >
            {data.subtitle}
          </div>
        </div>
      </div>

      {/* Type */}
      <div
        style={{
          display: "inline-block",
          padding: "6px 10px",
          borderRadius: "6px",
          border: "1px solid rgba(111, 174, 255, 0.25)",
          background: "rgba(65, 132, 210, 0.12)",
          color: "#9bcaff",
          fontSize: "10px",
          letterSpacing: "1px",
          textTransform: "uppercase",
          marginBottom: "15px",
        }}
      >
        {data.type || "Celestial Object"}
      </div>

      {/* Description */}
      <p
        style={{
          color: "#b6c6dc",
          fontSize: "12px",
          lineHeight: 1.7,
          margin: "0 0 18px",
        }}
      >
        {data.description || "Explore this celestial object."}
      </p>

      <div
        style={{
          height: "1px",
          background: "rgba(130, 175, 230, 0.17)",
          marginBottom: "16px",
        }}
      />

      {/* Section heading */}
      <div
        style={{
          fontSize: "10px",
          letterSpacing: "1.7px",
          color: "#75baff",
          fontWeight: 700,
          marginBottom: "12px",
        }}
      >
        {isSun ? "STELLAR PARAMETERS" : "PLANETARY PARAMETERS"}
      </div>

      {/* Data grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "9px",
        }}
      >
        {details.map(([label, value]) => (
          <div
            key={label}
            style={{
              minWidth: 0,
              padding: "10px",
              borderRadius: "9px",
              background: "rgba(125, 165, 215, 0.075)",
              border: "1px solid rgba(130, 175, 230, 0.09)",
            }}
          >
            <div
              style={{
                color: "#829ab8",
                fontSize: "9px",
                letterSpacing: "0.5px",
                marginBottom: "6px",
                textTransform: "uppercase",
              }}
            >
              {label}
            </div>

            <div
              style={{
                color: "#edf5ff",
                fontSize: "11px",
                fontWeight: 600,
                lineHeight: 1.5,
                overflowWrap: "anywhere",
              }}
            >
              {String(value ?? "—")}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "17px",
          paddingTop: "12px",
          borderTop: "1px solid rgba(130, 175, 230, 0.15)",
          display: "flex",
          justifyContent: "space-between",
          color: "#627c9c",
          fontSize: "9px",
          letterSpacing: "1px",
        }}
      >
        <span>HOLOX EXPLORER</span>
        <span>DATA MODULE 01</span>
      </div>
    </div>
  );
}

export default function HologramScene({
  selectedPlanet,
  onSelect,
  controlsRef,
}) {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [lastSelectedData, setLastSelectedData] = useState(null);

  const selectedId =
    typeof selectedPlanet === "string" ? selectedPlanet : selectedPlanet?.id;

  const selectedData =
    selectedId === "sun"
      ? sunData
      : planets.find((planet) => planet.id === selectedId) ||
        (typeof selectedPlanet === "object" && selectedPlanet !== null
          ? selectedPlanet
          : null);

  // Remember the last selected object and open its information panel.
  useEffect(() => {
    if (selectedData) {
      setLastSelectedData(selectedData);
      setIsPanelOpen(true);
    }
  }, [selectedId]);

  // Close panel and remove planet selection.
  const handleClose = () => {
    setIsPanelOpen(false);
    onSelect?.(null);
  };

  // Restore the last selected planet and its information.
  const handleReopen = () => {
    if (!lastSelectedData) return;

    onSelect?.(lastSelectedData);
    setIsPanelOpen(true);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "600px",
        overflow: "hidden",
        background: "#030712",
      }}
    >
      <style>
        {`
          @keyframes holoxPanelIn {
            from {
              opacity: 0;
              transform: translateX(18px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes holoxButtonIn {
            from {
              opacity: 0;
              transform: translateY(-6px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      {/* 3D Scene */}
      <Canvas
        camera={{
          position: [0, 35, 75],
          fov: 45,
          near: 0.01,
          far: 5000,
        }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        style={{
          position: "absolute",
          inset: 0,
        }}
      >
        <Suspense fallback={null}>
          <SpaceBackground />

          <StarField />

          <NebulaSystems />

          <GalaxyDistribution />

          <ambientLight intensity={0.25} />

          <SolarSystem selectedPlanet={selectedPlanet} onSelect={onSelect} />

          <OrbitControls
            ref={controlsRef}
            makeDefault
            enablePan
            enableZoom
            minDistance={1.5}
            maxDistance={300}
            minPolarAngle={0.1}
            maxPolarAngle={Math.PI - 0.1}
            rotateSpeed={0.6}
            zoomSpeed={1.2}
            panSpeed={0.8}
            dampingFactor={0.06}
            enableDamping
          />

          <CameraRig
            selectedPlanet={selectedPlanet}
            controlsRef={controlsRef}
          />
        </Suspense>
      </Canvas>

      {/* Information panel */}
      {isPanelOpen && selectedData && (
        <PlanetInfoPanel data={selectedData} onClose={handleClose} />
      )}

      {/* Reopen button */}
      {!isPanelOpen && lastSelectedData && (
        <button
          type="button"
          onClick={handleReopen}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            padding: "11px 17px",
            borderRadius: "9px",
            border: "1px solid rgba(110, 180, 255, 0.3)",
            background: "rgba(8, 18, 38, 0.92)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            color: "#9bcaff",
            fontSize: "11px",
            letterSpacing: "1.5px",
            fontWeight: 700,
            cursor: "pointer",
            zIndex: 10,
            animation: "holoxButtonIn 0.25s ease both",
            boxShadow: "0 5px 25px rgba(0, 0, 0, 0.25)",
          }}
        >
          ⊕ INFO
        </button>
      )}
    </div>
  );
}
