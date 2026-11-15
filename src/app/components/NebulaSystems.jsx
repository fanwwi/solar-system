"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
  varying vec3 vLocalPosition;

  void main() {
    vLocalPosition = position;

    gl_Position =
      projectionMatrix *
      modelViewMatrix *
      vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uSeed;
  uniform vec3 uCameraLocal;

  varying vec3 vLocalPosition;

  float hash31(vec3 p) {
    p = fract(p * 0.1031);
    p += dot(p, p.yzx + 33.33);

    return fract((p.x + p.y) * p.z);
  }

  float noise3D(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);

    f = f * f * (3.0 - 2.0 * f);

    float n000 = hash31(i);
    float n100 = hash31(i + vec3(1.0, 0.0, 0.0));
    float n010 = hash31(i + vec3(0.0, 1.0, 0.0));
    float n110 = hash31(i + vec3(1.0, 1.0, 0.0));

    float n001 = hash31(i + vec3(0.0, 0.0, 1.0));
    float n101 = hash31(i + vec3(1.0, 0.0, 1.0));
    float n011 = hash31(i + vec3(0.0, 1.0, 1.0));
    float n111 = hash31(i + vec3(1.0, 1.0, 1.0));

    float x00 = mix(n000, n100, f.x);
    float x10 = mix(n010, n110, f.x);
    float x01 = mix(n001, n101, f.x);
    float x11 = mix(n011, n111, f.x);

    return mix(
      mix(x00, x10, f.y),
      mix(x01, x11, f.y),
      f.z
    );
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 4; i++) {
      value += noise3D(p) * amplitude;

      p = p * 2.02 + vec3(17.1, 9.2, 13.7);
      amplitude *= 0.5;
    }

    return value;
  }

  vec2 intersectBox(vec3 origin, vec3 direction) {
    vec3 invDir = 1.0 / direction;

    vec3 t0 = (-vec3(1.0) - origin) * invDir;
    vec3 t1 = (vec3(1.0) - origin) * invDir;

    vec3 tMin = min(t0, t1);
    vec3 tMax = max(t0, t1);

    float nearDist = max(
      max(tMin.x, tMin.y),
      tMin.z
    );

    float farDist = min(
      min(tMax.x, tMax.y),
      tMax.z
    );

    return vec2(nearDist, farDist);
  }

  void main() {
    vec3 rayOrigin = uCameraLocal;

    vec3 rayDirection = normalize(
      vLocalPosition - rayOrigin
    );

    vec2 hit = intersectBox(
      rayOrigin,
      rayDirection
    );

    float startDist = max(hit.x, 0.0);
    float endDist = hit.y;

    if (endDist <= startDist) {
      discard;
    }

    float stepSize = (endDist - startDist) / 28.0;

    vec3 accumulatedColor = vec3(0.0);
    float transmittance = 1.0;

    float time = uTime * 0.012;

    for (int i = 0; i < 28; i++) {
      float distanceAlongRay =
        startDist + (float(i) + 0.5) * stepSize;

      vec3 p = rayOrigin +
        rayDirection * distanceAlongRay;

      // Soft organic volume boundary
      float radius = length(
        p * vec3(0.82, 1.0, 0.82)
      );

      float volumeMask = 1.0 - smoothstep(
        0.38,
        1.12,
        radius
      );

      if (volumeMask > 0.005) {
        // Slowly evolving gas turbulence
        vec3 samplePosition =
          p * 2.5 +
          vec3(
            time,
            -time * 0.7,
            time * 0.45
          ) +
          uSeed;

        float warp = noise3D(
          samplePosition * 0.7
        );

        samplePosition +=
          vec3(warp - 0.5) * 0.9;

        float cloud = fbm(
          samplePosition * 2.8
        );

        float detail = noise3D(
          samplePosition * 8.0
        );

        float density = smoothstep(
          0.38,
          0.73,
          cloud
        );

        density *= volumeMask;

        // Small dust and gas details
        density +=
          smoothstep(0.64, 0.86, detail) *
          volumeMask *
          0.12;

        float sampleAlpha = clamp(
          density * uOpacity * 0.085,
          0.0,
          0.12
        );

        // Color variations inside the cloud
        float brightness =
          0.55 + cloud * 1.25 + detail * 0.2;

        vec3 sampleColor =
          uColor * brightness;

        accumulatedColor +=
          sampleColor *
          sampleAlpha *
          transmittance;

        transmittance *=
          1.0 - sampleAlpha;
      }

      if (transmittance < 0.025) {
        break;
      }
    }

    float finalAlpha = 1.0 - transmittance;

    if (finalAlpha < 0.003) {
      discard;
    }

    gl_FragColor = vec4(
      accumulatedColor,
      finalAlpha
    );
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
  const random = seededRandom(91827);

  const colors = [
    "#7355ff",
    "#386cff",
    "#a14cff",
    "#e75caa",
    "#35a9e8",
    "#38d1cf",
    "#bd79ef",
    "#ff83b9",
    "#5b91e8",
    "#8c61d9",
    "#43a8b9",
    "#d88ab8",
  ];

  return Array.from({ length: 12 }, (_, i) => {
    const y = random() * 2 - 1;
    const angle = random() * Math.PI * 2;

    const horizontal = Math.sqrt(1 - y * y);

    const direction = [
      horizontal * Math.cos(angle),
      y,
      horizontal * Math.sin(angle),
    ];

    const distance = 300 + random() * 650;

    return {
      id: i,

      position: direction.map((value) => value * distance),

      rotation: [
        random() * Math.PI,
        random() * Math.PI * 2,
        random() * Math.PI,
      ],

      scale: [110 + random() * 100, 85 + random() * 90, 100 + random() * 110],

      color: colors[i],

      opacity: 0.8 + random() * 0.5,

      seed: random() * 100,
    };
  });
}

const NEBULAS = createNebulaData();

function NebulaVolume({ position, rotation, scale, color, opacity, seed }) {
  const meshRef = useRef();

  const worldCamera = useMemo(() => new THREE.Vector3(), []);

  const localCamera = useMemo(() => new THREE.Vector3(), []);

  const inverseMatrix = useMemo(() => new THREE.Matrix4(), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },

      uColor: {
        value: new THREE.Color(color),
      },

      uOpacity: {
        value: opacity,
      },

      uSeed: {
        value: seed,
      },

      uCameraLocal: {
        value: new THREE.Vector3(),
      },
    }),
    [color, opacity, seed],
  );

  useFrame(({ clock, camera }) => {
    if (!meshRef.current) return;

    meshRef.current.updateMatrixWorld();

    camera.getWorldPosition(worldCamera);

    inverseMatrix.copy(meshRef.current.matrixWorld).invert();

    localCamera.copy(worldCamera).applyMatrix4(inverseMatrix);

    uniforms.uCameraLocal.value.copy(localCamera);

    uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      frustumCulled={false}
      renderOrder={-2}
    >
      <boxGeometry args={[2, 2, 2]} />

      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        depthTest={false}
        side={THREE.BackSide}
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
        <NebulaVolume key={nebula.id} {...nebula} />
      ))}
    </group>
  );
}
