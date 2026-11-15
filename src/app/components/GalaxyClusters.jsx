"use client";

import { Galaxy } from "./GalaxyField";

export default function GalaxyClusters() {
  return (
    <group>
      {/* Virgo-like cluster */}
      <group position={[-650, 280, -1450]}>
        <Galaxy
          position={[0, 0, 0]}
          scale={0.55}
          rotation={[0.4, 0.2, 0.5]}
          seed={501}
          count={9000}
          radius={65}
          speed={0.006}
        />

        <Galaxy
          position={[100, 45, -40]}
          scale={0.28}
          rotation={[1.1, 0.4, 0.2]}
          seed={502}
          count={4500}
          radius={55}
          speed={-0.008}
        />

        <Galaxy
          position={[-90, -55, 35]}
          scale={0.32}
          rotation={[0.5, 0.9, 0.4]}
          seed={503}
          count={5000}
          radius={50}
          speed={0.009}
        />

        <Galaxy
          position={[40, -110, 65]}
          scale={0.22}
          rotation={[0.2, 0.5, 1]}
          seed={504}
          count={3000}
          radius={50}
          speed={-0.006}
        />
      </group>

      {/* Distant galaxy group */}
      <group position={[850, 400, -1800]}>
        <Galaxy
          position={[0, 0, 0]}
          scale={0.42}
          rotation={[0.7, 0.3, 0.2]}
          seed={601}
          count={7000}
          radius={60}
          speed={0.007}
        />

        <Galaxy
          position={[-80, 70, 20]}
          scale={0.25}
          rotation={[0.3, 1, 0.5]}
          seed={602}
          count={3500}
          radius={55}
          speed={-0.009}
        />

        <Galaxy
          position={[75, -65, -45]}
          scale={0.3}
          rotation={[0.9, 0.2, 0.6]}
          seed={603}
          count={4000}
          radius={50}
          speed={0.006}
        />
      </group>

      {/* Southern distant cluster */}
      <group position={[100, -650, -1650]}>
        <Galaxy
          position={[0, 0, 0]}
          scale={0.38}
          rotation={[0.8, 0.2, 0.1]}
          seed={701}
          count={6000}
          radius={60}
          speed={0.005}
        />

        <Galaxy
          position={[85, 30, 15]}
          scale={0.2}
          rotation={[0.2, 0.7, 0.4]}
          seed={702}
          count={2500}
          radius={45}
          speed={-0.007}
        />
      </group>
    </group>
  );
}
