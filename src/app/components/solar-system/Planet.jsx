"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

import PlanetRings from "./PlanetRings";

function EarthClouds({ radius }) {
  const clouds = useTexture("/textures/earth/clouds.png");
  const cloudRef = useRef(null);

  clouds.colorSpace = THREE.NoColorSpace;
  clouds.anisotropy = 8;

  useFrame((_, delta) => {
    if (cloudRef.current) {
      cloudRef.current.rotation.y += delta * 0.012;
    }
  });

  return (
    <mesh ref={cloudRef}>
      <sphereGeometry args={[radius * 1.018, 96, 96]} />

      <meshStandardMaterial
        color="#ffffff"
        alphaMap={clouds}
        transparent
        opacity={0.65}
        depthWrite={false}
        side={THREE.FrontSide}
        roughness={1}
      />
    </mesh>
  );
}

function PlanetAtmosphere({ radius, color }) {
  const atmosphereRef = useRef(null);

  useFrame((_, delta) => {
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * 0.015;
    }
  });

  return (
    <mesh ref={atmosphereRef}>
      <sphereGeometry args={[radius * 1.055, 96, 96]} />

      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.12}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function Planet({ planet, selected, onSelect }) {
  const meshRef = useRef(null);

  const texture = useTexture(`/textures/${planet.id}/surface.png`);

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    meshRef.current.rotation.y += planet.rotationSpeed * delta * 60;
  });

  return (
    <group>
      {/* Planet surface */}
      <mesh
        ref={meshRef}
        onClick={(event) => {
          event.stopPropagation();
          onSelect?.(planet);
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[planet.radius, 128, 128]} />

        <meshStandardMaterial map={texture} roughness={0.95} metalness={0} />
      </mesh>

      {/* Earth clouds */}
      {planet.id === "earth" && <EarthClouds radius={planet.radius} />}

      {/* Planet atmosphere */}
      {planet.atmosphere && (
        <PlanetAtmosphere radius={planet.radius} color={planet.atmosphere} />
      )}

      {/* Saturn rings */}
      {planet.hasRings && <PlanetRings radius={planet.radius} />}

      {/* Selection indicator */}
      {selected && (
        <mesh>
          <sphereGeometry args={[planet.radius * 1.2, 64, 64]} />

          <meshBasicMaterial
            color="#42dfff"
            wireframe
            transparent
            opacity={0.18}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}
