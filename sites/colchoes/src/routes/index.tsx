import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/components/landing/Landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sua Marca — Colchões para uma boa noite de sono" },
      { name: "description", content: "Encontre o colchão ideal para o seu conforto. Modelos de espuma, molas ensacadas e híbridos com atendimento pelo WhatsApp." },
      { property: "og:title", content: "Sua Marca — Colchões para uma boa noite de sono" },
      { property: "og:description", content: "Seu próximo dia começa com uma boa noite de sono. Conheça nossos colchões." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});
