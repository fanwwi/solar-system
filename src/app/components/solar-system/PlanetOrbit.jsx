"use client";

import * as THREE from "three";

export default function PlanetOrbit({ radius }) {
  const points = [];

  const segments = 256;

  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;

    points.push(
      new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius),
    );
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#54748e" transparent opacity={0.24} />
    </line>
  );
}
