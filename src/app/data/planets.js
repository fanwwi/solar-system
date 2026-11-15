export const planets = [
  {
    id: "mercury",
    name: "Mercury",
    subtitle: "The Swiftest Planet",
    type: "Terrestrial Planet",
    description:
      "The smallest planet in the Solar System and the closest to the Sun. Mercury has an ancient, heavily cratered surface and extreme temperature changes.",

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
      dayLength: "176 Earth days",
      temperature: "-180°C to 430°C",
      gravity: "3.7 m/s²",
      escapeVelocity: "4.25 km/s",
      mass: "3.30 × 10²³ kg",
      density: "5.43 g/cm³",
      moons: 0,
      rings: "None",
      magneticField: "Weak global magnetic field",
      atmosphere: "Extremely thin exosphere",
      atmosphereComposition: "Oxygen, sodium, hydrogen, helium, potassium",
      surface: "Rocky, heavily cratered",
      composition: "Iron-rich core, silicate mantle and crust",
      notableFeatures: "Caloris Basin, scarps, polar water ice",
      exploration: "Mariner 10, MESSENGER, BepiColombo",
    },
  },

  {
    id: "venus",
    name: "Venus",
    subtitle: "Earth's Twin",
    type: "Terrestrial Planet",
    description:
      "A world of crushing pressure and extreme heat. Venus has a dense carbon dioxide atmosphere and clouds of sulfuric acid, making it the hottest planet.",

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
      dayLength: "117 Earth days",
      temperature: "465°C average",
      gravity: "8.87 m/s²",
      escapeVelocity: "10.36 km/s",
      mass: "4.87 × 10²⁴ kg",
      density: "5.24 g/cm³",
      moons: 0,
      rings: "None",
      magneticField: "No intrinsic global magnetic field",
      atmosphere: "Extremely dense",
      atmosphereComposition:
        "96.5% carbon dioxide, 3.5% nitrogen; sulfuric acid clouds",
      surface: "Volcanic plains, mountains and impact craters",
      composition: "Iron core, rocky mantle and crust",
      notableFeatures:
        "Maxwell Montes, Ishtar Terra, extensive volcanic terrain",
      exploration: "Venera missions, Magellan, Akatsuki",
    },
  },

  {
    id: "earth",
    name: "Earth",
    subtitle: "Our Home",
    type: "Terrestrial Planet",
    description:
      "The only world currently known to support life. Earth has liquid water on its surface, a protective atmosphere and a magnetic field.",

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
      dayLength: "24 hours",
      temperature: "15°C average",
      gravity: "9.81 m/s²",
      escapeVelocity: "11.19 km/s",
      mass: "5.97 × 10²⁴ kg",
      density: "5.51 g/cm³",
      moons: 1,
      rings: "None",
      magneticField: "Strong global magnetosphere",
      atmosphere: "Nitrogen-oxygen atmosphere",
      atmosphereComposition: "78% nitrogen, 21% oxygen, 1% other gases",
      surface: "71% water, 29% land",
      composition: "Iron-nickel core, silicate mantle and crust",
      notableFeatures: "Oceans, continents, plate tectonics, biosphere",
      exploration: "Thousands of satellites, Apollo, ISS, Artemis",
    },
  },

  {
    id: "mars",
    name: "Mars",
    subtitle: "The Red Planet",
    type: "Terrestrial Planet",
    description:
      "A cold desert world with a rusty red surface, giant volcanoes and ancient river valleys. Mars is one of the main targets in the search for past extraterrestrial life.",

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
      dayLength: "24h 39m",
      temperature: "-65°C average",
      gravity: "3.71 m/s²",
      escapeVelocity: "5.03 km/s",
      mass: "6.42 × 10²³ kg",
      density: "3.93 g/cm³",
      moons: 2,
      rings: "None",
      magneticField: "No global field; localized crustal magnetism",
      atmosphere: "Thin carbon dioxide atmosphere",
      atmosphereComposition:
        "95% carbon dioxide, nitrogen, argon and traces of oxygen",
      surface: "Iron-rich dust, volcanic plains, impact craters",
      composition: "Iron-rich core, silicate mantle and crust",
      notableFeatures: "Olympus Mons, Valles Marineris, polar ice caps",
      exploration: "Viking, Curiosity, Perseverance, Ingenuity",
    },
  },

  {
    id: "jupiter",
    name: "Jupiter",
    subtitle: "King of the Planets",
    type: "Gas Giant",
    description:
      "The largest planet in the Solar System. Jupiter is a giant world of hydrogen and helium, famous for its enormous storms and the Great Red Spot.",

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
      dayLength: "9h 56m",
      temperature: "-110°C average cloud-top temperature",
      gravity: "24.79 m/s²",
      escapeVelocity: "59.5 km/s",
      mass: "1.90 × 10²⁷ kg",
      density: "1.33 g/cm³",
      moons: "95+ known",
      rings: "Faint ring system",
      magneticField: "Extremely powerful magnetosphere",
      atmosphere: "Hydrogen-helium gas envelope",
      atmosphereComposition:
        "Hydrogen, helium, methane, ammonia and water vapor",
      surface: "No solid surface; deep atmosphere and fluid interior",
      composition: "Hydrogen, helium, metallic hydrogen and rocky core",
      notableFeatures: "Great Red Spot, Europa, Io, Ganymede, Callisto",
      exploration: "Pioneer, Voyager, Galileo, Juno",
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

    description:
      "A magnificent gas giant surrounded by an immense system of icy rings. Saturn is so low in density that its average density is less than that of water.",

    facts: {
      diameter: "116,460 km",
      distanceFromSun: "1.43 billion km",
      orbitalPeriod: "29.45 Earth years",
      rotationPeriod: "About 10h 42m",
      dayLength: "About 10h 42m",
      temperature: "-140°C average cloud-top temperature",
      gravity: "10.44 m/s²",
      escapeVelocity: "35.5 km/s",
      mass: "5.68 × 10²⁶ kg",
      density: "0.69 g/cm³",
      moons: "274+ known",
      rings: "A, B, C, D, E, F and G rings",
      magneticField: "Powerful global magnetic field",
      atmosphere: "Hydrogen-helium atmosphere",
      atmosphereComposition: "Hydrogen, helium, methane and ammonia",
      surface: "No solid surface",
      composition: "Hydrogen, helium, metallic hydrogen and dense interior",
      notableFeatures:
        "Titan, Enceladus, hexagonal polar storm, ring divisions",
      exploration: "Pioneer 11, Voyager, Cassini-Huygens",
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

    description:
      "An ice giant that rotates almost on its side. Its blue-green color comes from methane in the atmosphere, which absorbs red light.",

    facts: {
      diameter: "50,724 km",
      distanceFromSun: "2.87 billion km",
      orbitalPeriod: "84 Earth years",
      rotationPeriod: "17h 14m",
      dayLength: "17h 14m",
      temperature: "-195°C average",
      gravity: "8.69 m/s²",
      escapeVelocity: "21.3 km/s",
      mass: "8.68 × 10²⁵ kg",
      density: "1.27 g/cm³",
      moons: "28 known",
      rings: "13 known rings",
      magneticField: "Highly tilted and offset magnetic field",
      atmosphere: "Hydrogen-helium atmosphere with methane",
      atmosphereComposition: "Hydrogen, helium and methane",
      surface: "No solid surface; icy fluid interior",
      composition: "Water, ammonia and methane-rich icy interior",
      notableFeatures: "Extreme axial tilt, faint rings, Miranda's cliffs",
      exploration: "Voyager 2",
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

    description:
      "The most distant recognized planet from the Sun. Neptune is an extremely cold ice giant with supersonic winds and dynamic atmospheric storms.",

    facts: {
      diameter: "49,244 km",
      distanceFromSun: "4.50 billion km",
      orbitalPeriod: "164.8 Earth years",
      rotationPeriod: "16h 6m",
      dayLength: "16h 6m",
      temperature: "-200°C average",
      gravity: "11.15 m/s²",
      escapeVelocity: "23.5 km/s",
      mass: "1.02 × 10²⁶ kg",
      density: "1.64 g/cm³",
      moons: "16 known",
      rings: "5 main rings and ring arcs",
      magneticField: "Tilted and offset magnetic field",
      atmosphere: "Hydrogen-helium atmosphere with methane",
      atmosphereComposition: "Hydrogen, helium and methane",
      surface: "No solid surface; icy fluid interior",
      composition: "Water, ammonia and methane-rich icy interior",
      notableFeatures: "Great Dark Spot, Triton, supersonic winds",
      exploration: "Voyager 2",
    },
  },
];

export const sunData = {
  id: "sun",
  name: "Sun",
  subtitle: "The Star at the Center of Our Solar System",
  type: "G-type Main-sequence Star",

  description:
    "The Sun is the star at the center of our Solar System. Its gravity holds the planets in orbit, while nuclear fusion in its core releases the energy that powers our planetary system.",

  radius: 3.5,
  color: "#ffae42",

  temperature: "5,500°C",
  coreTemperature: "About 15 million °C",
  diameter: "1.39 million km",
  age: "4.6 billion years",
  mass: "1.989 × 10³⁰ kg",
  gravity: "274 m/s²",
  rotationPeriod: "About 25 days at the equator",
  composition: "About 73% hydrogen, 25% helium, 2% heavier elements",
  luminosity: "3.828 × 10²⁶ watts",
  spectralClass: "G2V",
  distanceFromEarth: "149.6 million km",
  notableFeatures: "Sunspots, solar flares, prominences, corona",
  layers:
    "Core, radiative zone, convective zone, photosphere, chromosphere, corona",
  energySource: "Nuclear fusion of hydrogen into helium",
};
