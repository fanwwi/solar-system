export const planets = [
  {
    id: "mercury",
    name: "Mercury",
    subtitle: "The Swiftest Planet",
    type: "Terrestrial Planet",

    // Визуальные размеры и расстояния — не реальные масштабы
    radius: 0.38,
    orbitRadius: 7,
    orbitSpeed: 0.047,
    rotationSpeed: 0.004,

    color: "#9b9690",
    atmosphere: null,

    facts: {
      diameter: "4,879 km",
      distanceFromSun: "57.9 million km",
      orbitalPeriod: "88 Earth days",
      rotationPeriod: "58.6 Earth days",
      temperature: "167°C average",
      moons: 0,
    },
  },

  {
    id: "venus",
    name: "Venus",
    subtitle: "Earth's Twin",
    type: "Terrestrial Planet",

    radius: 0.65,
    orbitRadius: 10,
    orbitSpeed: 0.035,
    rotationSpeed: 0.001,

    color: "#d9a66c",
    atmosphere: "#e8c18a",

    facts: {
      diameter: "12,104 km",
      distanceFromSun: "108.2 million km",
      orbitalPeriod: "225 Earth days",
      rotationPeriod: "243 Earth days",
      temperature: "465°C average",
      moons: 0,
    },
  },

  {
    id: "earth",
    name: "Earth",
    subtitle: "Our Home",
    type: "Terrestrial Planet",

    radius: 0.68,
    orbitRadius: 14,
    orbitSpeed: 0.029,
    rotationSpeed: 0.012,

    color: "#287bc7",
    atmosphere: "#54b9ff",

    facts: {
      diameter: "12,742 km",
      distanceFromSun: "149.6 million km",
      orbitalPeriod: "365.25 Earth days",
      rotationPeriod: "23h 56m",
      temperature: "15°C average",
      moons: 1,
    },
  },

  {
    id: "mars",
    name: "Mars",
    subtitle: "The Red Planet",
    type: "Terrestrial Planet",

    radius: 0.48,
    orbitRadius: 18,
    orbitSpeed: 0.024,
    rotationSpeed: 0.011,

    color: "#c65c3b",
    atmosphere: "#d77b5d",

    facts: {
      diameter: "6,779 km",
      distanceFromSun: "227.9 million km",
      orbitalPeriod: "687 Earth days",
      rotationPeriod: "24h 37m",
      temperature: "-65°C average",
      moons: 2,
    },
  },

  {
    id: "jupiter",
    name: "Jupiter",
    subtitle: "King of the Planets",
    type: "Gas Giant",

    radius: 1.9,
    orbitRadius: 25,
    orbitSpeed: 0.013,
    rotationSpeed: 0.025,

    color: "#c69a77",
    atmosphere: "#d9b18c",

    facts: {
      diameter: "139,820 km",
      distanceFromSun: "778.6 million km",
      orbitalPeriod: "11.86 Earth years",
      rotationPeriod: "9h 56m",
      temperature: "-110°C average cloud-top temperature",
      moons: "100+",
    },
  },

  {
    id: "saturn",
    name: "Saturn",
    subtitle: "Lord of the Rings",
    type: "Gas Giant",

    radius: 1.55,
    orbitRadius: 33,
    orbitSpeed: 0.009,
    rotationSpeed: 0.021,

    color: "#d8bd87",
    atmosphere: "#e8d2a4",

    hasRings: true,

    facts: {
      diameter: "116,460 km",
      distanceFromSun: "1.43 billion km",
      orbitalPeriod: "29.45 Earth years",
      rotationPeriod: "10h 42m",
      temperature: "-140°C average cloud-top temperature",
      moons: "100+",
    },
  },

  {
    id: "uranus",
    name: "Uranus",
    subtitle: "The Sideways Planet",
    type: "Ice Giant",

    radius: 1.05,
    orbitRadius: 41,
    orbitSpeed: 0.006,
    rotationSpeed: 0.018,

    color: "#75cbd1",
    atmosphere: "#a2edf0",

    axialTilt: 97.8,

    facts: {
      diameter: "50,724 km",
      distanceFromSun: "2.87 billion km",
      orbitalPeriod: "84 Earth years",
      rotationPeriod: "17h 14m",
      temperature: "-195°C average",
      moons: 28,
    },
  },

  {
    id: "neptune",
    name: "Neptune",
    subtitle: "The Distant Blue World",
    type: "Ice Giant",

    radius: 1.02,
    orbitRadius: 49,
    orbitSpeed: 0.004,
    rotationSpeed: 0.017,

    color: "#3155c9",
    atmosphere: "#5279ff",

    facts: {
      diameter: "49,244 km",
      distanceFromSun: "4.50 billion km",
      orbitalPeriod: "164.8 Earth years",
      rotationPeriod: "16h 6m",
      temperature: "-200°C average",
      moons: 16,
    },
  },
];

export const sunData = {
  name: "Sun",
  radius: 3.5,
  color: "#ffae42",
  temperature: "5,500°C",
  diameter: "1.39 million km",
  age: "4.6 billion years",
};
