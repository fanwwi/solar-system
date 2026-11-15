"use client";

import { useMemo } from "react";
import * as THREE from "three";

const OUTER_RADIUS = 2.55;

function smoothstep(min, max, value) {
  const t = THREE.MathUtils.clamp((value - min) / (max - min), 0, 1);

  return t * t * (3 - 2 * t);
}

function createRingTexture() {
  const size = 1024;
  const canvas = document.createElement("canvas");

  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d");
  const image = context.createImageData(size, size);
  const data = image.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = (x / (size - 1)) * 2 - 1;
      const ny = (y / (size - 1)) * 2 - 1;

      // Distance from the center gives concentric ring bands.
      const radial = Math.sqrt(nx * nx + ny * ny);
      const r = radial * OUTER_RADIUS;

      let red = 0;
      let green = 0;
      let blue = 0;
      let alpha = 0;

      function addBand(start, end, color, opacity) {
        const fade = Math.min(
          smoothstep(start, start + 0.018, r),
          1 - smoothstep(end - 0.018, end, r),
        );

        if (fade <= 0) return;

        red = color[0];
        green = color[1];
        blue = color[2];

        alpha = Math.max(alpha, opacity * fade);
      }

      // C ring — darker inner region.
      addBand(1.2, 1.52, [111, 91, 70], 0.48);

      // B ring — the densest and brightest region.
      addBand(1.52, 1.95, [211, 190, 157], 0.96);

      // Cassini Division — a prominent dark gap.
      // Keep this completely transparent.
      if (r >= 1.95 && r <= 2.02) {
        alpha = 0;
      }

      // A ring — slightly darker than the B ring.
      addBand(2.02, 2.34, [174, 150, 119], 0.82);

      // Encke Gap — narrow gap inside the A ring.
      if (r >= 2.205 && r <= 2.225) {
        alpha = 0.03;
      }

      // Subtle radial variations in the ring material.
      const fineBands =
        Math.sin(r * 260) * 0.045 +
        Math.sin(r * 570) * 0.025 +
        Math.sin(r * 1100) * 0.012;

      const variation = 1 + fineBands;

      red *= variation;
      green *= variation;
      blue *= variation;

      // A very subtle warm color variation.
      const warm = Math.sin(r * 38) * 3;

      red += warm;
      green += warm * 0.55;

      // Soft outer ring F.
      if (r >= 2.37 && r <= 2.4) {
        const fade =
          smoothstep(2.37, 2.375, r) * (1 - smoothstep(2.395, 2.4, r));

        red = 190;
        green = 169;
        blue = 137;
        alpha = Math.max(alpha, 0.38 * fade);
      }

      // Extremely faint outer ring G.
      if (r >= 2.44 && r <= 2.52) {
        const fade =
          smoothstep(2.44, 2.46, r) * (1 - smoothstep(2.49, 2.52, r));

        red = 145;
        green = 132;
        blue = 116;
        alpha = Math.max(alpha, 0.12 * fade);
      }

      // Fade the inner and outer edges.
      const edgeFade =
        smoothstep(1.08, 1.16, r) * (1 - smoothstep(2.52, 2.55, r));

      alpha *= edgeFade;

      const index = (y * size + x) * 4;

      data[index] = THREE.MathUtils.clamp(red, 0, 255);
      data[index + 1] = THREE.MathUtils.clamp(green, 0, 255);
      data[index + 2] = THREE.MathUtils.clamp(blue, 0, 255);
      data[index + 3] = THREE.MathUtils.clamp(alpha * 255, 0, 255);
    }
  }

  context.putImageData(image, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 8;

  return texture;
}

export default function PlanetRings({ radius }) {
  const ringTexture = useMemo(() => createRingTexture(), []);

  return (
    <group rotation={[Math.PI / 2.35, 0, 0]}>
      {/* Main ring system */}
      <mesh castShadow receiveShadow renderOrder={2}>
        <ringGeometry args={[radius * 1.08, radius * OUTER_RADIUS, 512, 8]} />

        <meshStandardMaterial
          map={ringTexture}
          transparent
          alphaTest={0.015}
          side={THREE.DoubleSide}
          roughness={0.92}
          metalness={0}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
