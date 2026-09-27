# Pesquisa de artigos do blog do Agi

Suíte E2E em [Cypress](https://www.cypress.io/) para a pesquisa de artigos aberta pela lupa do [blog do Agi](https://blog.agibank.com.br/).

O endereço do enunciado, [blogdoagi.com.br](https://blogdoagi.com.br/), abre `https://blog.agibank.com.br/`. A automação usa esse host.

Este README é o roteiro da apresentação: o que foi pedido, a visão da solução e os comandos na ordem em que a suíte é instalada, executada e lida no Allure.

O detalhe de risco e escopo está em [`docs/analise-e-estrategia.md`](docs/analise-e-estrategia.md). O desenho do relatório está em [`docs/artigo-allure.md`](docs/artigo-allure.md).

## O que foi solicitado

O desafio pede a automação da pesquisa de artigos do blog, a partir da lupa no canto superior direito.

| Pedido | Como este repositório responde |
| --- | --- |
| Pelo menos dois cenários relevantes | Três cenários: termo com artigos, termo sem resultado e abrir a lupa para sair sem pesquisar |
| Linguagem à escolha | Cypress com JavaScript. O avaliador só precisa de Node.js e npm |
| Repositório público no GitHub | https://github.com/vnathale/DesafioQA_Agibank_NyvoraConsulting |
| README para configurar e executar | Este arquivo, com a sequência de comandos abaixo |
| Executável em Linux, Windows e macOS | Os comandos são os mesmos nos três sistemas. O navegador padrão é o Electron, que vem com o Cypress |
| Pipeline | [GitHub Actions](.github/workflows/cypress.yml) roda `npm test` e publica o HTML do Allure |

## Visão da solução

A lupa é a entrada da jornada. O valor para o leitor do blog está no que acontece depois: achar artigos sobre o termo, ou entender que nada foi encontrado. A suíte protege esses dois contratos e ainda confirma que a lupa abre o campo e pode ser dispensada com Escape.

A automação fala a língua de quem usa o blog. O arquivo de teste não contém seletor CSS. A página inicial pesquisa; a página de resultados confere o retorno. Os termos ficam em um fixture, para trocar a massa sem mexer no fluxo.

O Allure entra como evidência da execução. Cada comando do Cypress vira um passo. Épico, funcionalidade, história, severidade e o termo pesquisado aparecem no HTML. O relatório é gerado com o Allure 3, em Node, sem Java.

## Cenários que a apresentação mostra

| Cenário | O que a pessoa faz | O que a suíte confere | Severidade |
| --- | --- | --- | --- |
| Termo existente | Pesquisa `cartão` pela lupa | URL `?s=cartão`, título com o termo e ao menos um artigo que o menciona | critical |
| Termo inexistente | Pesquisa um termo que não está no blog | URL e título com o termo, nenhum artigo e a mensagem de que nada foi encontrado | critical |
| Abrir e sair | Abre a lupa e pressiona Escape | O campo "Digite sua busca" aparece e a home volta sem pesquisa e sem hash | normal |

Os termos estão em [`cypress/fixtures/busca.json`](cypress/fixtures/busca.json).

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior. Este projeto foi exercitado no Node 22
- npm, que acompanha o Node
- Internet até `https://blog.agibank.com.br`

Chrome é opcional. O comando padrão usa o Electron. Java não entra na instalação: o Allure 3 roda em Node.

## Passo a passo

Abra o terminal na pasta do projeto. No Windows, PowerShell ou Prompt. No macOS e no Linux, o terminal habitual. Os comandos são os mesmos.

### 1. Baixar o repositório

```bash
git clone https://github.com/vnathale/DesafioQA_Agibank_NyvoraConsulting.git
cd DesafioQA_Agibank_NyvoraConsulting
```

### 2. Instalar as dependências

```bash
npm install
```

Esse comando lê o `package-lock.json`, instala o Cypress, o Allure e baixa o binário do navegador de teste. A primeira vez usa a rede e pode levar alguns minutos.

### 3. Confirmar que o Cypress está pronto

```bash
npx cypress verify
```

A saída esperada contém `Cypress 14.5.4 is installed`.

Se a mensagem disser que o executável não foi encontrado, o cache dessa versão está incompleto. Reinstale e confira de novo:

```bash
npx cypress install --force
npx cypress verify
```

No Windows, se a reinstalação continuar falhando na extração, apague a pasta incompleta e rode o install outra vez:

```bash
rmdir /s /q %LOCALAPPDATA%\Cypress\Cache\14.5.4
npx cypress install --force
npx cypress verify
```

### 4. Executar os testes

```bash
npm test
```

Esse é o modo de apresentação e também o comando do pipeline: Cypress headless no Electron. Ao terminar, o HTML do Allure fica em `execucoes/headless/allure-report`.

O terminal lista os três cenários. Os três precisam aparecer como passando para a demonstração seguir para o relatório.

### 5. Abrir o Allure

```bash
node execucoes/relatorio.js headless
```

O navegador abre o relatório dessa execução. Na apresentação, mostre nesta ordem:

1. O resumo com os três testes passando.
2. A árvore de comportamento: épico **Blog do Agi**, funcionalidade **Pesquisa de artigos** e as três histórias.
3. O teste do termo `cartão`: o parâmetro `termo` e os passos até a lista de artigos.
4. O teste do termo inexistente: a mesma jornada até a mensagem de ausência.
5. O ambiente da execução: modo `headless`, navegador `electron` e o endereço do blog.

Para juntar tudo o que já foi executado (headless, Chrome, janela visível) num relatório só:

```bash
npm run allure:report
```

## Outros modos

A pasta [`execucoes`](execucoes) separa cada forma de rodar. O passo a passo de cada comando, a pasta do Allure e o que mostrar na apresentação estão em [`execucoes/README.md`](execucoes/README.md).

| Comando | Quando usar na apresentação |
| --- | --- |
| `npm test` | Demonstração padrão e o que o GitHub Actions executa |
| `npm run test:chrome` | Mesma suíte no Chrome instalado na máquina |
| `npm run test:headed` | Electron com a janela visível, para acompanhar a lupa |
| `npm run cy:open` | Cypress interativo, para executar um cenário e pausar |
| `node execucoes/relatorio.js headless` | Reabre o HTML do `npm test` |
| `npm run allure:report` | Junta os modos já rodados e abre o HTML |

Para reabrir outro modo, troque `headless` por `chrome`, `headed` ou `interativo`:

```bash
node execucoes/relatorio.js chrome
```

Um spec só, se a apresentação quiser isolar a pesquisa:

```bash
npx cypress run --spec cypress/e2e/busca/pesquisa-de-artigos.cy.js
```

Quando um teste falha, o Cypress grava a tela em `cypress/screenshots/` e o Allure anexa esse passo ao relatório. As pastas `allure-results` e `allure-report` são geradas na hora e não entram no Git.

## Pipeline

[`.github/workflows/cypress.yml`](.github/workflows/cypress.yml) roda `npm test` no Ubuntu a cada push, pull request ou disparo manual. O navegador é o Electron, o mesmo da máquina local. O HTML do Allure sobe como artefato `allure-report`. Screenshots e vídeo de falha sobem em outro artefato.

## Estrutura

```
cypress.config.js
cypress/
  e2e/busca/pesquisa-de-artigos.cy.js   cenários, na linguagem de quem pesquisa
  fixtures/busca.json                   termos pesquisados
  support/e2e.js                        Allure e exceções conhecidas do blog
  support/commands.js                   preparação do JavaScript adiado
  support/seletores.js                  contrato com o HTML, num arquivo só
  support/pages/                        ações e conferências da jornada
execucoes/                              um script por modo de execução
docs/analise-e-estrategia.md            por que estes cenários e o que ficou de fora
docs/artigo-allure.md                   como o relatório é montado
```

Se o tema mudar um id, a alteração começa em `cypress/support/seletores.js`.

## Limitações conhecidas

O detalhe está em [`docs/analise-e-estrategia.md`](docs/analise-e-estrategia.md).

- A suíte cobre o header de desktop (1366×768). O header mobile é outro markup.
- O JavaScript que abre a lupa chega na página em `script[data-src]` e o loader atual não o executa. `cy.prepararBusca()` carrega esse bundle e reaplica o handler na lupa visível, porque o header fixo recria o ícone sem o `onclick`.
- Fechar pelo X do overlay fica coberto pelo header fixo. O cenário de saída usa Escape.
- Sugestão enquanto se digita e a busca com o campo vazio ficaram de fora. A primeira depende do evento `load`. A segunda precisa de uma regra de produto antes de virar critério.

## Licença

MIT. Veja [LICENSE](LICENSE).
