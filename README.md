# Pesquisa de artigos do blog do Agi

Suíte E2E em [Cypress](https://www.cypress.io/) para a pesquisa de artigos aberta pela lupa do [blog do Agi](https://blog.agibank.com.br/).

O endereço do enunciado, [blogdoagi.com.br](https://blogdoagi.com.br/), abre `https://blog.agibank.com.br/`. A automação usa esse host.

Este repositório também é um modelo de análise para outros projetos: o raciocínio de risco, escopo e desenho da suíte está em [`docs/analise-e-estrategia.md`](docs/analise-e-estrategia.md).

## Cenários

| Cenário | O que a pessoa faz | O que a suíte confere |
| --- | --- | --- |
| Termo existente | Pesquisa `cartão` pela lupa | URL `?s=cartão`, título com o termo e ao menos um artigo que o menciona |
| Termo inexistente | Pesquisa um termo que não está no blog | URL e título com o termo, nenhum artigo e a mensagem de que nada foi encontrado |
| Abrir e sair | Abre a lupa e pressiona Escape | O campo "Digite sua busca" aparece e a home volta sem pesquisa e sem hash |

Os termos ficam em [`cypress/fixtures/busca.json`](cypress/fixtures/busca.json).

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior (o projeto foi exercitado no Node 22)
- npm (vem com o Node)
- Acesso à internet até `https://blog.agibank.com.br`

Não é preciso instalar Chrome. O comando padrão usa o Electron que o Cypress baixa junto com a dependência. Chrome, Edge ou Firefox entram só se você quiser apontar o navegador.

## Instalação

No Windows (PowerShell ou Prompt), macOS ou Linux:

```bash
git clone https://github.com/SEU-USUARIO/agibank-blog-busca-cypress.git
cd agibank-blog-busca-cypress
npm install
```

`npm install` lê o `package-lock.json`, instala o Cypress e baixa o binário do navegador de teste. A primeira execução precisa de rede e pode levar alguns minutos.

Conferir a instalação:

```bash
npx cypress verify
```

## Execução

Modo headless, o mesmo do pipeline:

```bash
npm test
```

Modo interativo, com o navegador do Cypress aberto para acompanhar cada passo:

```bash
npm run cy:open
```

No Chrome instalado na máquina:

```bash
npm run test:chrome
```

Um spec só:

```bash
npx cypress run --spec cypress/e2e/busca/pesquisa-de-artigos.cy.js
```

Quando um teste falha, o Cypress grava a tela em `cypress/screenshots/`. No GitHub Actions o vídeo também é gerado e sobe como artefato da execução que falhou.

## Pipeline

[`.github/workflows/cypress.yml`](.github/workflows/cypress.yml) roda `npm ci` e `cypress run` no Ubuntu a cada push, pull request ou disparo manual. O navegador é o Electron, para a execução do avaliador e a do pipeline usarem o mesmo comando.

## Estrutura

```
cypress.config.js
cypress/
  e2e/busca/pesquisa-de-artigos.cy.js   cenários
  fixtures/busca.json                   termos pesquisados
  support/e2e.js                        exceções conhecidas do blog
  support/commands.js                   preparação do JavaScript adiado
  support/seletores.js                  contrato com o HTML
  support/pages/                        ações e conferências da jornada
docs/analise-e-estrategia.md            análise de risco e desenho da suíte
```

O spec descreve a jornada. Seletores CSS ficam em `seletores.js`. Se o tema mudar um id, a alteração começa por esse arquivo.

## Limitações conhecidas

Detalhe e evidência em [`docs/analise-e-estrategia.md`](docs/analise-e-estrategia.md).

- A suíte cobre o header de desktop (1366×768). O header mobile é outro markup.
- O JavaScript que abre a lupa chega na página em `script[data-src]` e o loader atual não o executa. `cy.prepararBusca()` carrega esse bundle e reaplica o handler na lupa visível, porque o header fixo recria o ícone sem o `onclick`.
- Fechar pelo `X` do overlay fica coberto pelo header fixo. O cenário de saída usa Escape.
- Sugestão enquanto se digita e a busca com o campo vazio ficaram de fora: a primeira depende do evento `load`, a segunda precisa de uma regra de produto.

## Licença

MIT. Veja [LICENSE](LICENSE).
