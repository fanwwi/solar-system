"use client";

import { useMemo } from "react";
import * as THREE from "three";

function createPixelTexture(type) {
  const size = 32;
  const canvas = document.createElement("canvas");

  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");

  const random = (x, y) => {
    const n = Math.sin(x * 127.1 + y * 311.7 + 42.3) * 43758.5453;
    return n - Math.floor(n);
  };

  function pixel(x, y, colors) {
    const index = Math.floor(random(x, y) * colors.length);
    ctx.fillStyle = colors[index];
    ctx.fillRect(x, y, 1, 1);
  }

  const dirtColors = [
    "#79502d",
    "#82552f",
    "#704523",
    "#8c6038",
    "#684126",
    "#96683e",
  ];

  const grassColors = [
    "#478c25",
    "#559d2b",
    "#65a832",
    "#3f7d20",
    "#75b83a",
    "#4c9229",
  ];

  if (type === "top") {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        pixel(x, y, grassColors);
      }
    }
  }

  if (type === "side") {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (y < 4) {
          pixel(x, y, grassColors);
        } else if (y === 4 && random(x, y) > 0.45) {
          pixel(x, y, grassColors);
        } else {
          pixel(x, y, dirtColors);
        }
      }
    }

    // Small grass pixels hanging over the dirt
    ctx.fillStyle = "#559d2b";

    for (let x = 0; x < size; x++) {
      if (random(x, 10) > 0.82) {
        ctx.fillRect(x, 5, 1, 1);
      }
    }
  }

  if (type === "bottom") {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        pixel(x, y, dirtColors);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);

  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = false;

  return texture;
}

export default function MinecraftBlock() {
  const materials = useMemo(() => {
    const side = createPixelTexture("side");
    const top = createPixelTexture("top");
    const bottom = createPixelTexture("bottom");

    return [
      new THREE.MeshStandardMaterial({ map: side, roughness: 1 }),
      new THREE.MeshStandardMaterial({ map: side, roughness: 1 }),
      new THREE.MeshStandardMaterial({ map: top, roughness: 1 }),
      new THREE.MeshStandardMaterial({ map: bottom, roughness: 1 }),
      new THREE.MeshStandardMaterial({ map: side, roughness: 1 }),
      new THREE.MeshStandardMaterial({ map: side, roughness: 1 }),
    ];
  }, []);

  return (
    <mesh material={materials} castShadow receiveShadow>
      <boxGeometry args={[2, 2, 2]} />
    </mesh>
  );
}
