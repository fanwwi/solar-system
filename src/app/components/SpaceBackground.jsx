"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

// ============================================
// NEBULA SHADERS
// ============================================

const nebulaVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;

    gl_Position = projectionMatrix *
      modelViewMatrix *
      vec4(position, 1.0);
  }
`;

const nebulaFragmentShader = `
  uniform float uTime;

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(
      sin(dot(p, vec2(127.1, 311.7))) *
      43758.5453
    );
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(
        hash(i),
        hash(i + vec2(1.0, 0.0)),
        u.x
      ),
      mix(
        hash(i + vec2(0.0, 1.0)),
        hash(i + vec2(1.0, 1.0)),
        u.x
      ),
      u.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 5; i++) {
      value += noise(p) * amplitude;
      p *= 2.0;
      amplitude *= 0.5;
    }

    return value;
  }

  void main() {
    vec2 uv = vUv;

    // Large-scale cloud formations.
    vec2 drift = vec2(
      uTime * 0.003,
      -uTime * 0.002
    );

    float cloud = fbm(uv * 5.0 + drift);

    float detail = fbm(
      uv * 12.0 -
      drift * 2.0
    );

    float formation = smoothstep(
      0.38,
      0.78,
      cloud + detail * 0.28
    );

    // Several soft nebula regions.
    float regionA = exp(
      -length((uv - vec2(0.27, 0.62)) *
      vec2(2.0, 3.0)) * 2.2
    );

    float regionB = exp(
      -length((uv - vec2(0.78, 0.35)) *
      vec2(2.5, 2.0)) * 2.0
    );

    float regionC = exp(
      -length((uv - vec2(0.55, 0.82)) *
      vec2(3.0, 2.0)) * 2.5
    );

    float regions = max(
      regionA,
      max(regionB, regionC)
    );

    float intensity = formation * regions;

    // Cosmic color palette.
    vec3 deepBlue = vec3(0.015, 0.055, 0.22);
    vec3 purple = vec3(0.19, 0.055, 0.38);
    vec3 cyan = vec3(0.025, 0.30, 0.48);
    vec3 magenta = vec3(0.36, 0.055, 0.30);

    vec3 color = mix(
      deepBlue,
      purple,
      smoothstep(0.25, 0.8, detail)
    );

    color = mix(
      color,
      cyan,
      smoothstep(0.55, 0.9, cloud) * 0.7
    );

    color = mix(
      color,
      magenta,
      regionB * 0.45
    );

    float alpha = intensity * 0.34;

    gl_FragColor = vec4(
      color * intensity,
      alpha
    );
  }
`;

// ============================================
// COSMIC DUST SHADERS
// ============================================

const dustVertexShader = `
  attribute float aSize;
  attribute float aAlpha;

  uniform float uTime;

  varying float vAlpha;

  void main() {
    vec3 animatedPosition = position;

    animatedPosition.y +=
      sin(uTime * 0.15 + position.x * 0.1) * 0.12;

    vec4 mvPosition =
      modelViewMatrix * vec4(animatedPosition, 1.0);

    gl_Position = projectionMatrix * mvPosition;

    gl_PointSize = clamp(
      aSize * (220.0 / max(1.0, -mvPosition.z)),
      1.0,
      5.0
    );

    vAlpha = aAlpha;
  }
`;

const dustFragmentShader = `
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;

    float distanceToCenter = length(uv);

    float glow = 1.0 - smoothstep(
      0.05,
      0.5,
      distanceToCenter
    );

    float alpha = glow * vAlpha;

    if (alpha < 0.01) discard;

    vec3 color = vec3(0.48, 0.72, 1.0);

    gl_FragColor = vec4(color, alpha);
  }
`;

// ============================================
// SEEDED RANDOM
// ============================================

function seededRandom(seed) {
  let value = seed;

  return () => {
    value = (value * 16807) % 2147483647;

    return (value - 1) / 2147483646;
  };
}

// ============================================
// SPACE BACKGROUND
// ============================================

export default function SpaceBackground() {
  const groupRef = useRef(null);
  const nebulaRef = useRef(null);
  const dustMaterialRef = useRef(null);
  const nebulaMaterialRef = useRef(null);

  const { camera } = useThree();

  const nebulaUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    [],
  );

  const dustUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    [],
  );

  // Generate dust particles once.
  const dustGeometry = useMemo(() => {
    const random = seededRandom(2026);

    const count = 4500;

    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const alphas = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 80 + random() * 420;

      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);

      positions[i * 3 + 1] = radius * Math.cos(phi);

      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      sizes[i] = 2 + random() * 5;
      alphas[i] = 0.12 + random() * 0.48;
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    geometry.setAttribute("aAlpha", new THREE.BufferAttribute(alphas, 1));

    return geometry;
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Keep the background centered around the camera.
      groupRef.current.position.copy(camera.position);
    }

    if (nebulaRef.current) {
      nebulaRef.current.rotation.y += delta * 0.0008;
      nebulaRef.current.rotation.z += delta * 0.0003;
    }

    if (nebulaMaterialRef.current) {
      nebulaMaterialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }

    if (dustMaterialRef.current) {
      dustMaterialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Deep space base */}
      <color attach="background" args={["#02030a"]} />

      {/* Nebula layer */}
      <mesh ref={nebulaRef} renderOrder={-1000}>
        <sphereGeometry args={[850, 64, 64]} />

        <shaderMaterial
          ref={nebulaMaterialRef}
          uniforms={nebulaUniforms}
          vertexShader={nebulaVertexShader}
          fragmentShader={nebulaFragmentShader}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
          depthTest={false}
        />
      </mesh>

      {/* Existing starfield, enhanced */}
      <Stars
        radius={800}
        depth={300}
        count={8500}
        factor={4}
        saturation={0.25}
        fade
        speed={0.25}
      />

      {/* Distant tiny stars */}
      <Stars
        radius={900}
        depth={400}
        count={3500}
        factor={1.8}
        saturation={0.1}
        fade
        speed={0.08}
      />

      {/* Cosmic dust */}
      <points geometry={dustGeometry} renderOrder={-900}>
        <shaderMaterial
          ref={dustMaterialRef}
          uniforms={dustUniforms}
          vertexShader={dustVertexShader}
          fragmentShader={dustFragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
