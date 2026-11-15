"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import SolarSystem from "./solar-system/SolarSystem";
import CameraRig from "./solar-system/CameraRig";

import SpaceBackground from "./SpaceBackground";
import GalaxyDistribution from "./GalaxyDistribution";
import NebulaSystems from "./NebulaSystems";

export default function HologramScene({
  selectedPlanet,
  onSelect,
  controlsRef,
}) {
  return (
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
    >
      <Suspense fallback={null}>
        {/* Deep space background */}
        <SpaceBackground />

        {/* Nebula clouds distributed around the scene */}
        <NebulaSystems />

        {/* Galaxies distributed in all directions */}
        <GalaxyDistribution />

        {/* Lighting */}
        <ambientLight intensity={0.25} />

        {/* Solar system */}
        <SolarSystem selectedPlanet={selectedPlanet} onSelect={onSelect} />

        {/* Camera controls */}
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

        {/* Planet focus camera */}
        <CameraRig selectedPlanet={selectedPlanet} controlsRef={controlsRef} />
      </Suspense>
    </Canvas>
  );
}
