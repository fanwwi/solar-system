"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function Sun() {
  const sunRef = useRef(null);
  const glowRef = useRef(null);

  const texture = useTexture("/textures/sun/sun.png");

  texture.colorSpace = THREE.SRGBColorSpace;

  useFrame((state, delta) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.025;
    }

    if (glowRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.025;

      glowRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      <mesh ref={sunRef}>
        <sphereGeometry args={[3.5, 128, 128]} />

        <meshBasicMaterial map={texture} />
      </mesh>

      <mesh ref={glowRef}>
        <sphereGeometry args={[3.85, 64, 64]} />

        <meshBasicMaterial
          color="#ff9c32"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      <pointLight color="#fff0ce" intensity={180} distance={150} decay={1.5} />
    </group>
  );
}
