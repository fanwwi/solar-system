"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function seededRandom(seed) {
  let value = seed;

  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function createGalaxy({ count, radius, arms, seed }) {
  const random = seededRandom(seed);

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  const core = new THREE.Color("#fff4df");
  const warm = new THREE.Color("#ffbd91");
  const pink = new THREE.Color("#d58cff");
  const blue = new THREE.Color("#729eff");

  for (let i = 0; i < count; i++) {
    const distance = Math.pow(random(), 0.72) * radius;
    const arm = Math.floor(random() * arms);

    const angle =
      (arm / arms) * Math.PI * 2 +
      distance * 0.095 +
      (random() - 0.5) * (0.12 + distance * 0.009);

    const spread = 0.8 + distance * 0.055;

    const x = Math.cos(angle) * distance + (random() - 0.5) * spread;

    const y = Math.sin(angle) * distance + (random() - 0.5) * spread;

    const z = (random() - 0.5) * (1.2 + distance * 0.025);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const t = distance / radius;

    let color;

    if (t < 0.15) {
      color = core.clone().lerp(warm, t / 0.15);
    } else if (t < 0.5) {
      color = warm.clone().lerp(pink, (t - 0.15) / 0.35);
    } else {
      color = pink.clone().lerp(blue, (t - 0.5) / 0.5);
    }

    const brightness = 0.55 + random() * 0.9;

    colors[i * 3] = color.r * brightness;
    colors[i * 3 + 1] = color.g * brightness;
    colors[i * 3 + 2] = color.b * brightness;

    sizes[i] = 0.5 + random() * 1.8;
  }

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

  return geometry;
}

const galaxyVertexShader = `
  attribute float aSize;
  varying vec3 vColor;

  void main() {
    vColor = color;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    gl_PointSize = clamp(
      aSize * (180.0 / max(1.0, -mvPosition.z)),
      1.0,
      7.0
    );

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const galaxyFragmentShader = `
  varying vec3 vColor;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);

    float glow = exp(-d * d * 28.0);
    float core = exp(-d * d * 180.0);

    float alpha = glow * 0.65 + core * 0.35;

    gl_FragColor = vec4(vColor, alpha);
  }
`;

function Galaxy({
  position,
  scale = 1,
  rotation = [0, 0, 0],
  speed = 0.01,
  seed = 1,
  count = 24000,
  radius = 65,
}) {
  const groupRef = useRef();

  const geometry = useMemo(
    () =>
      createGalaxy({
        count,
        radius,
        arms: 4,
        seed,
      }),
    [count, radius, seed],
  );

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * speed;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Spiral arms */}
      <points geometry={geometry}>
        <shaderMaterial
          vertexShader={galaxyVertexShader}
          fragmentShader={galaxyFragmentShader}
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Bright galactic core */}
      <mesh>
        <sphereGeometry args={[radius * 0.075, 32, 32]} />
        <meshBasicMaterial
          color="#fff0d0"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Core glow */}
      <mesh scale={[1.9, 1.9, 1.9]}>
        <sphereGeometry args={[radius * 0.075, 32, 32]} />
        <meshBasicMaterial
          color="#c28cff"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export { Galaxy };

export default function GalaxyField() {
  return (
    <group>
      {/* Large spiral galaxy */}
      <Galaxy
        position={[0, 145, -650]}
        scale={1.2}
        rotation={[0.45, 0.25, 0]}
        speed={0.006}
        seed={12}
        count={42000}
        radius={75}
      />

      {/* Blue distant galaxy */}
      <Galaxy
        position={[-390, -100, -850]}
        scale={0.65}
        rotation={[1.1, 0.4, 0.7]}
        speed={-0.008}
        seed={42}
        count={20000}
        radius={65}
      />

      {/* Violet galaxy */}
      <Galaxy
        position={[370, 180, -1050]}
        scale={0.85}
        rotation={[0.7, 0.9, 0.3]}
        speed={0.007}
        seed={77}
        count={24000}
        radius={60}
      />
    </group>
  );
}
