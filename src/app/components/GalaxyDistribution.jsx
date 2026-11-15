"use client";

import { Galaxy } from "./GalaxyField";

function seededRandom(seed) {
  let value = seed;

  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

const random = seededRandom(84721);

function createGalaxyPositions() {
  const galaxies = [];
  const count = 18;

  for (let i = 0; i < count; i++) {
    // Равномерное распределение направлений по сфере
    const y = random() * 2 - 1;
    const angle = random() * Math.PI * 2;
    const horizontal = Math.sqrt(1 - y * y);

    const direction = [
      horizontal * Math.cos(angle),
      y,
      horizontal * Math.sin(angle),
    ];

    const distance = 550 + random() * 950;

    galaxies.push({
      id: i,
      position: direction.map((v) => v * distance),
      scale: 0.25 + random() * 0.65,
      rotation: [
        random() * Math.PI,
        random() * Math.PI * 2,
        random() * Math.PI,
      ],
      seed: 100 + i * 17,
      count: 5000 + Math.floor(random() * 7000),
    });
  }

  return galaxies;
}

const GALAXIES = createGalaxyPositions();

export default function GalaxyDistribution() {
  return (
    <group>
      {GALAXIES.map((galaxy) => (
        <Galaxy
          key={galaxy.id}
          position={galaxy.position}
          scale={galaxy.scale}
          rotation={galaxy.rotation}
          seed={galaxy.seed}
          count={galaxy.count}
        />
      ))}
    </group>
  );
}
