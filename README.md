# Deploy para Netlify

Este projeto é um site estático com HTML, CSS e JavaScript. Ele pode ser publicado diretamente no Netlify usando a pasta do projeto como diretório de publicação.

## Passo a passo

1. Acesse https://app.netlify.com/ e crie uma conta ou faça login.
2. Crie um novo site.
3. Selecione "Deploy manually" ou conecte ao seu repositório Git.

### Deploy manual (drag and drop)
- Comprima a pasta `gestor` ou use o recurso de arrastar e soltar do Netlify.
- O diretório de publicação é a raiz do projeto.

### Deploy via Git
- Garanta que o repositório Git esteja no diretório `gestor`.
- Conecte o repositório no Netlify.
- Configure:
  - Build command: deixe vazio
  - Publish directory: `.`

## Configuração Netlify
- O arquivo `netlify.toml` já está criado na raiz.
- Ele publica o site a partir da raiz do projeto e redireciona a página inicial para `login.html`.

## Observação
- Se quiser usar outra página inicial, edite o redirecionamento em `netlify.toml`.
