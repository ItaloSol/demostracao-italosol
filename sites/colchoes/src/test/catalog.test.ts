import { describe, expect, it } from "vitest";
import { mattresses } from "@/data/mattresses";
import { countFor, emptyFilters, filterMattresses, sortMattresses } from "@/lib/catalog";
const ids = (l: { id: string }[]) => l.map((m) => m.id);
describe("catálogo", () => {
  it("combina categoria e conforto", () => {
    expect(ids(filterMattresses(mattresses, { ...emptyFilters, category: "premium", comforts: ["Macio"] })).sort()).toEqual(["horizonte", "serena"]);
  });
  it("faixa até R$ 1.000 traz só o Firme Pro", () => {
    expect(ids(filterMattresses(mattresses, { ...emptyFilters, prices: ["ate1000"] }))).toEqual(["firme"]);
  });
  it("categoria infantil fica vazia", () => {
    expect(filterMattresses(mattresses, { ...emptyFilters, category: "infantil" })).toHaveLength(0);
  });
  it("busca ignora acentos e acha por marca", () => {
    expect(ids(filterMattresses(mattresses, { ...emptyFilters, query: "equilibrio" }))).toEqual(["equilibrio"]);
    expect(filterMattresses(mattresses, { ...emptyFilters, query: "Exemplo B" })).toHaveLength(3);
  });
  it("ordena por menor e maior preço", () => {
    expect(sortMattresses(mattresses, "menor")[0]?.id).toBe("firme");
    expect(sortMattresses(mattresses, "maior")[0]?.id).toBe("horizonte");
  });
  it("conta modelos por opção respeitando os outros filtros", () => {
    expect(countFor(mattresses, emptyFilters, "category", "todos")).toBe(mattresses.length);
    expect(countFor(mattresses, emptyFilters, "sizes", "Viúva")).toBe(0);
    expect(countFor(mattresses, { ...emptyFilters, comforts: ["Macio"] }, "sizes", "Solteiro")).toBe(0);
    // dentro do mesmo grupo a escolha atual não restringe a contagem
    expect(countFor(mattresses, { ...emptyFilters, comforts: ["Macio"] }, "comforts", "Firme")).toBe(1);
  });
});
