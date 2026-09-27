# 📊 Allure na pesquisa de artigos

Este artigo descreve como o relatório Allure entra na suíte Cypress do Blog do Agi e como executar cada modo sem instalar Java.

O roteiro de apresentação, com o comando de cada modo, está em [`execucoes/README.md`](../execucoes/README.md). O README da raiz cobre a instalação e a ordem da demonstração.

---

## 🎯 Por que Allure

O terminal do Cypress diz se o cenário passou. O Allure organiza a mesma execução para quem vai ler o resultado depois:

- 🏷️ épico;
- 🧩 funcionalidade;
- 📖 história;
- 🚨 severidade;
- 🔎 parâmetro pesquisado;
- 👣 passos do Cypress;
- 📸 a tela quando algo quebra.

A suíte continua a mesma. O que muda é a evidência ao redor dela.

---

## 🔗 O que foi ligado

| Peça | Papel |
| --- | --- |
| `allure-cypress` | Escreve os resultados enquanto o Cypress roda. Cada comando `cy` vira um passo |
| `allure` 3 | Gera o HTML em Node. Não usa o Allure 2 e não pede Java |
| `cypress/support/e2e.js` | Carrega o runtime do Allure no navegador do teste |
| `cypress.config.js` | Define a pasta de resultados e os dados de ambiente |
| `pesquisa-de-artigos.cy.js` | Marca épico, funcionalidade, história, severidade e o termo pesquisado |

Os três cenários ficam sob o épico **Blog do Agi** e a funcionalidade **Pesquisa de artigos**.

| História no Allure | Severidade |
| --- | --- |
| Termo existente | `critical` |
| Termo inexistente | `critical` |
| Abrir e sair da lupa | `normal` |

O ambiente gravado em cada execução traz sistema, versão do sistema, Node, modo, navegador e o endereço do blog.

---

## 📁 Onde cada execução fica

A pasta [`execucoes`](../execucoes) separa os modos para um relatório não misturar com o outro.

```text
execucoes/
├── headless/allure-results     bruto do npm test
├── headless/allure-report      HTML desse modo
├── chrome/                     npm run test:chrome
├── headed/                     npm run test:headed
├── interativo/                 npm run cy:open
└── consolidado/allure-report   junção de tudo que já rodou
```

`npm test` apaga o resultado anterior daquele modo, roda a suíte e gera o HTML. Se um teste falha, o HTML ainda é gerado e o comando termina com erro, para o pipeline continuar vermelho e a evidência continuar disponível.

---

## ▶️ Como executar e ler o relatório

A sequência da apresentação, na raiz do projeto:

```bash
npm test
node execucoes/relatorio.js headless
```

O primeiro comando roda os três cenários no Electron e gera o HTML em `execucoes/headless/allure-report`. O segundo abre esse relatório no navegador.

Os outros modos usam o mesmo desenho. Troque o comando e, na hora de abrir, o nome do modo:

```bash
npm run test:chrome
node execucoes/relatorio.js chrome

npm run test:headed
node execucoes/relatorio.js headed

npm run cy:open
node execucoes/relatorio.js interativo
```

Para juntar os modos que já rodaram num HTML só:

```bash
npm run allure:report
```

No relatório, a árvore de comportamento mostra épico, funcionalidade e história. Dentro do teste, os passos são os comandos do Cypress. O parâmetro `termo` mostra o que foi pesquisado. Uma falha leva o screenshot que o Cypress já grava.

A página de ambiente mostra o modo e o navegador daquela execução. Isso separa uma falha só no Chrome de uma falha também no Electron.

---

## ⚙️ Pipeline

O GitHub Actions usa `npm test`, que é o modo headless no Electron, no Ubuntu. Ao final, o HTML de `execucoes/headless/allure-report` sobe como artefato `allure-report`, tenha a suíte passado ou falhado. Screenshots e vídeo do Cypress sobem no artefato `cypress-evidencias` quando a execução falha.

O workflow está em [`.github/workflows/cypress.yml`](../.github/workflows/cypress.yml).

---

## 🚫 O que fica de fora

O Allure não muda a regra dos cenários. Sugestão ao digitar, busca vazia e header mobile continuam fora da suíte, pelo mesmo motivo da [análise](analise-e-estrategia.md). O relatório só torna visível o que a suíte já cobre.
