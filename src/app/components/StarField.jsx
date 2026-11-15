"use client";

import { useMemo, useState } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";

const CONSTELLATIONS = [
  // 1. Большая Медведица — Большой Ковш
  {
    id: "ursa-major",
    name: "Большая Медведица",
    subtitle: "Большой Ковш",
    color: "#a9d8ff",
    stars: [
      { id: "dubhe", name: "Дубхе", ra: 11.062, dec: 61.75, mag: 1.8 },
      { id: "merak", name: "Мерак", ra: 11.031, dec: 56.38, mag: 2.4 },
      { id: "phecda", name: "Фекда", ra: 11.897, dec: 53.69, mag: 2.4 },
      { id: "megrez", name: "Мегрец", ra: 12.257, dec: 57.03, mag: 3.3 },
      { id: "alioth", name: "Алиот", ra: 12.9, dec: 55.96, mag: 1.8 },
      { id: "mizar", name: "Мицар", ra: 13.399, dec: 54.93, mag: 2.2 },
      { id: "alkaid", name: "Алькаид", ra: 13.792, dec: 49.31, mag: 1.9 },
    ],
    edges: [
      ["dubhe", "merak"],
      ["merak", "phecda"],
      ["phecda", "megrez"],
      ["megrez", "dubhe"],
      ["megrez", "alioth"],
      ["alioth", "mizar"],
      ["mizar", "alkaid"],
    ],
  },

  // 2. Орион
  {
    id: "orion",
    name: "Орион",
    subtitle: "Охотник",
    color: "#b8dfff",
    stars: [
      { id: "betelgeuse", name: "Бетельгейзе", ra: 5.919, dec: 7.41, mag: 0.5 },
      { id: "bellatrix", name: "Беллатрикс", ra: 5.419, dec: 6.35, mag: 1.6 },
      { id: "meissa", name: "Мейса", ra: 5.585, dec: 9.93, mag: 3.5 },
      { id: "alnitak", name: "Альнитак", ra: 5.679, dec: -1.94, mag: 1.8 },
      { id: "alnilam", name: "Альнилам", ra: 5.603, dec: -1.2, mag: 1.7 },
      { id: "mintaka", name: "Минтака", ra: 5.533, dec: -0.3, mag: 2.2 },
      { id: "saiph", name: "Саиф", ra: 5.796, dec: -9.67, mag: 2.1 },
      { id: "rigel", name: "Ригель", ra: 5.243, dec: -8.2, mag: 0.1 },
    ],
    edges: [
      ["meissa", "betelgeuse"],
      ["meissa", "bellatrix"],
      ["betelgeuse", "alnitak"],
      ["bellatrix", "mintaka"],
      ["alnitak", "alnilam"],
      ["alnilam", "mintaka"],
      ["alnitak", "saiph"],
      ["mintaka", "rigel"],
      ["saiph", "rigel"],
    ],
  },

  // 3. Пегас
  {
    id: "pegasus",
    name: "Пегас",
    subtitle: "Крылатый конь",
    color: "#c9b8ff",
    stars: [
      { id: "markab", name: "Маркаб", ra: 23.079, dec: 15.21, mag: 2.5 },
      { id: "scheat", name: "Шеат", ra: 23.063, dec: 28.08, mag: 2.4 },
      { id: "algenib", name: "Альгениб", ra: 0.22, dec: 15.18, mag: 2.8 },
      { id: "alpheratz", name: "Альферац", ra: 0.14, dec: 29.09, mag: 2.1 },
      { id: "enif", name: "Эниф", ra: 21.736, dec: 9.88, mag: 2.4 },
      { id: "homam", name: "Хомам", ra: 22.691, dec: 10.83, mag: 3.5 },
      { id: "matar", name: "Матар", ra: 22.716, dec: 30.22, mag: 3.1 },
    ],
    edges: [
      ["markab", "scheat"],
      ["scheat", "alpheratz"],
      ["alpheratz", "algenib"],
      ["algenib", "markab"],
      ["markab", "enif"],
      ["enif", "homam"],
      ["homam", "matar"],
      ["matar", "scheat"],
    ],
  },

  // 4. Кассиопея — характерная буква W
  {
    id: "cassiopeia",
    name: "Кассиопея",
    subtitle: "Царица",
    color: "#ffc9e8",
    stars: [
      { id: "schedar", name: "Шедар", ra: 0.675, dec: 56.54, mag: 2.2 },
      { id: "caph", name: "Каф", ra: 0.153, dec: 59.15, mag: 2.3 },
      { id: "gamma-cas", name: "Нави", ra: 0.945, dec: 60.72, mag: 2.5 },
      { id: "ruchbah", name: "Рухба", ra: 1.43, dec: 60.24, mag: 2.7 },
      { id: "segin", name: "Сегин", ra: 1.907, dec: 63.67, mag: 3.4 },
    ],
    edges: [
      ["caph", "schedar"],
      ["schedar", "gamma-cas"],
      ["gamma-cas", "ruchbah"],
      ["ruchbah", "segin"],
    ],
  },

  // 5. Лебедь — Северный Крест
  {
    id: "cygnus",
    name: "Лебедь",
    subtitle: "Северный Крест",
    color: "#b5f0ff",
    stars: [
      { id: "deneb", name: "Денеб", ra: 20.691, dec: 45.28, mag: 1.3 },
      { id: "sadr", name: "Садр", ra: 20.37, dec: 40.26, mag: 2.2 },
      { id: "gienah", name: "Гиенах", ra: 20.77, dec: 33.97, mag: 2.5 },
      {
        id: "delta-cyg",
        name: "Дельта Лебедя",
        ra: 19.749,
        dec: 45.13,
        mag: 2.9,
      },
      { id: "albireo", name: "Альбирео", ra: 19.512, dec: 27.96, mag: 3.1 },
      {
        id: "epsilon-cyg",
        name: "Эпсилон Лебедя",
        ra: 20.761,
        dec: 34.98,
        mag: 2.5,
      },
    ],
    edges: [
      ["deneb", "sadr"],
      ["sadr", "albireo"],
      ["delta-cyg", "sadr"],
      ["sadr", "gienah"],
      ["gienah", "epsilon-cyg"],
    ],
  },

  // 6. Лира
  {
    id: "lyra",
    name: "Лира",
    subtitle: "Музыкальный инструмент",
    color: "#d9c5ff",
    stars: [
      { id: "vega", name: "Вега", ra: 18.616, dec: 38.78, mag: 0.0 },
      { id: "sheliak", name: "Шелиак", ra: 18.835, dec: 33.36, mag: 3.5 },
      { id: "sulafat", name: "Сулафат", ra: 18.982, dec: 32.69, mag: 3.2 },
      { id: "delta-lyr", name: "Дельта Лиры", ra: 18.908, dec: 36.9, mag: 4.2 },
      {
        id: "epsilon-lyr",
        name: "Эпсилон Лиры",
        ra: 18.738,
        dec: 39.67,
        mag: 4.7,
      },
    ],
    edges: [
      ["vega", "sheliak"],
      ["sheliak", "sulafat"],
      ["sulafat", "delta-lyr"],
      ["delta-lyr", "vega"],
      ["vega", "epsilon-lyr"],
    ],
  },

  // 7. Скорпион
  {
    id: "scorpius",
    name: "Скорпион",
    subtitle: "Небесный скорпион",
    color: "#ffb89c",
    stars: [
      { id: "antares", name: "Антарес", ra: 16.49, dec: -26.43, mag: 1.0 },
      { id: "dschubba", name: "Джубба", ra: 16.006, dec: -22.62, mag: 2.3 },
      { id: "acraba", name: "Акраб", ra: 16.09, dec: -19.81, mag: 2.6 },
      { id: "sargas", name: "Саргас", ra: 17.622, dec: -42.99, mag: 1.9 },
      { id: "shaula", name: "Шаула", ra: 17.56, dec: -37.1, mag: 1.6 },
      { id: "lesath", name: "Лесат", ra: 17.513, dec: -37.3, mag: 2.7 },
      { id: "jabbah", name: "Джаббах", ra: 16.113, dec: -19.47, mag: 4.0 },
      { id: "pi-sco", name: "Пи Скорпиона", ra: 15.981, dec: -26.11, mag: 2.9 },
    ],
    edges: [
      ["acraba", "dschubba"],
      ["dschubba", "antares"],
      ["dschubba", "pi-sco"],
      ["antares", "sargas"],
      ["sargas", "shaula"],
      ["shaula", "lesath"],
    ],
  },

  // 8. Лев
  {
    id: "leo",
    name: "Лев",
    subtitle: "Царь зверей",
    color: "#ffe0a3",
    stars: [
      { id: "regulus", name: "Регул", ra: 10.139, dec: 11.97, mag: 1.4 },
      { id: "denebola", name: "Денебола", ra: 11.818, dec: 14.57, mag: 2.1 },
      { id: "algieba", name: "Альгиеба", ra: 10.333, dec: 19.84, mag: 2.0 },
      { id: "zosma", name: "Зосма", ra: 11.235, dec: 20.52, mag: 2.6 },
      { id: "chertan", name: "Чертан", ra: 11.237, dec: 15.43, mag: 3.3 },
      { id: "adhafera", name: "Адафера", ra: 10.278, dec: 23.42, mag: 3.4 },
      { id: "rasalas", name: "Расалас", ra: 9.879, dec: 26.01, mag: 3.9 },
    ],
    edges: [
      ["regulus", "algieba"],
      ["algieba", "adhafera"],
      ["adhafera", "rasalas"],
      ["rasalas", "algieba"],
      ["algieba", "zosma"],
      ["zosma", "chertan"],
      ["chertan", "regulus"],
      ["chertan", "denebola"],
    ],
  },

  // 9. Южный Крест
  {
    id: "crux",
    name: "Южный Крест",
    subtitle: "Созвездие Южного неба",
    color: "#a8e6ff",
    stars: [
      { id: "acrux", name: "Акрукс", ra: 12.443, dec: -63.1, mag: 0.8 },
      { id: "mimosa", name: "Мимоза", ra: 12.795, dec: -59.69, mag: 1.3 },
      { id: "gacrux", name: "Гакрукс", ra: 12.519, dec: -57.11, mag: 1.6 },
      {
        id: "delta-crux",
        name: "Дельта Южного Креста",
        ra: 12.253,
        dec: -58.75,
        mag: 2.8,
      },
      {
        id: "epsilon-crux",
        name: "Эпсилон Южного Креста",
        ra: 12.356,
        dec: -60.4,
        mag: 3.6,
      },
    ],
    edges: [
      ["gacrux", "acrux"],
      ["mimosa", "delta-crux"],
      ["delta-crux", "acrux"],
      ["acrux", "mimosa"],
    ],
  },
];

const SKY_RADIUS = 220;

function celestialToVector(raHours, decDegrees, radius = SKY_RADIUS) {
  const ra = THREE.MathUtils.degToRad(raHours * 15);
  const dec = THREE.MathUtils.degToRad(decDegrees);

  return new THREE.Vector3(
    radius * Math.cos(dec) * Math.sin(ra),
    radius * Math.sin(dec),
    radius * Math.cos(dec) * Math.cos(ra),
  );
}

function createBackgroundStars() {
  let seed = 92731;

  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const positions = [];
  const sizes = [];

  for (let i = 0; i < 1800; i++) {
    const u = random() * 2 - 1;
    const angle = random() * Math.PI * 2;
    const radius = 225 + random() * 12;
    const horizontal = Math.sqrt(1 - u * u);

    positions.push(
      radius * horizontal * Math.cos(angle),
      radius * u,
      radius * horizontal * Math.sin(angle),
    );

    sizes.push(0.35 + random() * 1.1);
  }

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );

  geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));

  return geometry;
}

function BackgroundStars() {
  const geometry = useMemo(() => createBackgroundStars(), []);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        color="#c9dcff"
        size={0.8}
        sizeAttenuation
        transparent
        opacity={0.65}
        depthWrite={false}
      />
    </points>
  );
}

function Constellation({ data }) {
  const [hoveredStar, setHoveredStar] = useState(null);

  const stars = useMemo(
    () =>
      data.stars.map((star) => ({
        ...star,
        position: celestialToVector(star.ra, star.dec),
      })),
    [data],
  );

  const starMap = useMemo(
    () => new Map(stars.map((star) => [star.id, star])),
    [stars],
  );

  const lineGeometry = useMemo(() => {
    const positions = [];

    data.edges.forEach(([from, to]) => {
      const a = starMap.get(from);
      const b = starMap.get(to);

      if (!a || !b) return;

      positions.push(
        a.position.x,
        a.position.y,
        a.position.z,
        b.position.x,
        b.position.y,
        b.position.z,
      );
    });

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );

    return geometry;
  }, [data, starMap]);

  return (
    <group>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          color={data.color}
          transparent
          opacity={0.48}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {stars.map((star) => {
        const size = THREE.MathUtils.mapLinear(
          Math.min(star.mag, 4),
          4,
          0,
          0.75,
          2.1,
        );

        return (
          <group key={star.id} position={star.position}>
            {/* Свечение */}
            <mesh>
              <sphereGeometry args={[size * 2.8, 12, 12]} />
              <meshBasicMaterial
                color={data.color}
                transparent
                opacity={0.09}
                depthWrite={false}
              />
            </mesh>

            {/* Звезда */}
            <mesh
              onPointerOver={(event) => {
                event.stopPropagation();
                setHoveredStar(star.id);
              }}
              onPointerOut={() => setHoveredStar(null)}
            >
              <sphereGeometry args={[size, 16, 16]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>

            {/* Название */}
            {hoveredStar === star.id && (
              <Html
                center
                distanceFactor={12}
                style={{ pointerEvents: "none" }}
              >
                <div
                  style={{
                    color: "#ffffff",
                    background: "rgba(5, 12, 30, 0.88)",
                    border: `1px solid ${data.color}`,
                    borderRadius: "6px",
                    padding: "5px 9px",
                    fontSize: "11px",
                    whiteSpace: "nowrap",
                    letterSpacing: "0.4px",
                    boxShadow: `0 0 14px ${data.color}55`,
                  }}
                >
                  {star.name}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

export default function StarField() {
  return (
    <group>
      <BackgroundStars />

      {CONSTELLATIONS.map((constellation) => (
        <Constellation key={constellation.id} data={constellation} />
      ))}
    </group>
  );
}
