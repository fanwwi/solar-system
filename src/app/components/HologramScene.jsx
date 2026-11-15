"use client";

import { useRef } from "react";

import { Canvas } from "@react-three/fiber";

import { OrbitControls, Stars } from "@react-three/drei";

import SolarSystem from "./solar-system/SolarSystem";
import CameraRig from "./solar-system/CameraRig";

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
        near: 0.1,
        far: 500,
      }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: false,
      }}
    >
      <color attach="background" args={["#03060d"]} />

      <ambientLight intensity={0.25} />

      <Stars
        radius={180}
        depth={100}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={0.4}
      />

      <SolarSystem selectedPlanet={selectedPlanet} onSelect={onSelect} />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan
        enableZoom
        minDistance={5}
        maxDistance={110}
        minPolarAngle={0.1}
        maxPolarAngle={Math.PI - 0.1}
        rotateSpeed={0.6}
        zoomSpeed={0.8}
      />

      <CameraRig selectedPlanet={selectedPlanet} controlsRef={controlsRef} />
    </Canvas>
  );
}
