"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function CameraRig({ selectedPlanet, controlsRef }) {
  const { camera } = useThree();

  const focusing = useRef(false);
  const focusTime = useRef(0);

  useEffect(() => {
    focusing.current = Boolean(selectedPlanet);
    focusTime.current = 0;
  }, [selectedPlanet?.id]);

  useFrame((state, delta) => {
    if (!selectedPlanet || !focusing.current) return;

    const time = state.clock.elapsedTime;

    // Текущая позиция движущейся планеты
    const angle = time * selectedPlanet.orbitSpeed * 0.12;

    const target = new THREE.Vector3(
      Math.cos(angle) * selectedPlanet.orbitRadius,
      0,
      Math.sin(angle) * selectedPlanet.orbitRadius,
    );

    // Расстояние камеры зависит от размера планеты
    const radius = selectedPlanet.radius;

    const offset = new THREE.Vector3(
      0,
      Math.max(2, radius * 1.3),
      Math.max(5, radius * 4.5 + 2),
    );

    const destination = target.clone().add(offset);

    const smoothness = 1 - Math.exp(-delta * 2.5);

    camera.position.lerp(destination, smoothness);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(target, smoothness);

      controlsRef.current.update();
    }

    focusTime.current += delta;

    // После перелёта пользователь снова свободно управляет камерой
    if (focusTime.current > 2.2) {
      focusing.current = false;
    }
  });

  return null;
}
