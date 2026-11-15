"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

import { planets } from "@/app/data/planets";

import Sun from "./Sun";
import Planet from "./Planet";
import PlanetOrbit from "./PlanetOrbit";

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
  return (
    <group>
      <Sun />

      {planets.map((planet) => (
        <group key={planet.id}>
          <PlanetOrbit radius={planet.orbitRadius} />

          <OrbitingPlanet
            planet={planet}
            selectedPlanet={selectedPlanet}
            onSelect={onSelect}
          />
        </group>
      ))}
    </group>
  );
}
