# Deploy para Vercel

Este projeto é um site estático com HTML, CSS e JavaScript. Ele está pronto para ser publicado no Vercel sem build.

## Como funciona

- A raiz do site (`/`) redireciona automaticamente para `login.html`.
- O arquivo `index.html` contém o redirecionamento padrão.
- O arquivo `vercel.json` garante que a rota raiz sirva `login.html` em Vercel.

## Deploy rápido

1. Instale o Vercel CLI (opcional):

```bash
npm i -g vercel
```

2. No diretório do projeto, execute:

```bash
vercel login
vercel --prod
```

3. Alternativamente, conecte o repositório no dashboard do Vercel e publique como site estático.

## O que verificar

- `index.html` redireciona para `login.html`.
- `vercel.json` define a rota `/` para `login.html`.
- Não há comando de build.
- A pasta `css/`, `js/` e os arquivos HTML estão na raiz do projeto.

## Documentação adicional

- `README-VERCEL.md` contém instruções de deploy detalhadas para Vercel.