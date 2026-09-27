# 🧪 Modos de execução

Esta pasta é o roteiro de quem vai apresentar a suíte rodando.

Cada modo tem:

- 💻 um comando;
- 📁 uma pasta de evidência;
- 📊 um HTML do Allure.

Os comandos são os mesmos no Windows, no macOS e no Linux. Abra o terminal na **raiz do projeto**, depois de `npm install`.

O Cypress confere o próprio binário antes de começar. Se ele estiver ausente ou incompleto, o script reinstala com `cypress install --force` e só então roda os testes.

> ⏳ Na primeira vez, a reinstalação usa a internet e pode levar alguns minutos.

---

## 📋 O que cada comando faz

| 💻 Comando | 📁 Modo | 🌐 Navegador | 🎯 O que a apresentação mostra |
| --- | --- | --- | --- |
| `npm test` | `headless` | Electron, sem janela | ⭐ Comando padrão e o do GitHub Actions |
| `npm run test:chrome` | `chrome` | Chrome instalado na máquina, sem janela | 🌐 A mesma suíte em outro navegador |
| `npm run test:headed` | `headed` | Electron, com a janela visível | 👀 A lupa abrindo, o termo sendo digitado e o resultado |
| `npm run cy:open` | `interativo` | Cypress interativo | 🧪 Um cenário isolado, com pausa |
| `npm run allure:report` | `consolidado` | Não roda teste | 📚 Junta o que já foi executado e abre o HTML |

Cada modo apaga só o próprio `allure-results` antes de rodar. O HTML dos outros modos permanece.

---

## 1️⃣ ⚡ Headless, o modo da apresentação

```bash
npm test
```

Esse comando é `node execucoes/headless.js`.

Ele:

- 🧪 roda os três cenários no Electron, sem abrir janela;
- 📁 grava o bruto em `execucoes/headless/allure-results`;
- 📊 gera o HTML em `execucoes/headless/allure-report`.

O terminal precisa listar os três cenários como aprovados:

```text
✓ encontra artigos quando o termo existe no blog
✓ informa que não há artigos quando o termo não existe
✓ abre a busca pela lupa e permite sair sem pesquisar
```

Para abrir o Allure dessa execução:

```bash
node execucoes/relatorio.js headless
```

O navegador abre o relatório **Pesquisa de artigos — headless**. Mostre nesta ordem:

1. 📊 O resumo com os três testes aprovados.
2. 🌳 A árvore de comportamento: épico **Blog do Agi**, funcionalidade **Pesquisa de artigos** e as histórias **Termo existente**, **Termo inexistente** e **Abrir e sair da lupa**.
3. 🔎 O teste do termo `cartão`: o parâmetro `termo` e os passos até a lista de artigos.
4. 🚫 O teste do termo inexistente: a mesma jornada até a mensagem de ausência.
5. 🖥️ O ambiente: modo `headless`, navegador `electron` e o endereço do blog.

---

## 2️⃣ 🌐 Chrome

O Chrome precisa estar instalado na máquina.

```bash
npm run test:chrome
```

| Pasta | Conteúdo |
| --- | --- |
| `execucoes/chrome/allure-results` | Resultado bruto |
| `execucoes/chrome/allure-report` | HTML |

```bash
node execucoes/relatorio.js chrome
```

No ambiente do relatório, o navegador aparece como `chrome`. Use isso para separar uma falha só no Chrome de uma falha também no Electron.

---

## 3️⃣ 👀 Janela visível

```bash
npm run test:headed
```

O Electron abre a janela e a suíte inteira roda sozinha. É o modo para acompanhar a lupa, a digitação e a página de resultados.

| Pasta | Conteúdo |
| --- | --- |
| `execucoes/headed/allure-results` | Resultado bruto |
| `execucoes/headed/allure-report` | HTML |

```bash
node execucoes/relatorio.js headed
```

---

## 4️⃣ 🧪 Cypress interativo

```bash
npm run cy:open
```

Abre o Cypress para escolher o spec `cypress/e2e/busca/pesquisa-de-artigos.cy.js` e rodar um cenário com pausa. O Allure só é gerado quando essa janela fecha.

| Pasta | Conteúdo |
| --- | --- |
| `execucoes/interativo/allure-results` | Resultado bruto |
| `execucoes/interativo/allure-report` | HTML |

```bash
node execucoes/relatorio.js interativo
```

---

## 5️⃣ 📚 Relatório consolidado

Depois de rodar um ou mais modos, este comando **não executa teste**. Ele junta os `allure-results` que já existem e abre um HTML só.

```bash
npm run allure:report
```

O arquivo fica em `execucoes/consolidado/allure-report`. O nome no Allure é **Pesquisa de artigos — consolidado**.

Se nenhum modo tiver sido executado, o comando avisa:

```text
Nenhuma execução encontrada. Rode npm test antes de abrir o relatório.
```

---

## 🎯 Um spec só

Para isolar a pesquisa sem passar pelos scripts desta pasta:

```bash
npx cypress run --spec cypress/e2e/busca/pesquisa-de-artigos.cy.js
```

Esse atalho usa a pasta padrão `allure-results` na raiz. Ele não grava em `execucoes/headless`. Para a apresentação com pasta por modo, use `npm test`.

---

## 🗂️ Onde cada arquivo fica

```text
execucoes/
├── headless.js          npm test
├── chrome.js            npm run test:chrome
├── headed.js            npm run test:headed
├── interativo.js        npm run cy:open
├── relatorio.js         abre ou consolida o HTML
├── lib/cypress.js       binário, execução e geração do Allure
├── headless/
│   ├── allure-results   bruto do npm test
│   └── allure-report    HTML desse modo
├── chrome/              mesmo par de pastas
├── headed/
├── interativo/
└── consolidado/
    └── allure-report    junção dos modos já rodados
```

As pastas `allure-results` e `allure-report` nascem na hora da execução e **não entram no Git**.

---

## 📸 Quando um teste falha

- 📸 o Cypress grava a tela em `cypress/screenshots/`;
- 📊 o Allure anexa esse passo ao HTML daquele modo;
- ⚙️ o comando termina com erro, para o pipeline continuar vermelho e a evidência continuar disponível.

Se os testes não gravarem nenhum `*-result.json`, o script recusa o HTML e imprime:

```text
Os testes não geraram resultado. O relatório Allure não foi criado.
```
