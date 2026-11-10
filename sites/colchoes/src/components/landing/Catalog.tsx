import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Check, MessageCircle, SlidersHorizontal, X } from "lucide-react";
import { MESSAGES, waLink } from "@/config/store";
import {
  CATEGORIES,
  COMFORTS,
  PRICE_RANGES,
  SIZES,
  STRUCTURES,
  mattresses,
  type Mattress,
  type SizeOption,
} from "@/data/mattresses";
import {
  activeFilterCount,
  brandOptions,
  categoryLabel,
  countFor,
  emptyFilters,
  filterMattresses,
  formatBRL,
  minPrice,
  sortMattresses,
  type Filters,
  type ListKey,
  type SortKey,
} from "@/lib/catalog";

export type CatalogPreset = { key: number; filters: Partial<Filters> };

const SORTS: [SortKey, string][] = [
  ["relevancia", "Mais relevantes"],
  ["menor", "Menor preço"],
  ["maior", "Maior preço"],
  ["nome", "Nome (A–Z)"],
];

const plural = (n: number) => `${n} ${n === 1 ? "modelo" : "modelos"}`;

/* ---------------- Comportamento de diálogo ---------------- */

// Trava a rolagem da página, fecha com Esc, prende o foco dentro do painel
// e devolve o foco a quem abriu quando o diálogo fecha.
function useDialog(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const panel = ref.current;
    document.body.style.overflow = "hidden";
    (panel?.querySelector<HTMLElement>("[data-autofocus]") ?? panel)?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panel) return;
      const items = panel.querySelectorAll<HTMLElement>(
        "a[href],button:not([disabled]),input:not([disabled]),select",
      );
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [open, onClose]);
  return ref;
}

/* ---------------- Firmeza ---------------- */

function FirmnessDots({ value }: { value: number }) {
  return (
    <span className="flex gap-0.5" role="img" aria-label={`Firmeza ${value} de 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`h-1 w-3.5 rounded-full ${i <= value ? "bg-navy" : "bg-border"}`} />
      ))}
    </span>
  );
}

function FirmnessScale({ value }: { value: number }) {
  const position = ((value - 1) / 4) * 100;
  return (
    <div role="img" aria-label={`Firmeza ${value} de 5, de macio a firme`}>
      <div className="relative mx-1.5 h-1 rounded-full bg-border">
        <div className="absolute inset-y-0 left-0 rounded-full bg-navy/25" style={{ width: `${position}%` }} />
        <span
          className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-navy ring-4 ring-card"
          style={{ left: `${position}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground" aria-hidden>
        <span>Macio</span>
        <span>Firme</span>
      </div>
    </div>
  );
}

/* ---------------- Filtros ---------------- */

type Option = { value: string; label: string; count: number };
type Group = { key: ListKey; title: string; options: Option[] };

function FilterGroup({
  group,
  selected,
  onToggle,
}: {
  group: Group;
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <fieldset className="border-t border-border py-5 lg:py-4">
      <legend className="float-left mb-3 w-full text-sm font-semibold text-navy">{group.title}</legend>
      <div className="clear-both flex flex-wrap gap-2 lg:block lg:space-y-0.5">
        {group.options.map(({ value, label, count }) => {
          const checked = selected.includes(value);
          const empty = count === 0 && !checked;
          return (
            <label
              key={value}
              className={`group/opt flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm transition-colors lg:-mx-2 lg:min-h-8 lg:gap-3 lg:rounded-md lg:border-0 lg:px-2 ${
                empty ? "cursor-not-allowed text-muted-foreground/60" : "cursor-pointer lg:hover:bg-soft"
              } ${
                checked
                  ? "border-navy bg-navy text-primary-foreground lg:bg-transparent lg:text-navy"
                  : "border-border bg-card text-foreground lg:bg-transparent"
              } has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                disabled={empty}
                onChange={() => onToggle(value)}
              />
              <span
                aria-hidden
                className={`hidden h-[1.125rem] w-[1.125rem] shrink-0 items-center justify-center rounded-[5px] border transition-colors lg:flex ${
                  checked ? "border-navy bg-navy text-primary-foreground" : "border-input bg-card"
                }`}
              >
                {checked && <Check className="h-3 w-3" strokeWidth={3} />}
              </span>
              <span className={`flex-1 ${checked ? "lg:font-semibold" : ""}`}>{label}</span>
              <span
                className={`text-xs tabular-nums ${checked ? "text-primary-foreground/75 lg:text-muted-foreground" : "text-muted-foreground"} ${empty ? "opacity-60" : ""}`}
              >
                {count}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function FilterPanel({
  f,
  groups,
  toggle,
  clear,
}: {
  f: Filters;
  groups: Group[];
  toggle: (k: ListKey, v: string) => void;
  clear: () => void;
}) {
  return (
    <div>
      <div className="flex min-h-11 items-center justify-between pb-2">
        <h3 className="font-display text-xl text-navy">Filtros</h3>
        {activeFilterCount(f) > 0 && (
          <button
            onClick={clear}
            className="-mr-2 min-h-11 rounded-md px-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            Limpar
          </button>
        )}
      </div>
      {groups.map((g) => (
        <FilterGroup key={g.key} group={g} selected={f[g.key]} onToggle={(v) => toggle(g.key, v)} />
      ))}
    </div>
  );
}

function Drawer({
  open,
  onClose,
  children,
  count,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  count: number;
}) {
  const ref = useDialog(open, onClose);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-navy/55 animate-in fade-in duration-200 lg:hidden" onClick={onClose}>
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Filtros"
        onClick={(e) => e.stopPropagation()}
        className="absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-2xl bg-background outline-none animate-in slide-in-from-bottom duration-300"
      >
        <div className="relative flex items-center justify-end p-2">
          <span className="absolute left-1/2 top-2.5 h-1 w-10 -translate-x-1/2 rounded-full bg-input" aria-hidden />
          <button
            onClick={onClose}
            aria-label="Fechar filtros"
            className="flex h-11 w-11 items-center justify-center rounded-full text-navy hover:bg-soft"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-4">{children}</div>
        <div className="border-t border-border p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <button
            onClick={onClose}
            disabled={count === 0}
            className="min-h-12 w-full rounded-md bg-navy text-sm font-semibold text-primary-foreground hover:bg-primary disabled:bg-muted disabled:text-muted-foreground"
          >
            {count === 0 ? "Nenhum modelo com esses filtros" : `Ver ${plural(count)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Card ---------------- */

function ProductCard({ m, onOpen }: { m: Mattress; onOpen: () => void }) {
  const price = minPrice(m);
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-[box-shadow,border-color] duration-300 hover:border-input hover:shadow-lift has-[h3_button:focus-visible]:outline-2 has-[h3_button:focus-visible]:outline-offset-2 has-[h3_button:focus-visible]:outline-ring animate-in fade-in duration-300">
      <div className="relative overflow-hidden bg-muted">
        <img
          src={m.images[0]}
          alt=""
          loading="lazy"
          width={1200}
          height={900}
          className="aspect-square w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] sm:aspect-[4/3]"
        />
        {m.highlight && (
          <span className="absolute left-2 top-2 rounded-full bg-sand px-2.5 py-1 text-[0.6875rem] font-semibold leading-none text-sand-foreground sm:left-3 sm:top-3 sm:px-3 sm:text-xs">
            {m.highlight}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <p className="text-xs text-muted-foreground">{m.brand}</p>
        <h3 className="mt-0.5 font-display text-lg leading-snug text-navy sm:text-2xl">
          <button
            onClick={onOpen}
            aria-haspopup="dialog"
            className="text-left outline-none after:absolute after:inset-0 after:content-['']"
          >
            <span className="sr-only">Ver detalhes do colchão </span>
            {m.name}
          </button>
        </h3>
        <p className="mt-1.5 text-[0.8125rem] leading-snug text-muted-foreground sm:text-sm">
          <span className="block sm:inline">{m.structure}</span>
          <span className="hidden sm:inline" aria-hidden>
            {" · "}
          </span>
          <span className="block sm:inline">Conforto {m.comfort.toLowerCase()}</span>
        </p>
        <div className="mt-3 hidden items-center gap-3 sm:flex">
          <FirmnessDots value={m.firmness} />
          <span className="truncate text-xs text-muted-foreground">{m.sizes.map((s) => s.name).join(", ")}</span>
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div>
            {price !== undefined ? (
              <>
                <p className="text-[0.6875rem] text-muted-foreground sm:text-xs">a partir de</p>
                <p className="text-base font-bold tabular-nums text-navy sm:text-xl">{formatBRL(price)}</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Preço sob consulta</p>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span
              aria-hidden
              className="hidden items-center gap-1 pr-2 text-sm font-semibold text-primary transition-[gap] duration-200 group-hover:gap-2 md:inline-flex"
            >
              Detalhes <ArrowRight className="h-4 w-4" />
            </span>
            <a
              href={waLink(MESSAGES.availability(m.name))}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Consultar o colchão ${m.name} pelo WhatsApp`}
              title="Consultar pelo WhatsApp"
              className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-whats text-primary-foreground transition-colors hover:bg-whats-strong"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ---------------- Detalhes ---------------- */

function SizePicker({
  sizes,
  selected,
  onSelect,
}: {
  sizes: SizeOption[];
  selected: string | null;
  onSelect: (name: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-navy">Tamanhos e preços</legend>
      <p className="mt-0.5 text-xs text-muted-foreground">Escolha um tamanho para consultar. Medidas em cm.</p>
      <div className="mt-3 grid gap-2">
        {sizes.map((s) => {
          const checked = selected === s.name;
          return (
            <label
              key={s.name}
              className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border px-4 py-2 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring ${
                checked ? "border-navy bg-soft" : "border-border hover:border-input"
              }`}
            >
              <input
                type="radio"
                name="tamanho"
                className="sr-only"
                checked={checked}
                onChange={() => onSelect(s.name)}
              />
              <span
                aria-hidden
                className={`flex h-[1.125rem] w-[1.125rem] shrink-0 items-center justify-center rounded-full border ${checked ? "border-navy" : "border-input"}`}
              >
                {checked && <span className="h-2 w-2 rounded-full bg-navy" />}
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-navy">{s.name}</span>
                <span className="block text-xs tabular-nums text-muted-foreground">{s.dimensions}</span>
              </span>
              <span className="text-sm font-bold tabular-nums text-navy">
                {s.price !== undefined ? formatBRL(s.price) : "Sob consulta"}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function ProductModal({ m, onClose }: { m: Mattress; onClose: () => void }) {
  const ref = useDialog(true, onClose);
  const [size, setSize] = useState<string | null>(null);
  const chosen = m.sizes.find((s) => s.name === size);
  const message = chosen
    ? MESSAGES.size(m.name, `${chosen.name} (${chosen.dimensions} cm)`)
    : MESSAGES.availability(m.name);
  const price = minPrice(m);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy/55 animate-in fade-in duration-200 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl bg-card outline-none animate-in slide-in-from-bottom-8 duration-300 sm:rounded-2xl md:max-h-[min(46rem,92dvh)]"
      >
        <button
          data-autofocus
          onClick={onClose}
          aria-label="Fechar detalhes"
          className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-card/90 text-navy shadow-sm backdrop-blur hover:bg-soft"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid min-h-0 flex-1 overflow-y-auto overscroll-contain md:grid-cols-[1.05fr_1fr] md:overflow-hidden">
          <div className="relative bg-muted md:h-full">
            <img
              src={m.images[0]}
              alt={`Colchão ${m.name}`}
              className="aspect-[4/3] w-full object-cover md:absolute md:inset-0 md:aspect-auto md:h-full"
            />
            {m.highlight && (
              <span className="absolute left-4 top-4 rounded-full bg-sand px-3 py-1 text-xs font-semibold text-sand-foreground">
                {m.highlight}
              </span>
            )}
          </div>

          <div className="flex min-h-0 flex-col md:overflow-y-auto md:overscroll-contain">
            <div className="flex-1 px-5 pb-6 pt-5 md:px-8 md:pt-8">
              <p className="pr-12 text-sm text-muted-foreground">
                {m.brand} <span aria-hidden>·</span> {m.categories.map(categoryLabel).join(", ")}
              </p>
              <h2 id="modal-title" className="mt-1 font-display text-3xl leading-tight text-navy md:text-4xl">
                {m.name}
              </h2>
              {price !== undefined && (
                <p className="mt-2 text-sm text-muted-foreground">
                  a partir de <span className="text-lg font-bold tabular-nums text-navy">{formatBRL(price)}</span>
                </p>
              )}
              <p className="mt-4 leading-relaxed text-muted-foreground">{m.description}</p>

              <div className="mt-6 rounded-lg border border-border p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-semibold text-navy">Conforto {m.comfort.toLowerCase()}</p>
                  <p className="text-xs text-muted-foreground">{m.structureDetail}</p>
                </div>
                <div className="mt-4">
                  <FirmnessScale value={m.firmness} />
                </div>
              </div>

              <div className="mt-6">
                <SizePicker sizes={m.sizes} selected={size} onSelect={setSize} />
              </div>

              <dl className="mt-6 grid gap-x-6 gap-y-5 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-navy">Tecnologias</dt>
                  <dd className="mt-1.5 space-y-1 text-muted-foreground">
                    {m.technologies.map((t) => (
                      <p key={t}>{t}</p>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-navy">Características</dt>
                  <dd className="mt-1.5 space-y-1 text-muted-foreground">
                    {m.features.map((t) => (
                      <p key={t}>{t}</p>
                    ))}
                  </dd>
                </div>
                {m.warranty && (
                  <div>
                    <dt className="font-semibold text-navy">Garantia</dt>
                    <dd className="mt-1.5 text-muted-foreground">{m.warranty}</dd>
                  </div>
                )}
              </dl>
              <p className="mt-6 text-xs text-muted-foreground">
                Informações e preços demonstrativos. Consulte a loja para dados reais.
              </p>
            </div>

            <div className="sticky bottom-0 border-t border-border bg-card/95 px-5 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur md:px-8 md:pb-5 md:pt-4">
              <a
                href={waLink(message)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-whats px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-whats-strong"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                {chosen ? `Consultar o tamanho ${chosen.name} pelo WhatsApp` : "Consultar disponibilidade pelo WhatsApp"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Seção ---------------- */

export function Catalog({
  preset,
  query,
  onQuery,
}: {
  preset?: CatalogPreset | undefined;
  query: string;
  onQuery: (q: string) => void;
}) {
  const [f, setF] = useState<Filters>(emptyFilters);
  const [sort, setSort] = useState<SortKey>("relevancia");
  const [sel, setSel] = useState<Mattress | null>(null);
  const [drawer, setDrawer] = useState(false);
  const closeModal = useCallback(() => setSel(null), []);
  const closeDrawer = useCallback(() => setDrawer(false), []);

  useEffect(() => {
    if (preset) setF((p) => ({ ...emptyFilters, query: p.query, ...preset.filters }));
  }, [preset]);
  useEffect(() => {
    setF((p) => ({ ...p, query }));
  }, [query]);
  useEffect(() => {
    const open = () => setDrawer(true);
    window.addEventListener("open-filters", open);
    return () => window.removeEventListener("open-filters", open);
  }, []);

  const list = useMemo(() => sortMattresses(filterMattresses(mattresses, f), sort), [f, sort]);

  // Opções sem nenhum modelo no catálogo inteiro ficam ocultas; as que só
  // zeram por causa dos filtros atuais aparecem desabilitadas, com contagem 0.
  const categories = useMemo(
    () =>
      CATEGORIES.filter((c) => countFor(mattresses, emptyFilters, "category", c.id) > 0).map((c) => ({
        ...c,
        count: countFor(mattresses, f, "category", c.id),
      })),
    [f],
  );
  const groups = useMemo<Group[]>(() => {
    const same = (arr: readonly string[]) => arr.map((v) => [v, v] as const);
    const defs: { key: ListKey; title: string; options: (readonly [string, string])[] }[] = [
      { key: "structures", title: "Estrutura", options: same(STRUCTURES) },
      { key: "comforts", title: "Conforto", options: same(COMFORTS) },
      { key: "sizes", title: "Tamanho", options: same(SIZES) },
      { key: "prices", title: "Faixa de preço", options: PRICE_RANGES.map((p) => [p.id, p.label] as const) },
      { key: "brands", title: "Marca", options: same(brandOptions(mattresses)) },
    ];
    return defs.map((d) => ({
      key: d.key,
      title: d.title,
      options: d.options
        .filter(([value]) => countFor(mattresses, emptyFilters, d.key, value) > 0)
        .map(([value, label]) => ({ value, label, count: countFor(mattresses, f, d.key, value) })),
    }));
  }, [f]);

  const toggle = (k: ListKey, v: string) =>
    setF((p) => ({ ...p, [k]: p[k].includes(v) ? p[k].filter((x) => x !== v) : [...p[k], v] }));
  const clearFilters = () => setF((p) => ({ ...emptyFilters, category: p.category, query: p.query }));
  const clearAll = () => {
    setF(emptyFilters);
    onQuery("");
  };
  const n = activeFilterCount(f);

  const chips = groups.flatMap((g) =>
    f[g.key].map((value) => ({
      id: `${g.key}:${value}`,
      label: g.options.find((o) => o.value === value)?.label ?? value,
      remove: () => toggle(g.key, value),
    })),
  );
  if (f.query.trim()) chips.unshift({ id: "query", label: `Busca: “${f.query.trim()}”`, remove: () => onQuery("") });

  const panel = <FilterPanel f={f} groups={groups} toggle={toggle} clear={clearFilters} />;

  return (
    <section id="colchoes" className="scroll-mt-28 pb-16 pt-10 md:pb-24 md:pt-14 lg:scroll-mt-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
          <h2 className="font-display text-3xl text-navy md:text-4xl">Nossos colchões</h2>
          <p className="text-sm text-muted-foreground">Compare estrutura, conforto, tamanhos e preços.</p>
        </div>

        <nav
          aria-label="Categorias"
          className="-mx-4 mt-5 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex gap-2 pb-1 md:flex-wrap">
            {categories.map((c) => {
              const active = f.category === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setF((p) => ({ ...p, category: c.id }))}
                  aria-pressed={active}
                  disabled={c.count === 0 && !active}
                  className={`flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    active
                      ? "border-navy bg-navy text-primary-foreground"
                      : "border-border bg-card text-navy enabled:hover:border-navy"
                  }`}
                >
                  {c.label}
                  <span className={`text-xs tabular-nums ${active ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {c.count}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="mt-6 grid gap-x-10 lg:mt-8 lg:grid-cols-[232px_1fr]">
          <aside className="hidden lg:block" aria-label="Filtros">
            <div className="sticky top-36 max-h-[calc(100dvh-10rem)] overflow-y-auto overscroll-contain pr-3 [scrollbar-width:thin]">{panel}</div>
          </aside>

          <div>
            <div className="grid grid-cols-2 items-center gap-2 sm:flex sm:justify-between sm:gap-4 lg:min-h-11 lg:border-b lg:border-border lg:pb-2">
              <button
                onClick={() => setDrawer(true)}
                aria-haspopup="dialog"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-input bg-card px-4 text-sm font-semibold text-navy sm:order-none lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden /> Filtros
                {n > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-navy px-1.5 text-xs tabular-nums text-primary-foreground">
                    {n}
                  </span>
                )}
              </button>
              <p
                className="order-last col-span-2 text-sm text-muted-foreground sm:order-none sm:col-span-1 lg:order-first"
                aria-live="polite"
              >
                <span className="font-semibold text-navy">{plural(list.length)}</span>
                {f.category !== "todos" && <> em {categoryLabel(f.category)}</>}
              </p>
              <label className="flex items-center gap-2 text-sm text-muted-foreground sm:ml-auto">
                <span className="sr-only sm:not-sr-only">Ordenar por</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="min-h-11 w-full rounded-md border border-input bg-card px-3 text-sm font-medium text-navy sm:w-auto"
                >
                  {SORTS.map(([k, l]) => (
                    <option key={k} value={k}>
                      {l}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {chips.length > 0 && (
              <ul className="mt-3 flex flex-wrap items-center gap-2" aria-label="Filtros aplicados">
                {chips.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={c.remove}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-soft pl-3 pr-2 text-sm text-navy transition-colors hover:bg-sand"
                    >
                      <span className="sr-only">Remover filtro </span>
                      {c.label}
                      <X className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={clearAll}
                    className="min-h-9 px-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    Limpar tudo
                  </button>
                </li>
              </ul>
            )}

            {list.length ? (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-5 lg:mt-6 xl:grid-cols-3">
                {list.map((m) => (
                  <ProductCard key={m.id} m={m} onOpen={() => setSel(m)} />
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-xl border border-dashed border-input px-6 py-14 text-center">
                <p className="font-display text-2xl text-navy">Nenhum colchão com essa combinação.</p>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                  Tente outra pesquisa ou remova alguns filtros. Se preferir, fale com a gente que ajudamos a
                  encontrar o modelo certo.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={clearAll}
                    className="min-h-11 rounded-md bg-navy px-5 text-sm font-semibold text-primary-foreground hover:bg-primary"
                  >
                    Limpar pesquisa e filtros
                  </button>
                  <a
                    href={waLink(MESSAGES.guidance)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-md border border-input px-5 text-sm font-semibold text-navy hover:bg-soft"
                  >
                    <MessageCircle className="h-4 w-4 text-whats" aria-hidden /> Pedir ajuda
                  </a>
                </div>
              </div>
            )}
            <p className="mt-8 text-xs text-muted-foreground">
              Modelos, marcas, preços e especificações fictícios, apenas para demonstração.
            </p>
          </div>
        </div>
      </div>
      <Drawer open={drawer} onClose={closeDrawer} count={list.length}>
        {panel}
      </Drawer>
      {sel && <ProductModal key={sel.id} m={sel} onClose={closeModal} />}
    </section>
  );
}
