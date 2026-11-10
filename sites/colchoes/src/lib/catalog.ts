import { CATEGORIES, PRICE_RANGES, type Mattress } from "@/data/mattresses";

export type Filters = {
  category: string; // "todos" ou id de categoria
  query: string;
  structures: string[];
  comforts: string[];
  sizes: string[];
  prices: string[]; // ids de PRICE_RANGES
  brands: string[];
};

export type ListKey = "structures" | "comforts" | "sizes" | "prices" | "brands";
export type FacetKey = ListKey | "category";

export type SortKey = "relevancia" | "menor" | "maior" | "nome";

export const emptyFilters: Filters = {
  category: "todos", query: "", structures: [], comforts: [], sizes: [], prices: [], brands: [],
};

export const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function minPrice(m: Mattress): number | undefined {
  const p = m.sizes.map((s) => s.price).filter((v): v is number => typeof v === "number");
  return p.length ? Math.min(...p) : undefined;
}

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export function categoryLabel(id: string) {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

function matchesQuery(m: Mattress, q: string) {
  const t = normalize(q.trim());
  if (!t) return true;
  const hay = normalize([
    m.name, m.brand, m.structure, m.structureDetail, m.comfort,
    ...m.features, ...m.technologies, ...m.categories.map(categoryLabel),
  ].join(" "));
  return hay.includes(t.replace(/\s+/g, " "));
}

const anyOf = (sel: string[], test: (v: string) => boolean) => sel.length === 0 || sel.some(test);

export function filterMattresses(list: Mattress[], f: Filters): Mattress[] {
  return list.filter((m) => {
    const price = minPrice(m);
    const prices = m.sizes.map((s) => s.price).filter((v): v is number => typeof v === "number");
    return (
      (f.category === "todos" || m.categories.includes(f.category as Mattress["categories"][number])) &&
      matchesQuery(m, f.query) &&
      anyOf(f.structures, (s) => m.structure === s) &&
      anyOf(f.comforts, (c) => m.comfort === c) &&
      anyOf(f.sizes, (s) => m.sizes.some((x) => x.name === s)) &&
      anyOf(f.brands, (b) => m.brand === b) &&
      anyOf(f.prices, (id) => {
        const r = PRICE_RANGES.find((p) => p.id === id);
        return !!r && price !== undefined && prices.some((p) => p >= r.min && p <= r.max);
      })
    );
  });
}

export function sortMattresses(list: Mattress[], key: SortKey): Mattress[] {
  const out = [...list];
  const p = (m: Mattress, fb: number) => minPrice(m) ?? fb;
  if (key === "menor") out.sort((a, b) => p(a, Infinity) - p(b, Infinity));
  else if (key === "maior") out.sort((a, b) => p(b, -Infinity) - p(a, -Infinity));
  else if (key === "nome") out.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  else out.sort((a, b) => b.relevance - a.relevance);
  return out;
}

export function brandOptions(list: Mattress[]) {
  return [...new Set(list.map((m) => m.brand))].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

// Quantos modelos apareceriam se esta opção fosse a escolhida no grupo,
// mantendo os outros grupos como estão. Usado para os contadores dos filtros.
export function countFor(list: Mattress[], f: Filters, key: FacetKey, value: string): number {
  const next: Filters = key === "category" ? { ...f, category: value } : { ...f, [key]: [value] };
  return filterMattresses(list, next).length;
}

export function activeFilterCount(f: Filters) {
  return f.structures.length + f.comforts.length + f.sizes.length + f.prices.length + f.brands.length;
}
