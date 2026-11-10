# Central de demonstrações — italosol

Sites de demonstração por nicho, todos publicados no mesmo endereço do Firebase Hosting:

| Endereço | Pasta |
|---|---|
| https://italosol.web.app/ | `hub/` (lista de demonstrações) |
| https://italosol.web.app/colchoes | `sites/colchoes/` |
| https://italosol.web.app/petshop | `sites/petshop/` |

- Projeto Firebase: `demo-italo` (ID `fir-italo-4a8be`), site de hosting `italosol`.
- Repositório: `ItaloSol/demostracao-italosol`.

## Como funciona

```
sites/<nicho>/        um site por pasta; o nome da pasta vira o endereço
hub/                  página inicial e página 404
scripts/build.mjs     monta a pasta public/ (hub na raiz + cada site em /<nicho>/)
firebase.json         publica a pasta public/ no site "italosol"
.github/workflows/    a cada push, monta e publica sozinho
```

A pasta `public/` é gerada pelo build e não vai para o git. `materiais-comerciais/`
(fichas, imagens, referências) também fica só no computador.

## Atualizar um site

Edite os arquivos em `sites/<nicho>/` e envie:

```
git add .
git commit -m "Atualiza petshop"
git push
```

O GitHub publica em 1 a 2 minutos. O andamento aparece na aba **Actions** do repositório.

## Adicionar um novo nicho

1. Crie a pasta `sites/<nicho>/` com letras minúsculas, números e hífen, sem acento
   nem espaço (ex.: `sites/odontologia/`). Esse nome será o endereço.
2. Coloque o site dentro dela, em um dos dois formatos abaixo.
3. Crie `sites/<nicho>/demo.json` para o cartão da página inicial:

   ```json
   {
     "titulo": "Clínicas odontológicas",
     "descricao": "Tratamentos, equipe e agendamento pelo WhatsApp.",
     "ordem": 3
   }
   ```

   `"oculto": true` publica o site sem mostrá-lo na página inicial.
4. `git add . && git commit -m "Nova demo: odontologia" && git push`.

### Formato A — site estático (HTML pronto)

A pasta precisa ter um `index.html`. Ela é copiada como está.
Use caminhos **relativos** para os arquivos do site (`css/estilo.css`, `img/foto.jpg`),
nunca começando com `/` — um caminho `/img/foto.jpg` apontaria para a raiz do domínio,
fora da demonstração.

### Formato B — projeto com build (Vite, React etc.)

A pasta precisa ter `package.json` com o script `build`. O build central roda
`npm run build` com a variável `SITE_BASE="/<nicho>/"`. O projeto deve usá-la como base:

```ts
// vite.config.ts
export default defineConfig({
  base: process.env.SITE_BASE ?? "/",
});
```

Com roteador (React Router, TanStack Router), use `import.meta.env.BASE_URL` como
`basepath`/`basename`. Arquivos da pasta `public` do projeto devem ser referenciados com
`${import.meta.env.BASE_URL}arquivo.png`. Veja `sites/colchoes` como exemplo.

O resultado é lido de `dist-static`, `dist/client`, `dist` ou `build`. Se for outra pasta,
informe em `demo.json`: `"saida": "pasta-do-build"`.

## Testar no computador

```
npm run build      monta a pasta public/
npm run preview    abre um servidor local com o resultado
```

`node scripts/build.mjs petshop` reconstrói apenas um site.

## Publicar manualmente (sem o GitHub)

```
npm run deploy
```

## Configuração da publicação automática (feita uma única vez)

O workflow `.github/workflows/deploy.yml` precisa do segredo
`FIREBASE_SERVICE_ACCOUNT_FIR_ITALO_4A8BE` no repositório do GitHub. Para criá-lo:

```
firebase init hosting:github
```

- Repositório: `ItaloSol/demostracao-italosol`
- "Set up the workflow to run a build script?" → **No**
- "Set up automatic deployment to your site's live channel when a PR is merged?" → **No**

O comando cria o segredo e um arquivo `.github/workflows/firebase-hosting-pull-request.yml`.
Apague esse arquivo: a publicação é feita pelo `deploy.yml`.
