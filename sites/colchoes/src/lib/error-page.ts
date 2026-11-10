export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>Não foi possível carregar a página</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 16px/1.5 system-ui, -apple-system, sans-serif; background: #f8f9fb; color: #14294a; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.375rem; font-weight: 600; margin: 0 0 0.5rem; }
      p { color: #515d70; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { min-height: 2.75rem; padding: 0 1.25rem; border-radius: 0.5rem; font: inherit; font-weight: 600; cursor: pointer; text-decoration: none; border: 1px solid transparent; display: inline-flex; align-items: center; }
      .primary { background: #14294a; color: #fff; }
      .secondary { background: #fff; color: #14294a; border-color: #cfd6e0; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Não foi possível carregar a página</h1>
      <p>Algo deu errado do nosso lado. Tente de novo ou volte para o início.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Tentar de novo</button>
        <a class="secondary" href="${import.meta.env.BASE_URL}">Voltar ao início</a>
      </div>
    </div>
  </body>
</html>`;
}
