// data.jsx — contenido del club (inventado, editable)
const CLUB = {
  name: "Alicante Fem",
  fullName: "Alicante Fem · Club de Fútbol Femenino",
  tagline: "Fútbol femenino con alma mediterránea",
  founded: 2018,
  city: "Alicante",
};

// --- Historia / ciudad ---
const CITY = {
  kicker: "La ciudad",
  title: "Donde el mar se hace equipo",
  lead:
    "Alicante es luz, sal y Mediterráneo. Bajo el Castillo de Santa Bárbara y junto a la Explanada, nuestro club nace de esa misma energía: la del barrio, la playa y la gente que no se rinde. Jugamos en casa en el Polideportivo Antonio Solana, nuestro fortín a orillas del Mediterráneo.",
  paragraphs: [
    {
      h: "Polideportivo Antonio Solana",
      t: "Nuestro campo como local. Aquí defendemos cada domingo los colores del club, con la grada empujando y la cantera soñando con jugar algún día en este césped. Es nuestra casa.",
      slot: "city-stadium",
      label: "foto: Polideportivo Antonio Solana",
    },
    {
      h: "Playa del Postiguet",
      t: "Arena dorada a un paso del centro. Aquí aprendimos que el esfuerzo, como la marea, vuelve siempre. El azul del mar es el azul de nuestra camiseta.",
      slot: "city-beach",
      label: "foto: Playa del Postiguet",
    },
    {
      h: "La Explanada",
      t: "Sus olas de mármol rojo, blanco y azul marcan el ritmo de los paseos. Ese ritmo —el de la ciudad que late— es el que llevamos al campo cada domingo.",
      slot: "city-explanada",
      label: "foto: Explanada de España",
    },
  ],
  stats: [
    { n: "2018", l: "Año de fundación" },
    { n: "+120", l: "Jugadoras en cantera" },
    { n: "6", l: "Equipos por categoría" },
    { n: "A. Solana", l: "Nuestro estadio" },
  ],
};

// --- Plantilla (jugadoras inventadas) ---
const PLAYERS = [
  { num: 1, name: "Lucía Ferrer", pos: "Portera", slot: "p-lucia" },
  { num: 3, name: "Vega Torregrosa", pos: "Defensa", slot: "p-vega" },
  { num: 4, name: "Marta Belda", pos: "Defensa", slot: "p-marta" },
  { num: 5, name: "Nerea Antón", pos: "Defensa", slot: "p-nerea" },
  { num: 6, name: "Sara Quiles", pos: "Centrocampista", slot: "p-sara" },
  { num: 8, name: "Claudia Server", pos: "Centrocampista", slot: "p-claudia" },
  { num: 10, name: "Paula Sempere", pos: "Centrocampista", slot: "p-paula", captain: true },
  { num: 9, name: "Irene Mollà", pos: "Delantera", slot: "p-irene" },
  { num: 11, name: "Aitana Reig", pos: "Delantera", slot: "p-aitana" },
  { num: 13, name: "Noa Llorca", pos: "Portera", slot: "p-noa" },
];

const STAFF = [
  { name: "Cristina Bernabéu", role: "Entrenadora", slot: "s-cristina" },
  { name: "David Pastor", role: "Segundo entrenador", slot: "s-david" },
  { name: "Jorge Caselles", role: "Preparador físico", slot: "s-jorge" },
  { name: "Elena Ruano", role: "Fisioterapeuta", slot: "s-elena" },
];

// --- Tienda (prendas) ---
const SIZES_KIDS = ["6", "8", "10", "12", "14", "16"];
const SIZES_ADULT = ["S", "M", "L", "XL"];

const PRODUCTS = [
  { id: "cam1", name: "Camiseta 1ª equipación", price: 32, sizes: [...SIZES_KIDS, ...SIZES_ADULT], slot: "prod-cam1", tag: "Más vendido" },
  { id: "cam2", name: "Camiseta 2ª equipación", price: 32, sizes: [...SIZES_KIDS, ...SIZES_ADULT], slot: "prod-cam2" },
  { id: "short", name: "Pantalón corto de juego", price: 18, sizes: [...SIZES_KIDS, ...SIZES_ADULT], slot: "prod-short" },
  { id: "socks", name: "Medias oficiales", price: 9, sizes: ["Talla única"], slot: "prod-socks" },
  { id: "hoodie", name: "Sudadera con capucha", price: 38, sizes: [...SIZES_KIDS, ...SIZES_ADULT], slot: "prod-hoodie" },
  { id: "tracksuit", name: "Chándal completo", price: 58, sizes: [...SIZES_KIDS, ...SIZES_ADULT], slot: "prod-track" },
  { id: "windbreaker", name: "Cortavientos", price: 34, sizes: [...SIZES_KIDS, ...SIZES_ADULT], slot: "prod-wind" },
  { id: "bag", name: "Mochila de viaje", price: 28, sizes: ["Talla única"], slot: "prod-bag" },
];

// --- Liga (clasificación ejemplo, editable / la actualiza n8n) ---
const LEAGUE = {
  updated: "Jornada 22 · actualizado por n8n",
  rows: [
    { pos: 1, team: "Alicante Fem", pj: 22, pts: 52, us: true },
    { pos: 2, team: "Elche CF Fem", pj: 22, pts: 49 },
    { pos: 3, team: "Hércules Fem", pj: 22, pts: 45 },
    { pos: 4, team: "Villarreal B", pj: 22, pts: 41 },
    { pos: 5, team: "Levante Las Planas B", pj: 22, pts: 38 },
  ],
  next: { rival: "Elche CF Fem", when: "Dom 14 jun · 12:00", where: "Polideportivo Antonio Solana · Alicante" },
};

Object.assign(window, { CLUB, CITY, PLAYERS, STAFF, PRODUCTS, SIZES_KIDS, SIZES_ADULT, LEAGUE });
