"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const ASTEROID_COUNT = 3500;

function seededRandom(seed) {
  let value = seed;

  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

export default function AsteroidBelt({ innerRadius, outerRadius }) {
  const groupRef = useRef(null);
  const meshRef = useRef(null);

  // Generate asteroid positions and properties once.
  const asteroids = useMemo(() => {
    const random = seededRandom(42);
    const items = [];

    for (let i = 0; i < ASTEROID_COUNT; i++) {
      const angle = random() * Math.PI * 2;

      // Distribute asteroids throughout the belt.
      const radius = THREE.MathUtils.lerp(innerRadius, outerRadius, random());

      // Slightly irregular orbital plane.
      const y = (random() - 0.5) * 0.9;

      // Different sizes.
      const size = 0.025 + Math.pow(random(), 2) * 0.105;

      // Irregular asteroid proportions.
      const scale = [
        size * (0.7 + random() * 0.8),
        size * (0.55 + random() * 0.65),
        size * (0.7 + random() * 0.9),
      ];

      // Random rotation.
      const rotation = [
        random() * Math.PI,
        random() * Math.PI,
        random() * Math.PI,
      ];

      // Natural rocky colors.
      const color = new THREE.Color();

      const palette = [
        "#77716b",
        "#8a8176",
        "#625e59",
        "#a09280",
        "#504d49",
        "#9b8975",
        "#6c6862",
      ];

      color.set(palette[Math.floor(random() * palette.length)]);

      color.multiplyScalar(0.75 + random() * 0.5);

      items.push({
        position: [Math.cos(angle) * radius, y, Math.sin(angle) * radius],
        scale,
        rotation,
        color,
      });
    }

    return items;
  }, [innerRadius, outerRadius]);

  // Set up all asteroid instances.
  useLayoutEffect(() => {
    if (!meshRef.current) return;

    const mesh = meshRef.current;
    const dummy = new THREE.Object3D();

    asteroids.forEach((asteroid, index) => {
      dummy.position.set(...asteroid.position);
      dummy.rotation.set(...asteroid.rotation);
      dummy.scale.set(...asteroid.scale);

      dummy.updateMatrix();

      mesh.setMatrixAt(index, dummy.matrix);
      mesh.setColorAt(index, asteroid.color);
    });

    mesh.instanceMatrix.needsUpdate = true;

    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }

    mesh.computeBoundingSphere();
  }, [asteroids]);

  // Slowly rotate the entire asteroid belt.
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.012;
    }
  });

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={meshRef}
        args={[null, null, ASTEROID_COUNT]}
        frustumCulled
      >
        <dodecahedronGeometry args={[1, 0]} />

        <meshStandardMaterial
          color="#ffffff"
          roughness={1}
          metalness={0}
          flatShading
        />
      </instancedMesh>
    </group>
  );
}
