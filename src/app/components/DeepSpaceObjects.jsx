"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function BlackHole({ position, scale = 1 }) {
  const diskRef = useRef();
  const glowRef = useRef();

  useFrame((_, delta) => {
    if (diskRef.current) {
      diskRef.current.rotation.z += delta * 0.18;
    }

    if (glowRef.current) {
      glowRef.current.material.opacity =
        0.35 + Math.sin(performance.now() * 0.001) * 0.08;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Event horizon */}
      <mesh>
        <sphereGeometry args={[7, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Accretion disk */}
      <group ref={diskRef} rotation={[0.35, 0, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[9, 17, 128]} />
          <meshBasicMaterial
            color="#ff8a42"
            side={THREE.DoubleSide}
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[17, 23, 128]} />
          <meshBasicMaterial
            color="#7738ff"
            side={THREE.DoubleSide}
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Gravitational glow approximation */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[9, 48, 48]} />
        <meshBasicMaterial
          color="#b66bff"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Outer halo */}
      <mesh>
        <sphereGeometry args={[27, 48, 48]} />
        <meshBasicMaterial
          color="#5425b8"
          transparent
          opacity={0.055}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function Quasar({ position, scale = 1 }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.12;
    }
  });

  return (
    <group position={position} scale={scale} ref={ref}>
      {/* Bright central source */}
      <mesh>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial color="#fff2c7" toneMapped={false} />
      </mesh>

      <mesh>
        <sphereGeometry args={[9, 32, 32]} />
        <meshBasicMaterial
          color="#ffb85c"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Opposing relativistic jets */}
      <mesh position={[0, 22, 0]}>
        <coneGeometry args={[3, 38, 32]} />
        <meshBasicMaterial
          color="#72cfff"
          transparent
          opacity={0.42}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0, -22, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[3, 38, 32]} />
        <meshBasicMaterial
          color="#72cfff"
          transparent
          opacity={0.42}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function Pulsar({ position, scale = 1 }) {
  const beamRef = useRef();

  useFrame((_, delta) => {
    if (beamRef.current) {
      beamRef.current.rotation.y += delta * 1.8;
      beamRef.current.rotation.x += delta * 0.35;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Neutron star */}
      <mesh>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial color="#d8f5ff" toneMapped={false} />
      </mesh>

      {/* Pulsar beams */}
      <group ref={beamRef}>
        <mesh position={[0, 13, 0]}>
          <coneGeometry args={[2.2, 25, 24]} />
          <meshBasicMaterial
            color="#55cfff"
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        <mesh position={[0, -13, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[2.2, 25, 24]} />
          <meshBasicMaterial
            color="#55cfff"
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Pulsar halo */}
      <mesh>
        <sphereGeometry args={[6, 32, 32]} />
        <meshBasicMaterial
          color="#2e9bff"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function DeepSpaceObjects() {
  return (
    <group>
      <BlackHole position={[-350, 220, -950]} scale={1.1} />

      <BlackHole position={[750, -250, -1500]} scale={0.65} />

      <Quasar position={[500, 420, -1250]} scale={1.1} />

      <Quasar position={[-850, -400, -1700]} scale={0.7} />

      <Pulsar position={[150, -450, -900]} scale={1.1} />

      <Pulsar position={[-650, 550, -1350]} scale={0.8} />
    </group>
  );
}
