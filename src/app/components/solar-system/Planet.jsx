"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

import PlanetRings from "./PlanetRings";

// ============================================
// EARTH DAY / NIGHT SHADER
// ============================================

const earthVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normal);

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const earthFragmentShader = `
  uniform sampler2D uDayMap;
  uniform sampler2D uNightMap;
  uniform vec3 uSunDirection;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  vec3 srgbToLinear(vec3 color) {
    return mix(
      color / 12.92,
      pow((color + 0.055) / 1.055, vec3(2.4)),
      step(vec3(0.04045), color)
    );
  }

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 sunDirection = normalize(uSunDirection);

    float light = dot(normal, sunDirection);

    // Soft day / night transition.
    float dayFactor = smoothstep(-0.12, 0.18, light);

    vec3 dayColor = srgbToLinear(
      texture2D(uDayMap, vUv).rgb
    );

    vec3 nightColor = srgbToLinear(
      texture2D(uNightMap, vUv).rgb
    );

    // Daylight illumination.
    float daylight = 0.18 + 0.82 * max(light, 0.0);

    vec3 illuminatedDay = dayColor * daylight;

    // City lights become visible on the dark side.
    vec3 illuminatedNight = nightColor * 1.65;

    // Blend the two textures.
    vec3 finalColor = mix(
      illuminatedNight,
      illuminatedDay,
      dayFactor
    );

    gl_FragColor = vec4(finalColor, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

// ============================================
// EARTH SURFACE
// ============================================

function EarthSurface({ dayTexture, radius, onSelect }) {
  const meshRef = useRef(null);

  const nightTexture = useTexture("/textures/earth/night.png");

  nightTexture.colorSpace = THREE.SRGBColorSpace;
  nightTexture.anisotropy = 8;

  const uniforms = useMemo(
    () => ({
      uDayMap: { value: dayTexture },
      uNightMap: { value: nightTexture },
      uSunDirection: {
        value: new THREE.Vector3(1, 0, 0),
      },
    }),
    [dayTexture, nightTexture],
  );

  const worldPosition = useMemo(() => new THREE.Vector3(), []);

  const worldQuaternion = useMemo(() => new THREE.Quaternion(), []);

  const sunDirection = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Earth rotation.
    meshRef.current.rotation.y += delta * 0.025;

    // Sun is located at the scene origin.
    meshRef.current.getWorldPosition(worldPosition);
    meshRef.current.getWorldQuaternion(worldQuaternion);

    sunDirection.copy(worldPosition).negate().normalize();

    const inverseQuaternion = worldQuaternion.clone().invert();

    sunDirection.applyQuaternion(inverseQuaternion);

    uniforms.uSunDirection.value.copy(sunDirection);
  });

  return (
    <mesh
      ref={meshRef}
      onClick={(event) => {
        event.stopPropagation();
        onSelect?.({ id: "earth" });
      }}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <sphereGeometry args={[radius, 128, 128]} />

      <shaderMaterial
        uniforms={uniforms}
        vertexShader={earthVertexShader}
        fragmentShader={earthFragmentShader}
      />
    </mesh>
  );
}

// ============================================
// EARTH CLOUDS
// ============================================

function EarthClouds({ radius }) {
  const clouds = useTexture("/textures/earth/clouds.png");

  const cloudRef = useRef(null);

  clouds.colorSpace = THREE.NoColorSpace;
  clouds.anisotropy = 8;

  useFrame((_, delta) => {
    if (cloudRef.current) {
      cloudRef.current.rotation.y += delta * 0.018;
    }
  });

  return (
    <mesh ref={cloudRef}>
      <sphereGeometry args={[radius * 1.012, 128, 128]} />

      <meshBasicMaterial
        color="#ffffff"
        alphaMap={clouds}
        transparent
        opacity={0.7}
        depthWrite={false}
        side={THREE.FrontSide}
      />
    </mesh>
  );
}

// ============================================
// EARTH ATMOSPHERE
// ============================================

const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    vNormal = normalize(normalMatrix * normal);
    vViewPosition = -mvPosition.xyz;

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const atmosphereFragmentShader = `
  uniform vec3 uColor;
  uniform float uIntensity;

  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(vViewPosition);

    float fresnel = 1.0 - max(
      dot(normal, viewDirection),
      0.0
    );

    float glow = pow(fresnel, 3.0);

    float alpha = glow * uIntensity;

    gl_FragColor = vec4(uColor, alpha);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function EarthAtmosphere({ radius }) {
  const atmosphereMaterial = useMemo(
    () => ({
      uniforms: {
        uColor: { value: new THREE.Color("#269cff") },
        uIntensity: { value: 0.75 },
      },
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
    }),
    [],
  );

  return (
    <group>
      <mesh>
        <sphereGeometry args={[radius * 1.045, 96, 96]} />

        <shaderMaterial
          {...atmosphereMaterial}
          transparent
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[radius * 1.075, 96, 96]} />

        <meshBasicMaterial
          color="#168cff"
          transparent
          opacity={0.035}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ============================================
// AURORA BOREALIS
// ============================================

const auroraVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;

    gl_Position = projectionMatrix *
      modelViewMatrix *
      vec4(position, 1.0);
  }
`;

const auroraFragmentShader = `
  uniform float uTime;

  varying vec2 vUv;

  void main() {
    float latitude = vUv.y;

    // Northern and southern polar regions.
    float north = smoothstep(
      0.76,
      0.91,
      latitude
    ) * (1.0 - smoothstep(0.96, 0.995, latitude));

    float south = smoothstep(
      0.04,
      0.09,
      latitude
    ) * (1.0 - smoothstep(0.19, 0.24, latitude));

    float polarMask = max(north, south);

    // Moving aurora curtains.
    float wave = sin(
      vUv.x * 48.0 +
      sin(vUv.x * 13.0 + uTime * 0.45) * 2.0 +
      uTime * 1.5
    );

    float curtains = smoothstep(
      -0.2,
      0.85,
      wave
    );

    float secondaryWave = sin(
      vUv.x * 75.0 - uTime * 1.1
    );

    curtains *= 0.65 + 0.35 * secondaryWave;

    // Green / cyan / violet colors.
    vec3 green = vec3(0.05, 1.0, 0.48);
    vec3 cyan = vec3(0.05, 0.75, 1.0);
    vec3 violet = vec3(0.48, 0.12, 1.0);

    vec3 auroraColor = mix(
      green,
      cyan,
      smoothstep(0.1, 0.8, curtains)
    );

    auroraColor = mix(
      auroraColor,
      violet,
      smoothstep(0.7, 1.0, curtains) * 0.35
    );

    float intensity = polarMask * curtains;

    // Keep the aurora subtle.
    float alpha = intensity * 0.48;

    gl_FragColor = vec4(
      auroraColor * intensity,
      alpha
    );

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function EarthAurora({ radius }) {
  const materialRef = useRef(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    [],
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[radius * 1.016, 128, 128]} />

      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={auroraVertexShader}
        fragmentShader={auroraFragmentShader}
        transparent
        blending={THREE.AdditiveBlending}
        side={THREE.FrontSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// ============================================
// OTHER PLANET ATMOSPHERES
// ============================================

function PlanetAtmosphere({ radius, color }) {
  return (
    <mesh>
      <sphereGeometry args={[radius * 1.055, 64, 64]} />

      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.12}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// ============================================
// MAIN PLANET COMPONENT
// ============================================

export default function Planet({ planet, selected, onSelect }) {
  const meshRef = useRef(null);

  const texture = useTexture(`/textures/${planet.id}/surface.png`);

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  const isEarth = planet.id === "earth";

  useFrame((_, delta) => {
    if (!meshRef.current || isEarth) return;

    meshRef.current.rotation.y += planet.rotationSpeed * delta * 60;
  });

  return (
    <group>
      {/* Planet surface */}
      {isEarth ? (
        <EarthSurface
          dayTexture={texture}
          radius={planet.radius}
          onSelect={() => onSelect?.(planet)}
        />
      ) : (
        <mesh
          ref={meshRef}
          onClick={(event) => {
            event.stopPropagation();
            onSelect?.(planet);
          }}
          onPointerOver={() => {
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "auto";
          }}
        >
          <sphereGeometry args={[planet.radius, 128, 128]} />

          <meshStandardMaterial map={texture} roughness={0.95} metalness={0} />
        </mesh>
      )}

      {/* Earth clouds */}
      {isEarth && <EarthClouds radius={planet.radius} />}

      {/* Earth atmosphere */}
      {isEarth && <EarthAtmosphere radius={planet.radius} />}

      {/* Aurora */}
      {isEarth && <EarthAurora radius={planet.radius} />}

      {/* Other atmospheres */}
      {!isEarth && planet.atmosphere && (
        <PlanetAtmosphere radius={planet.radius} color={planet.atmosphere} />
      )}

      {/* Saturn rings */}
      {planet.hasRings && <PlanetRings radius={planet.radius} />}

      {/* Selection indicator */}
      {selected && (
        <mesh>
          <sphereGeometry args={[planet.radius * 1.2, 64, 64]} />

          <meshBasicMaterial
            color="#42dfff"
            wireframe
            transparent
            opacity={0.18}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}
