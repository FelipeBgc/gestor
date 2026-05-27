Deploy no Vercel
===============

Instruções rápidas para hospedar este projeto (site estático) no Vercel:

1. Instale o CLI (opcional):

```bash
npm i -g vercel
```

2. No diretório do projeto, faça login e deploy:

```bash
vercel login
vercel --prod
```

3. Alternativa: No dashboard do Vercel, crie um novo projeto apontando para este repositório. O Vercel detecta que é um site estático e publica automaticamente.

Observações:
- A página inicial já está configurada para redirecionar para `login.html` (arquivo `index.html`).
- O arquivo `vercel.json` contém uma rota que garante que a raiz seja servida a partir de `login.html`.
- Não é necessário build; apenas arquivos estáticos serão publicados.
