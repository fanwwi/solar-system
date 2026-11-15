"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function randomGenerator(seed) {
  let value = seed;

  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function createCosmicDust(count = 18000, seed = 42) {
  const random = randomGenerator(seed);

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  const palette = [
    new THREE.Color("#526bbd"),
    new THREE.Color("#9274d9"),
    new THREE.Color("#d5a5e9"),
    new THREE.Color("#78a8db"),
    new THREE.Color("#e7c9ed"),
  ];

  for (let i = 0; i < count; i++) {
    // Distribute particles along soft, curved cosmic filaments.
    const filament = Math.floor(random() * 7);
    const t = random();

    const angle = (filament / 7) * Math.PI * 2;

    const radius = 180 + t * 850;

    const centerX = Math.cos(angle) * radius;
    const centerY = Math.sin(angle) * radius * 0.55;
    const centerZ = -900 - t * 900;

    const spread = 25 + random() * 100;

    positions[i * 3] = centerX + (random() - 0.5) * spread;

    positions[i * 3 + 1] = centerY + (random() - 0.5) * spread;

    positions[i * 3 + 2] = centerZ + (random() - 0.5) * spread * 1.8;

    const color = palette[Math.floor(random() * palette.length)];

    const brightness = 0.3 + random() * 0.7;

    colors[i * 3] = color.r * brightness;
    colors[i * 3 + 1] = color.g * brightness;
    colors[i * 3 + 2] = color.b * brightness;

    sizes[i] = 0.5 + random() * 2.5;
  }

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

  return geometry;
}

const dustVertexShader = `
  attribute float aSize;

  varying vec3 vColor;

  void main() {
    vColor = color;

    vec4 mvPosition =
      modelViewMatrix * vec4(position, 1.0);

    gl_PointSize = clamp(
      aSize * (240.0 / max(1.0, -mvPosition.z)),
      1.0,
      6.0
    );

    gl_Position =
      projectionMatrix * mvPosition;
  }
`;

const dustFragmentShader = `
  varying vec3 vColor;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;

    float distanceToCenter = length(uv);

    float glow = exp(
      -distanceToCenter * distanceToCenter * 14.0
    );

    float alpha = glow * 0.32;

    gl_FragColor = vec4(vColor, alpha);
  }
`;

function CosmicDustLayer({ position = [0, 0, 0], count = 18000, seed = 42 }) {
  const pointsRef = useRef();

  const geometry = useMemo(() => createCosmicDust(count, seed), [count, seed]);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y =
        Math.sin(clock.elapsedTime * 0.025) * 0.015;

      pointsRef.current.rotation.z =
        Math.sin(clock.elapsedTime * 0.018) * 0.008;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} position={position}>
      <shaderMaterial
        vertexShader={dustVertexShader}
        fragmentShader={dustFragmentShader}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function CosmicCloud({ position, scale, color, seed = 1 }) {
  const geometry = useMemo(() => {
    const random = randomGenerator(seed);

    const count = 5000;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Gaussian-like distribution creates irregular clouds.
      const gaussian = () => {
        const u = Math.max(random(), 0.0001);
        const v = random();

        return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
      };

      positions[i * 3] = gaussian() * 0.28;
      positions[i * 3 + 1] = gaussian() * 0.2;
      positions[i * 3 + 2] = gaussian() * 0.1;

      sizes[i] = 0.7 + random() * 2.2;
    }

    const result = new THREE.BufferGeometry();

    result.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    result.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    return result;
  }, [seed]);

  return (
    <points geometry={geometry} position={position} scale={scale}>
      <pointsMaterial
        color={color}
        size={1.8}
        sizeAttenuation
        transparent
        opacity={0.12}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function CosmicWeb() {
  return (
    <group>
      {/* Main cosmic dust field */}
      <CosmicDustLayer count={22000} seed={42} />

      {/* Diffuse cosmic structures */}
      <CosmicCloud
        position={[-450, 250, -1100]}
        scale={[420, 300, 230]}
        color="#6478d9"
        seed={11}
      />

      <CosmicCloud
        position={[350, -250, -1450]}
        scale={[500, 320, 260]}
        color="#9d65d5"
        seed={22}
      />

      <CosmicCloud
        position={[850, 400, -1800]}
        scale={[380, 260, 200]}
        color="#5d9edb"
        seed={33}
      />

      <CosmicCloud
        position={[-850, -400, -1700]}
        scale={[450, 300, 220]}
        color="#bd78ca"
        seed={44}
      />
    </group>
  );
}
