"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;

    gl_Position = projectionMatrix *
      modelViewMatrix *
      vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uSeed;

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(
      sin(dot(p, vec2(127.1, 311.7)) + uSeed) *
      43758.5453123
    );
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    f = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)),
          hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 6; i++) {
      value += noise(p) * amplitude;
      p = p * 2.03 + vec2(13.7, 9.2);
      amplitude *= 0.5;
    }

    return value;
  }

  void main() {
    vec2 p = vUv * 2.0 - 1.0;

    float time = uTime * 0.009;

    // Органическое искажение формы облака
    float warp1 = fbm(
      p * 2.0 + vec2(time, -time * 0.7)
    );

    float warp2 = fbm(
      p * 3.2 - vec2(time * 0.5, time)
    );

    vec2 distorted = p;

    distorted += vec2(
      warp1 - 0.5,
      warp2 - 0.5
    ) * 0.65;

    // Основная структура туманности
    float largeCloud = fbm(
      distorted * vec2(3.0, 2.0)
    );

    float mediumCloud = fbm(
      distorted * vec2(7.0, 5.0) +
      vec2(time * 0.4, -time)
    );

    float fineCloud = fbm(
      distorted * 15.0 + uSeed
    );

    float density =
      largeCloud * 0.52 +
      mediumCloud * 0.33 +
      fineCloud * 0.15;

    // Неровная граница облака
    float shapeNoise = fbm(
      distorted * 2.4 + vec2(uSeed, 0.0)
    );

    float radius = length(
      distorted * vec2(0.78, 1.05)
    );

    float irregularRadius =
      radius + (shapeNoise - 0.5) * 0.95;

    // Очень мягкое растворение краёв
    float edgeMask = 1.0 - smoothstep(
      0.30,
      1.55,
      irregularRadius
    );

    // Облачные слои
    float mainCloud = smoothstep(
      0.36,
      0.68,
      density
    );

    float softCloud = smoothstep(
      0.24,
      0.65,
      mediumCloud
    );

    float brightCloud = smoothstep(
      0.48,
      0.78,
      fineCloud
    );

    // Мягкие волокна и пылевые структуры
    float filaments = pow(
      max(0.0, mediumCloud - 0.35),
      1.5
    );

    float cloudDensity =
      mainCloud * 0.55 +
      softCloud * 0.25 +
      brightCloud * 0.10 +
      filaments * 0.35;

    // Дополнительное исчезновение у краёв самой плоскости
    float planeEdge = min(
      min(vUv.x, 1.0 - vUv.x),
      min(vUv.y, 1.0 - vUv.y)
    );

    float planeMask = smoothstep(
      0.0,
      0.18,
      planeEdge
    );

    float alpha =
      cloudDensity *
      edgeMask *
      planeMask *
      uOpacity *
      0.65;

    // Неоднородная яркость
    float brightness =
      0.45 +
      largeCloud * 0.75 +
      fineCloud * 0.35;

    vec3 color = uColor * brightness;

    gl_FragColor = vec4(color, alpha);
  }
`;

function seededRandom(seed) {
  let value = seed;

  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function createNebulaData() {
  const random = seededRandom(72139);

  const colors = [
    "#6244ff",
    "#345eff",
    "#9b43ff",
    "#ff4b9b",
    "#20a6e8",
    "#28d5cf",
    "#e27aaf",
    "#7c6aff",
    "#d18bff",
    "#426bce",
    "#f18cba",
    "#276eae",
    "#8d54d9",
    "#35a5a0",
    "#bd70e9",
    "#e4a06e",
    "#4e8dff",
    "#a54bca",
    "#7250c9",
    "#3c9acb",
    "#d66b9e",
    "#8e73ff",
  ];

  return Array.from({ length: 30 }, (_, i) => {
    const y = random() * 2 - 1;
    const angle = random() * Math.PI * 2;
    const horizontal = Math.sqrt(1 - y * y);

    const direction = [
      horizontal * Math.cos(angle),
      y,
      horizontal * Math.sin(angle),
    ];

    const distance = 260 + random() * 850;

    return {
      id: i,

      position: direction.map((v) => v * distance),

      rotation: [
        random() * Math.PI,
        random() * Math.PI * 2,
        random() * Math.PI,
      ],

      width: 260 + random() * 340,
      height: 180 + random() * 260,

      color: colors[i % colors.length],

      opacity: 0.18 + random() * 0.18,

      seed: random() * 100,
    };
  });
}

const NEBULAS = createNebulaData();

function NebulaCloud({
  position,
  rotation,
  width,
  height,
  color,
  opacity,
  seed,
}) {
  const materialRef = useRef();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
      uSeed: { value: seed },
    }),
    [color, opacity, seed],
  );

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  return (
    <mesh position={position} rotation={rotation} frustumCulled={false}>
      <planeGeometry args={[width, height, 1, 1]} />

      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        depthTest={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

export default function NebulaSystems() {
  return (
    <group>
      {NEBULAS.map((nebula) => (
        <NebulaCloud key={nebula.id} {...nebula} />
      ))}
    </group>
  );
}
