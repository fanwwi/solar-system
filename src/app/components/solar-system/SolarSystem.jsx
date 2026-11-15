"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

import { planets } from "@/app/data/planets";

import Sun from "./Sun";
import Planet from "./Planet";
import PlanetOrbit from "./PlanetOrbit";
import AsteroidBelt from "./AsteroidBelt";

function OrbitingPlanet({ planet, selectedPlanet, onSelect }) {
  const groupRef = useRef(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;
    const angle = time * planet.orbitSpeed * 0.12;

    groupRef.current.position.x = Math.cos(angle) * planet.orbitRadius;

    groupRef.current.position.z = Math.sin(angle) * planet.orbitRadius;
  });

  return (
    <group ref={groupRef}>
      <Planet
        planet={planet}
        selected={selectedPlanet?.id === planet.id}
        onSelect={onSelect}
      />
    </group>
  );
}

export default function SolarSystem({ selectedPlanet, onSelect }) {
  const mars = planets.find((planet) => planet.id === "mars");

  const jupiter = planets.find((planet) => planet.id === "jupiter");

  return (
    <group>
      {/* Sun */}
      <Sun />

      {/* Planet orbits */}
      {planets.map((planet) => (
        <PlanetOrbit key={`orbit-${planet.id}`} radius={planet.orbitRadius} />
      ))}

      {/* Asteroid belt between Mars and Jupiter */}
      {mars && jupiter && (
        <AsteroidBelt
          innerRadius={mars.orbitRadius * 1.12}
          outerRadius={jupiter.orbitRadius * 0.88}
        />
      )}

      {/* Orbiting planets */}
      {planets.map((planet) => (
        <OrbitingPlanet
          key={planet.id}
          planet={planet}
          selectedPlanet={selectedPlanet}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}
