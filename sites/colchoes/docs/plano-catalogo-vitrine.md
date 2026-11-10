# Catálogo virando vitrine de loja

Só a seção de colchões muda. Cores, fontes e as outras seções continuam iguais.

## O que o visitante vai ver
- **Topo da loja:** título, uma barra de pesquisa grande ("Qual colchão você está procurando?") e categorias clicáveis: Todos, Espuma, Molas ensacadas, Híbridos, Ortopédicos, Premium, Infantis.
- **Filtros (lateral esquerda no computador):** estrutura, nível de conforto, tamanho, faixa de preço e marca. Dá para marcar vários ao mesmo tempo. Tem um botão "Limpar filtros" e a contagem de modelos encontrados.
- **No celular:** um botão "Filtros" abre uma gaveta lateral com os mesmos filtros.
- **Ordenação:** mais relevantes, menor preço, maior preço e nome.
- **Cards:** foto do mesmo tamanho em todos, nome, marca, categoria, estrutura, conforto, preço "a partir de", selo de destaque e botão "Ver detalhes". Entram com uma animação suave.
- **Janela de detalhes:** foto grande, descrição, características e tecnologias, tamanhos com preço por tamanho (quando houver), garantia e o botão "Consultar disponibilidade pelo WhatsApp" com a mensagem do pedido.
- **Nada encontrado:** mensagem amigável e botão para limpar a busca.
- Os atalhos da seção "Guia" ("Mais firmes" etc.) continuam levando ao catálogo já filtrado.

## Sobre os dados (importante)
Continuam os 6 modelos demonstrativos. Para os filtros novos funcionarem, preciso preencher campos novos e todos vão ficar marcados como **demonstrativos**:
- **Marca:** uso "Marca Exemplo A/B" até você mandar as marcas reais.
- **Preço por tamanho:** valores de exemplo a partir do preço atual.
- **Ortopédico / Premium / Infantil:** marco Firme Pro como ortopédico e Horizonte/Serena Plus como premium. Nenhum é infantil, então essa categoria mostra a mensagem de "nenhum modelo" até você cadastrar um.
- Tamanho Viúva só aparece com resultado se algum modelo tiver; hoje nenhum tem.

Qualquer modelo novo depois é só acrescentar na lista de dados; categorias, marcas e filtros se atualizam sozinhos.

## Detalhes técnicos
- `src/data/mattresses.ts`: novo tipo com `brand`, `categories[]` (inclui ortopédico/premium/infantil), `structure` (Espuma/Molas ensacadas/Híbrido), `comfort` (Macio/Médio/Médio-firme/Firme), `sizes[{label, price?}]`, `features`, `technologies`, `warranty?`, `images[]`, `highlight?`, `available`, `relevance`. Listas de categorias e faixas de preço exportadas daqui.
- `src/lib/catalog.ts`: funções puras `filterMattresses`, `sortMattresses`, `facetOptions` (opções derivadas dos dados) e busca sem acento em nome, marca, estrutura, características e categoria.
- `src/components/landing/catalog/`: `CatalogSection`, `FilterPanel` (reutilizado na lateral e na gaveta via componente Sheet), `ProductCard`, `ProductModal` (Esc fecha), `SortSelect`. `Landing.tsx` passa a importar a seção; o estado de filtro do Guia é mantido.
- Testes em `src/test/catalog.test.ts`: filtros combinados, faixas de preço, ordenação por preço e busca.
- Sem checkout/pagamento; links wa.me existentes preservados.
