// ============================================================
// CONFIGURAÇÃO DA LOJA — substitua pelos dados reais do cliente
// ============================================================

// Formato internacional, somente dígitos (55 + DDD + número).
export const WHATSAPP_NUMBER: string = "556199315616";
export const WHATSAPP_IS_DEMO = WHATSAPP_NUMBER === "5500000000000";

export const STORE = {
  name: "Sua Marca",
  tagline: "Colchões & Descanso",
  phoneDisplay: "(61) 9931-5616",
  address: "Rua Exemplo, 000 — Bairro, Cidade/UF (endereço demonstrativo)",
  hours: ["Seg. a Sex.: 9h às 18h", "Sábado: 9h às 13h", "Horários demonstrativos"],
  mapUrl: "", // cole aqui o link do Google Maps da loja
  social: { instagram: "", facebook: "" }, // deixe vazio para ocultar
};

export const MESSAGES = {
  general: "Olá! Vi o site de vocês e gostaria de conhecer melhor os colchões disponíveis. Pode me ajudar?",
  guidance:
    "Olá! Estou procurando um colchão confortável e queria uma ajuda para entender qual modelo combina melhor com o que preciso.",
  product: (n: string) =>
    `Olá! Vi o colchão ${n} no site e gostaria de saber mais sobre ele. Quais tamanhos e condições vocês têm disponíveis?`,
  availability: (n: string) =>
    `Olá! Gostaria de saber mais sobre o colchão ${n}. Quais tamanhos estão disponíveis e posso experimentá-lo na loja?`,
  size: (n: string, size: string) =>
    `Olá! Tenho interesse no colchão ${n} no tamanho ${size}. Ele está disponível? Posso experimentá-lo na loja?`,
  price: (n: string) =>
    `Olá! Gostaria de consultar o preço e as condições do colchão ${n}. Pode me passar mais informações?`,
};

export function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
