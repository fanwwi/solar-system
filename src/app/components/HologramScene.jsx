"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Stars } from "@react-three/drei";
import * as THREE from "three";

import MinecraftBlock from "./MinecraftBlock";

// Управление 3D-блоком
function InteractiveBlock({ rotationRef }) {
  const groupRef = useRef(null);

  useFrame((state, delta) => {
    if (!groupRef.current || !rotationRef) return;

    const target = rotationRef.current;

    // Плавное вращение по X
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      target.x ?? 0,
      5,
      delta,
    );

    // Плавное вращение по Y
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      target.y ?? 0,
      5,
      delta,
    );

    // Плавное масштабирование
    const targetScale = THREE.MathUtils.clamp(target.scale ?? 1, 0.5, 2.5);

    const smoothScale = THREE.MathUtils.damp(
      groupRef.current.scale.x,
      targetScale,
      5,
      delta,
    );

    groupRef.current.scale.setScalar(smoothScale);
  });

  return (
    <group ref={groupRef}>
      <MinecraftBlock />
    </group>
  );
}

export default function HologramScene({ rotationRef }) {
  return (
    <Canvas
      camera={{
        position: [4, 3, 5],
        fov: 40,
      }}
      shadows
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
      }}
    >
      {/* BACKGROUND */}
      <color attach="background" args={["#080d12"]} />

      {/* LIGHTING */}
      <ambientLight intensity={1.2} />

      <directionalLight
        position={[5, 8, 5]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <pointLight position={[-4, 2, -3]} intensity={35} color="#42eaff" />

      <pointLight position={[4, -2, 3]} intensity={12} color="#8b5cf6" />

      {/* ENVIRONMENT */}
      <Stars radius={70} depth={40} count={1200} factor={2} fade />

      {/* INTERACTIVE MINECRAFT BLOCK */}
      <InteractiveBlock rotationRef={rotationRef} />

      {/* SHADOW */}
      <ContactShadows
        position={[0, -1.02, 0]}
        opacity={0.45}
        scale={5}
        blur={2}
        far={4}
      />

      {/* MOUSE CONTROLS */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={9}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI - 0.2}
        rotateSpeed={0.8}
      />
    </Canvas>
  );
}
