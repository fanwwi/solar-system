"use client";

export default function PlanetRings({ radius }) {
  return (
    <group rotation={[Math.PI / 2.35, 0, 0]}>
      {/* Outer ring */}
      <mesh>
        <ringGeometry args={[radius * 1.35, radius * 2.25, 128]} />

        <meshStandardMaterial
          color="#c9ad82"
          side={2}
          transparent
          opacity={0.65}
          roughness={1}
        />
      </mesh>

      {/* Inner ring */}
      <mesh>
        <ringGeometry args={[radius * 1.12, radius * 1.32, 128]} />

        <meshStandardMaterial
          color="#e4d0a8"
          side={2}
          transparent
          opacity={0.85}
          roughness={1}
        />
      </mesh>

      {/* Dark division */}
      <mesh>
        <ringGeometry args={[radius * 1.72, radius * 1.82, 128]} />

        <meshBasicMaterial color="#11151b" side={2} />
      </mesh>
    </group>
  );
}
