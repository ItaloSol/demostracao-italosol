import m1 from "@/assets/m1.jpg";
import m2 from "@/assets/m2.jpg";
import m3 from "@/assets/m3.jpg";
import hero from "@/assets/hero.jpg";

// ============================================================
// CATÁLOGO — todos os dados abaixo são DEMONSTRATIVOS.
// Para incluir um colchão, basta adicionar um item à lista.
// Categorias, marcas e filtros se atualizam sozinhos.
// ============================================================

export const CATEGORIES = [
  { id: "todos", label: "Todos os colchões" },
  { id: "espuma", label: "Espuma" },
  { id: "molas", label: "Molas ensacadas" },
  { id: "hibrido", label: "Híbridos" },
  { id: "ortopedico", label: "Ortopédicos" },
  { id: "premium", label: "Premium" },
  { id: "infantil", label: "Infantis" },
] as const;
export type CategoryId = Exclude<(typeof CATEGORIES)[number]["id"], "todos">;

export const STRUCTURES = ["Espuma", "Molas ensacadas", "Híbrido"] as const;
export type Structure = (typeof STRUCTURES)[number];

export const COMFORTS = ["Macio", "Médio", "Médio-firme", "Firme"] as const;
export type Comfort = (typeof COMFORTS)[number];

export const SIZES = ["Solteiro", "Viúva", "Casal", "Queen", "King"] as const;
export type SizeName = (typeof SIZES)[number];

export const PRICE_RANGES = [
  { id: "ate1000", label: "Até R$ 1.000", min: 0, max: 1000 },
  { id: "1000-2000", label: "R$ 1.000 a R$ 2.000", min: 1000, max: 2000 },
  { id: "2000-3500", label: "R$ 2.000 a R$ 3.500", min: 2000, max: 3500 },
  { id: "acima3500", label: "Acima de R$ 3.500", min: 3500, max: Infinity },
] as const;

export type SizeOption = { name: SizeName; dimensions: string; price?: number };

export type Mattress = {
  id: string;
  name: string;
  brand: string;
  short: string;
  description: string;
  categories: CategoryId[];
  structure: Structure;
  structureDetail: string;
  comfort: Comfort;
  firmness: number; // 1 (macio) a 5 (firme)
  sizes: SizeOption[];
  features: string[];
  technologies: string[];
  warranty?: string;
  images: string[];
  highlight?: string;
  available: boolean;
  relevance: number; // maior = aparece antes em "Mais relevantes"
};

export const mattresses: Mattress[] = [
  {
    id: "aurora", name: "Aurora", brand: "Marca Exemplo A", images: [m1],
    short: "Espuma de densidade equilibrada para quem gosta de firmeza moderada.",
    description: "Um modelo de espuma com sensação estável e acolhedora, pensado para quem prefere uma superfície uniforme e silenciosa.",
    categories: ["espuma"], structure: "Espuma", structureDetail: "Espuma em camadas",
    comfort: "Médio", firmness: 3,
    features: ["Tecido de toque suave", "Superfície uniforme e silenciosa"],
    technologies: ["Camada de conforto em espuma", "Base em espuma de alta densidade"],
    sizes: [
      { name: "Solteiro", dimensions: "88×188", price: 1290 },
      { name: "Casal", dimensions: "138×188", price: 1690 },
      { name: "Queen", dimensions: "158×198", price: 1990 },
    ],
    warranty: "1 ano (demonstrativo)", available: true, relevance: 80,
  },
  {
    id: "serena", name: "Serena Plus", brand: "Marca Exemplo B", images: [m2],
    short: "Molas individuais com pillow top para uma sensação mais macia.",
    description: "Molas ensacadas individualmente que trabalham de forma independente, combinadas a um pillow top para quem busca maciez na superfície.",
    categories: ["molas", "premium"], structure: "Molas ensacadas", structureDetail: "Molas ensacadas + pillow top",
    comfort: "Macio", firmness: 2,
    features: ["Laterais reforçadas", "Toque macio na superfície"],
    technologies: ["Pillow top acolchoado", "Molas ensacadas individuais"],
    sizes: [
      { name: "Casal", dimensions: "138×188", price: 2890 },
      { name: "Queen", dimensions: "158×198", price: 3290 },
      { name: "King", dimensions: "193×203", price: 3890 },
    ],
    warranty: "3 anos (demonstrativo)", highlight: "Mais procurado", available: true, relevance: 100,
  },
  {
    id: "equilibrio", name: "Equilíbrio", brand: "Marca Exemplo A", images: [m3],
    short: "Combina molas e espumas para um meio-termo versátil.",
    description: "Estrutura híbrida que une a sustentação das molas à acomodação das espumas — uma opção versátil para casais com preferências diferentes.",
    categories: ["hibrido"], structure: "Híbrido", structureDetail: "Molas ensacadas + espumas",
    comfort: "Médio", firmness: 3,
    features: ["Matelassê em tecido respirável", "Indicado para casais"],
    technologies: ["Camadas de espuma de conforto", "Núcleo de molas ensacadas"],
    sizes: [
      { name: "Casal", dimensions: "138×188", price: 2390 },
      { name: "Queen", dimensions: "158×198", price: 2790 },
      { name: "King", dimensions: "193×203", price: 3290 },
    ],
    warranty: "2 anos (demonstrativo)", available: true, relevance: 90,
  },
  {
    id: "firme", name: "Firme Pro", brand: "Marca Exemplo B", images: [m1],
    short: "Superfície mais firme para quem prefere sustentação marcante.",
    description: "Para quem gosta de sentir a superfície mais firme ao deitar. Espuma de alta densidade com acabamento simples e elegante.",
    categories: ["espuma", "ortopedico"], structure: "Espuma", structureDetail: "Espuma de alta densidade",
    comfort: "Firme", firmness: 5,
    features: ["Tecido em malha", "Face única"],
    technologies: ["Espuma de alta densidade"],
    sizes: [
      { name: "Solteiro", dimensions: "88×188", price: 990 },
      { name: "Casal", dimensions: "138×188", price: 1390 },
    ],
    warranty: "1 ano (demonstrativo)", highlight: "Oferta demonstrativa", available: true, relevance: 70,
  },
  {
    id: "noite", name: "Noite Azul", brand: "Marca Exemplo A", images: [m2],
    short: "Molas ensacadas com toque médio-firme e bordas estruturadas.",
    description: "Um modelo de molas ensacadas com sensação médio-firme, para quem quer sustentação com uma camada de conforto na superfície.",
    categories: ["molas"], structure: "Molas ensacadas", structureDetail: "Molas ensacadas",
    comfort: "Médio-firme", firmness: 4,
    features: ["Bordas estruturadas", "Tecido com acabamento acolchoado"],
    technologies: ["Molas ensacadas", "Camada de conforto"],
    sizes: [
      { name: "Casal", dimensions: "138×188", price: 2190 },
      { name: "Queen", dimensions: "158×198", price: 2590 },
    ],
    warranty: "2 anos (demonstrativo)", available: true, relevance: 60,
  },
  {
    id: "horizonte", name: "Horizonte", brand: "Marca Exemplo B", images: [hero],
    short: "Híbrido premium, macio na superfície e estável na base.",
    description: "O topo da linha demonstrativa: camadas generosas de conforto sobre um núcleo de molas, para uma experiência envolvente.",
    categories: ["hibrido", "premium"], structure: "Híbrido", structureDetail: "Híbrido premium",
    comfort: "Macio", firmness: 2,
    features: ["Acabamento premium", "Sensação envolvente"],
    technologies: ["Pillow top generoso", "Múltiplas camadas de conforto", "Molas ensacadas"],
    sizes: [
      { name: "Queen", dimensions: "158×198", price: 3490 },
      { name: "King", dimensions: "193×203", price: 4190 },
    ],
    warranty: "3 anos (demonstrativo)", highlight: "Linha premium", available: true, relevance: 85,
  },
];
