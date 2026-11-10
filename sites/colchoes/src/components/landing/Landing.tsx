import { useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowRight,
  BedDouble,
  Clock,
  Compass,
  CreditCard,
  HeartHandshake,
  LayoutGrid,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Search,
  SlidersHorizontal,
  Store,
  Truck,
  X,
} from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import storeImg from "@/assets/m3.jpg";
import { mattresses } from "@/data/mattresses";
import { brandOptions, formatBRL, minPrice, type Filters } from "@/lib/catalog";
import { STORE, MESSAGES, waLink, WHATSAPP_IS_DEMO } from "@/config/store";
import { Catalog, type CatalogPreset } from "./Catalog";

const nav = [
  ["Colchões", "#colchoes"],
  ["Como escolher", "#guia"],
  ["A loja", "#loja"],
  ["Marcas", "#marcas"],
  ["Ofertas", "#ofertas"],
  ["Contato", "#contato"],
] as const;

const scrollToCatalog = () => document.getElementById("colchoes")?.scrollIntoView({ behavior: "smooth" });

function BrandMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <defs>
        <mask id="brand-moon">
          <circle cx="16.3" cy="16" r="9" fill="#fff" />
          <circle cx="23.4" cy="12.6" r="7.4" />
        </mask>
      </defs>
      <rect width="32" height="32" rx="8" className="fill-navy" />
      <rect width="32" height="32" className="fill-sand" mask="url(#brand-moon)" />
    </svg>
  );
}

function Brand() {
  return (
    <a href="#inicio" className="flex shrink-0 items-center gap-2.5 rounded-md">
      <BrandMark />
      <span className="leading-none">
        <span className="block font-display text-xl text-navy">{STORE.name}</span>
        <span className="mt-1 hidden text-[0.6875rem] text-muted-foreground sm:block">{STORE.tagline}</span>
      </span>
    </a>
  );
}

const buttonBase =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-6 text-sm font-semibold transition-colors";

function WaButton({
  msg,
  children,
  variant = "solid",
  className = "",
}: {
  msg: string;
  children: ReactNode;
  variant?: "solid" | "outline";
  className?: string;
}) {
  const look =
    variant === "solid"
      ? "bg-whats text-primary-foreground hover:bg-whats-strong"
      : "border border-input bg-card text-navy hover:bg-soft [&_svg]:text-whats";
  return (
    <a href={waLink(msg)} target="_blank" rel="noopener noreferrer" className={`${buttonBase} ${look} ${className}`}>
      <MessageCircle className="h-4 w-4" aria-hidden /> {children}
    </a>
  );
}

function Header({ query, onQuery }: { query: string; onQuery: (q: string) => void }) {
  const [open, setOpen] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    (document.activeElement as HTMLElement | null)?.blur();
    scrollToCatalog();
  };
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2.5 md:flex-nowrap md:px-8 md:py-3">
        <Brand />
        <form onSubmit={submit} role="search" className="order-last w-full md:order-none md:mx-auto md:max-w-xl md:flex-1">
          <label className="flex min-h-11 items-center gap-2 rounded-full border border-input bg-card pl-4 pr-1 transition-colors focus-within:border-navy">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Buscar modelo, marca ou tipo"
              enterKeyHint="search"
              aria-label="Pesquisar colchões"
              className="h-11 w-full min-w-0 bg-transparent text-base text-navy outline-none placeholder:text-muted-foreground md:text-sm [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => onQuery("")}
                aria-label="Limpar pesquisa"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-soft hover:text-navy"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="submit"
              className="h-9 shrink-0 rounded-full bg-navy px-4 text-sm font-semibold text-primary-foreground hover:bg-primary"
            >
              Buscar
            </button>
          </label>
        </form>
        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <div className="hidden md:block">
            <WaButton msg={MESSAGES.general} className="min-h-11 px-5">
              WhatsApp
            </WaButton>
          </div>
          <button
            className="flex h-11 w-11 items-center justify-center rounded-full text-navy hover:bg-soft md:hidden"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      <nav className="hidden border-t border-border md:block" aria-label="Principal">
        <div className="mx-auto flex max-w-7xl gap-7 px-8">
          {nav.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="border-b-2 border-transparent py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-navy hover:text-navy"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>
      {open && (
        <nav className="border-t border-border bg-background px-4 pb-3 md:hidden" aria-label="Menu">
          {nav.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex min-h-12 items-center justify-between border-b border-border text-base text-navy last:border-0"
            >
              {label} <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden />
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

function Hero() {
  const prices = mattresses.map(minPrice).filter((p): p is number => p !== undefined);
  const structures = [...new Set(mattresses.map((m) => m.structure.toLowerCase()))];
  const structureList = new Intl.ListFormat("pt-BR", { type: "conjunction" }).format(structures);
  return (
    <section id="inicio" className="scroll-mt-32 bg-soft">
      <div className="mx-auto grid max-w-[100rem] lg:grid-cols-2">
        <div className="flex flex-col justify-center px-4 py-10 md:px-8 md:py-14 lg:py-20 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:pr-14 min-[100rem]:pl-40">
          <h1 className="max-w-[18ch] font-display text-[clamp(2.125rem,1.4rem+3.2vw,3.75rem)] leading-[1.05] text-navy">
            Seu próximo dia começa com uma boa noite de sono.
          </h1>
          <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-muted-foreground md:text-lg">
            Encontre o colchão ideal para o seu conforto. Compare modelos, tamanhos e preços, e tire suas dúvidas
            com a loja pelo WhatsApp.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href="#colchoes" className={`${buttonBase} bg-navy text-primary-foreground hover:bg-primary`}>
              Ver os colchões <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <WaButton msg={MESSAGES.guidance} variant="outline">
              Falar com um especialista
            </WaButton>
          </div>
          {prices.length > 0 && (
            <p className="mt-7 max-w-[52ch] border-t border-navy/10 pt-5 text-sm text-muted-foreground">
              {mattresses.length} modelos em {structureList}, a partir de{" "}
              <span className="font-semibold text-navy">{formatBRL(Math.min(...prices))}</span>.
            </p>
          )}
        </div>
        <div className="order-first lg:order-none">
          <img
            src={heroImg}
            alt="Quarto iluminado com cama arrumada em tons de branco e azul"
            width={1600}
            height={1200}
            fetchPriority="high"
            className="aspect-[16/9] h-full w-full object-cover sm:aspect-[21/9] lg:aspect-auto lg:max-h-[36rem] lg:min-h-full"
          />
        </div>
      </div>
    </section>
  );
}

function Guide({ setFilter }: { setFilter: (f: Partial<Filters>) => void }) {
  const go = (f: Partial<Filters>) => {
    setFilter(f);
    scrollToCatalog();
  };
  const options = [
    ["Prefere uma superfície mais firme?", "Ver modelos firmes", () => go({ comforts: ["Médio-firme", "Firme"] })],
    ["Busca uma sensação mais macia?", "Ver modelos macios", () => go({ comforts: ["Macio"] })],
    ["Quer conhecer as molas ensacadas?", "Ver molas ensacadas", () => go({ category: "molas" })],
  ] as const;
  const row =
    "group flex w-full flex-col gap-1 border-t border-primary-foreground/15 py-5 text-left sm:flex-row sm:items-center sm:justify-between sm:gap-6 md:py-6";
  const cta =
    "flex shrink-0 items-center gap-2 text-sm font-semibold text-soft transition-[gap,color] duration-200 group-hover:gap-3 group-hover:text-primary-foreground";
  return (
    <section id="guia" className="scroll-mt-28 bg-navy py-16 text-primary-foreground md:py-24 lg:scroll-mt-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-8 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <div>
          <h2 className="font-display text-3xl leading-tight md:text-[2.75rem]">
            Cada pessoa tem um jeito de descansar. Sua escolha também pode ser assim.
          </h2>
          <p className="mt-4 max-w-[46ch] text-soft/80">
            Comece pelo que você sente ao deitar. Os atalhos abaixo já levam ao catálogo filtrado.
          </p>
        </div>
        <div className="border-b border-primary-foreground/15">
          {options.map(([question, label, action]) => (
            <button key={question} onClick={action} className={row}>
              <span className="font-display text-xl md:text-2xl">{question}</span>
              <span className={cta}>
                {label} <ArrowRight className="h-4 w-4" aria-hidden />
              </span>
            </button>
          ))}
          <a href={waLink(MESSAGES.guidance)} target="_blank" rel="noopener noreferrer" className={row}>
            <span className="font-display text-xl md:text-2xl">Precisa de ajuda para escolher o tamanho?</span>
            <span className={cta}>
              <MessageCircle className="h-4 w-4" aria-hidden /> Falar no WhatsApp
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

function StoreSection() {
  const items = [
    [HeartHandshake, "Atendimento personalizado", "Conversamos sobre como você dorme antes de indicar qualquer modelo."],
    [LayoutGrid, "Variedade de modelos", "Espuma, molas ensacadas e híbridos, em diferentes níveis de firmeza."],
    [Compass, "Orientação para escolha", "Comparamos as opções lado a lado, sem pressa e sem termos complicados."],
    [CreditCard, "Condições de pagamento", "Consulte as formas de pagamento e o parcelamento disponíveis."],
    [Truck, "Entrega e montagem", "Consulte prazos e regiões atendidas pelo WhatsApp."],
    [Store, "Experimente na loja", "Deite nos modelos e compare as sensações antes de decidir."],
  ] as const;
  return (
    <section id="loja" className="scroll-mt-28 py-16 md:py-24 lg:scroll-mt-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <img
            src={storeImg}
            alt="Colchão com acabamento matelassê sob lençóis azul-claros"
            loading="lazy"
            width={1200}
            height={900}
            className="aspect-[4/3] w-full rounded-xl object-cover"
          />
          <div>
            <h2 className="font-display text-3xl leading-tight text-navy md:text-[2.75rem]">
              Venha experimentar antes de escolher.
            </h2>
            <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-muted-foreground">
              Na loja física, você pode deitar nos modelos, comparar as sensações e tirar dúvidas com a equipe.
            </p>
            <p className="mt-3 max-w-[56ch] leading-relaxed text-muted-foreground">
              Escolher um colchão é pessoal. Por isso, o atendimento começa ouvindo o que você procura.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <WaButton msg={MESSAGES.guidance}>Agendar uma visita</WaButton>
              <a href="#contato" className={`${buttonBase} border border-input bg-card text-navy hover:bg-soft`}>
                <Store className="h-4 w-4" aria-hidden /> Endereço e horários
              </a>
            </div>
          </div>
        </div>

        <dl className="mt-14 grid gap-x-10 border-t border-border sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
          {items.map(([Icon, title, text]) => (
            <div key={title} className="flex gap-4 border-b border-border py-6">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
              <div>
                <dt className="font-semibold text-navy">{title}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Brands({ setFilter }: { setFilter: (f: Partial<Filters>) => void }) {
  const brands = brandOptions(mattresses);
  return (
    <section id="marcas" className="scroll-mt-28 border-y border-border bg-muted py-12 md:py-16 lg:scroll-mt-32">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 md:px-8 lg:grid-cols-[5fr_7fr] lg:items-center lg:gap-16">
        <div>
          <h2 className="font-display text-3xl leading-tight text-navy">Marcas que você encontra na loja.</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Toque em uma marca para ver os modelos dela. Nomes demonstrativos.
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {brands.map((brand) => {
            const count = mattresses.filter((m) => m.brand === brand).length;
            return (
              <li key={brand}>
                <button
                  onClick={() => {
                    setFilter({ brands: [brand] });
                    scrollToCatalog();
                  }}
                  className="group flex min-h-20 w-full items-center justify-between gap-4 rounded-xl border border-border bg-card px-5 text-left transition-colors hover:border-navy"
                >
                  <span>
                    <span className="block font-display text-xl text-navy">{brand}</span>
                    <span className="block text-sm text-muted-foreground">
                      {count} {count === 1 ? "modelo" : "modelos"}
                    </span>
                  </span>
                  <ArrowRight
                    className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-navy"
                    aria-hidden
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function Campaign() {
  return (
    <section id="ofertas" className="scroll-mt-28 bg-sand lg:scroll-mt-32">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-14 md:px-8 md:py-20 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <div>
          <p className="text-sm font-semibold text-sand-foreground">Campanha em destaque</p>
          <h2 className="mt-3 max-w-[22ch] font-display text-3xl leading-tight text-navy md:text-5xl">
            Sua próxima noite de descanso começa com uma boa escolha.
          </h2>
          <p className="mt-4 max-w-[52ch] text-sand-foreground">
            Conte com nossa equipe para conhecer os modelos disponíveis e encontrar uma opção adequada às suas
            preferências.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <a href="#colchoes" className={`${buttonBase} bg-navy text-primary-foreground hover:bg-primary`}>
            Ver os colchões <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
          <WaButton msg={MESSAGES.guidance}>Falar com um especialista</WaButton>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const heading = "flex items-center gap-2 text-sm font-semibold text-navy";
  return (
    <footer id="contato" className="scroll-mt-28 bg-background lg:scroll-mt-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 md:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <BrandMark />
            <span className="font-display text-xl text-navy">{STORE.name}</span>
          </div>
          <p className="mt-3 max-w-[32ch] text-sm text-muted-foreground">
            {STORE.tagline}. Atendimento na loja e pelo WhatsApp.
          </p>
        </div>
        <div>
          <h3 className={heading}>
            <MapPin className="h-4 w-4 text-primary" aria-hidden />
            Endereço
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{STORE.address}</p>
          {STORE.mapUrl && (
            <a
              href={STORE.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              Ver no mapa
            </a>
          )}
        </div>
        <div>
          <h3 className={heading}>
            <Clock className="h-4 w-4 text-primary" aria-hidden />
            Horário
          </h3>
          <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
            {STORE.hours.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className={heading}>
            <Phone className="h-4 w-4 text-primary" aria-hidden />
            Contato
          </h3>
          <p className="mt-3 text-sm tabular-nums text-muted-foreground">{STORE.phoneDisplay}</p>
          <WaButton msg={MESSAGES.general} className="mt-4 min-h-11 px-5">
            Chamar no WhatsApp
          </WaButton>
          {(STORE.social.instagram || STORE.social.facebook) && (
            <div className="mt-4 flex gap-4 text-sm font-semibold">
              {STORE.social.instagram && (
                <a href={STORE.social.instagram} className="text-primary underline-offset-4 hover:underline">
                  Instagram
                </a>
              )}
              {STORE.social.facebook && (
                <a href={STORE.social.facebook} className="text-primary underline-offset-4 hover:underline">
                  Facebook
                </a>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-border px-4 pb-24 pt-6 text-center text-xs text-muted-foreground md:pb-6">
        © {new Date().getFullYear()} {STORE.name}. Página demonstrativa: dados, produtos e contatos fictícios. Este
        site não coleta dados pessoais.
      </div>
    </footer>
  );
}

function FloatingWa() {
  return (
    <a
      href={waLink(MESSAGES.general)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar pelo WhatsApp"
      className="fixed bottom-5 right-5 z-30 hidden h-14 w-14 items-center justify-center rounded-full bg-whats text-primary-foreground shadow-lift transition-colors hover:bg-whats-strong md:flex"
    >
      <MessageCircle className="h-6 w-6" aria-hidden />
    </a>
  );
}

function MobileBar() {
  const openFilters = () => {
    scrollToCatalog();
    window.dispatchEvent(new Event("open-filters"));
  };
  const item =
    "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[0.6875rem] font-medium text-muted-foreground active:text-navy";
  return (
    <nav
      aria-label="Atalhos"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <div className="flex items-stretch px-1">
        <a href="#colchoes" className={item}>
          <BedDouble className="h-5 w-5" aria-hidden />
          Colchões
        </a>
        <button onClick={openFilters} className={item}>
          <SlidersHorizontal className="h-5 w-5" aria-hidden />
          Filtros
        </button>
        <a href="#contato" className={item}>
          <MapPin className="h-5 w-5" aria-hidden />
          Loja
        </a>
        <a
          href={waLink(MESSAGES.general)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-[1.6] items-center justify-center py-1.5 pr-1"
        >
          <span className="flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-whats text-sm font-semibold text-primary-foreground">
            <MessageCircle className="h-4 w-4" aria-hidden />
            WhatsApp
          </span>
        </a>
      </div>
    </nav>
  );
}

export function Landing() {
  const [preset, setPreset] = useState<CatalogPreset>();
  const [query, setQuery] = useState("");
  const setFilter = (filters: Partial<Filters>) => setPreset({ key: Date.now(), filters });
  return (
    <>
      <a
        href="#colchoes"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-navy focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        Ir para o catálogo
      </a>
      {WHATSAPP_IS_DEMO && (
        <div className="bg-navy px-4 py-2 text-center text-xs text-soft">
          Modo demonstração: o número de WhatsApp ainda não foi configurado.
        </div>
      )}
      <Header query={query} onQuery={setQuery} />
      <main>
        <Hero />
        <Catalog preset={preset} query={query} onQuery={setQuery} />
        <Guide setFilter={setFilter} />
        <StoreSection />
        <Brands setFilter={setFilter} />
        <Campaign />
      </main>
      <Footer />
      <FloatingWa />
      <MobileBar />
    </>
  );
}
