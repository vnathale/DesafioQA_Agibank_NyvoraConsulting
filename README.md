# 🔎 Pesquisa de artigos do Blog do Agi

Suíte **E2E em [Cypress](https://www.cypress.io/)** para a pesquisa de artigos aberta pela lupa do **[Blog do Agi](https://blog.agibank.com.br/)**.

O endereço informado no enunciado, [blogdoagi.com.br](https://blogdoagi.com.br/), redireciona para `https://blog.agibank.com.br/`. A automação utiliza esse host como fonte da jornada.

> 🎯 **Objetivo deste README:** servir como roteiro técnico da apresentação, mostrando o que foi solicitado, a estratégia adotada, a arquitetura da solução e a sequência de comandos para instalar, executar e analisar os resultados no **Allure**.

📚 O detalhamento de risco e escopo está em [`docs/analise-e-estrategia.md`](docs/analise-e-estrategia.md).

📊 O desenho e a estratégia do relatório estão em [`docs/artigo-allure.md`](docs/artigo-allure.md).

---

## 📋 O que foi solicitado

O desafio propõe a automação da **pesquisa de artigos do blog**, iniciada pela lupa localizada no canto superior direito.

| 📌 Pedido | ✅ Como este repositório responde |
| --- | --- |
| Pelo menos dois cenários relevantes | 🧪 Três cenários: termo com artigos, termo sem resultado e abertura da lupa com saída sem pesquisa |
| Linguagem à escolha | 💻 Cypress com JavaScript. O avaliador precisa apenas de Node.js e npm |
| Repositório público no GitHub | 🔗 [DesafioQA_Agibank_NyvoraConsulting](https://github.com/vnathale/DesafioQA_Agibank_NyvoraConsulting) |
| README para configurar e executar | 📖 Este arquivo apresenta toda a sequência de execução |
| Executável em Linux, Windows e macOS | 🖥️ Os mesmos comandos são utilizados nos três sistemas |
| Pipeline | ⚙️ [GitHub Actions](.github/workflows/cypress.yml) e [GitLab CI](.gitlab-ci.yml) executam `npm test` e publicam o HTML do Allure |

---

## 🧠 Visão da solução

A **lupa é o ponto de entrada da jornada**.

O valor para quem utiliza o blog está no que acontece depois:

- 🔎 encontrar artigos relacionados ao termo pesquisado;
- 🚫 entender claramente quando nenhum resultado é encontrado;
- ⌨️ conseguir abrir e fechar a pesquisa sem executar uma busca.

A suíte protege esses contratos e valida o comportamento esperado da funcionalidade.

### 🏗️ Estratégia de automação

A automação foi construída pensando na **jornada do usuário**, e não apenas na interação com elementos da página.

O arquivo de teste não contém seletores CSS diretamente.

A responsabilidade está distribuída entre:

- 🧪 **Specs:** descrevem os cenários de negócio;
- 📄 **Fixtures:** armazenam os termos utilizados na pesquisa;
- 🧭 **Page Objects:** concentram ações e validações da jornada;
- 🎯 **Seletores:** centralizam o contrato com o HTML;
- 📊 **Allure:** registra evidências e contexto da execução.

Essa separação facilita a manutenção e permite alterar a massa de testes sem modificar o fluxo da automação.

### 📊 Evidências com Allure

O **Allure** entra como camada de evidência da execução.

Cada comando relevante do Cypress pode ser apresentado como um passo do teste, enquanto informações como:

- 🏷️ Épico;
- 🧩 Funcionalidade;
- 📖 História;
- 🚨 Severidade;
- 🔎 Termo pesquisado;
- 🌎 Ambiente de execução;

ficam disponíveis no relatório HTML.

O relatório utiliza **Allure 3**, executado em Node.js, sem necessidade de instalação do Java.

---

## 🧪 Cenários apresentados

A suíte contempla **três cenários principais**:

| 🧪 Cenário | 👤 Ação do usuário | ✅ Validação | 🚨 Severidade |
| --- | --- | --- | --- |
| 🔎 **Termo existente** | Pesquisa `cartão` pela lupa | URL `?s=cartão`, título contendo o termo e pelo menos um artigo relacionado | `critical` |
| 🚫 **Termo inexistente** | Pesquisa um termo que não está no blog | URL e título contendo o termo, ausência de artigos e mensagem informando que nada foi encontrado | `critical` |
| ⌨️ **Abrir e sair** | Abre a lupa e pressiona `Escape` | Campo `"Digite sua busca"` aparece e a home retorna sem pesquisa e sem hash | `normal` |

📁 Os termos utilizados ficam em:

[`cypress/fixtures/busca.json`](cypress/fixtures/busca.json)

---

## ⚙️ Pré-requisitos

Antes de executar o projeto, certifique-se de possuir:

- 🟢 **[Node.js](https://nodejs.org/)** 18 ou superior;
- 📦 **npm**, instalado junto com o Node.js;
- 🌐 acesso à internet;
- 🔗 acesso ao `https://blog.agibank.com.br`.

> 📝 O projeto foi exercitado utilizando **Node.js 22**.

### 🌐 Navegadores

O **Chrome é opcional**.

O comando padrão utiliza o **Electron**, navegador que acompanha a instalação do Cypress.

☕ **Java não é necessário.** O Allure 3 utilizado pelo projeto roda em Node.js.

---

# 🚀 Passo a passo

Abra o terminal na pasta onde deseja trabalhar.

Os comandos são os mesmos para:

- 🪟 Windows;
- 🍎 macOS;
- 🐧 Linux.

---

## 1️⃣ Baixar o repositório

```bash
git clone https://github.com/vnathale/DesafioQA_Agibank_NyvoraConsulting.git
cd DesafioQA_Agibank_NyvoraConsulting
```

---

## 2️⃣ Instalar as dependências

```bash
npm install
```

Esse comando:

- 📦 lê o `package-lock.json`;
- 🧪 instala o Cypress;
- 📊 instala as dependências do Allure;
- 🌐 baixa o binário necessário para execução do navegador de teste.

> ⏳ Na primeira execução, o processo utiliza a internet e pode levar alguns minutos.

---

## 3️⃣ Confirmar se o Cypress está pronto

```bash
npx cypress verify
```

A saída esperada deve conter:

```text
Cypress 14.5.4 is installed
```

### 🔧 Caso o executável não seja encontrado

Execute:

```bash
npx cypress install --force
npx cypress verify
```

### 🪟 Windows — caso a reinstalação continue falhando

Remova o cache incompleto e reinstale:

```bash
rmdir /s /q %LOCALAPPDATA%\Cypress\Cache\14.5.4
npx cypress install --force
npx cypress verify
```

---

# 4️⃣ ▶️ Executar os testes

```bash
npm test
```

Esse é o **modo padrão da apresentação** e também o comando utilizado pelo pipeline.

A execução acontece em:

- 🧪 Cypress;
- ⚡ modo headless;
- 🌐 navegador Electron.

Ao finalizar, o HTML do Allure estará disponível em:

```text
execucoes/headless/allure-report
```

### ✅ Critério para seguir com a apresentação

O terminal deve apresentar os **três cenários como aprovados**.

```text
✓ encontra artigos quando o termo existe no blog
✓ informa que não há artigos quando o termo não existe
✓ abre a busca pela lupa e permite sair sem pesquisar
```

---

# 5️⃣ 📊 Abrir o relatório Allure

```bash
node execucoes/relatorio.js headless
```

O navegador abrirá o relatório correspondente à execução.

### 🎤 Ordem sugerida para apresentação

Mostre o relatório nesta sequência:

**1. 📊 Resumo**

Apresente os três testes aprovados.

**2. 🌳 Árvore de comportamento**

Mostre:

> **Épico:** Blog do Agi  
> **Funcionalidade:** Pesquisa de artigos  
> **Histórias:** três cenários automatizados

**3. 🔎 Pesquisa com termo existente**

Mostre:

- parâmetro `termo`;
- abertura da lupa;
- preenchimento da pesquisa;
- execução;
- URL;
- retorno dos artigos.

**4. 🚫 Pesquisa sem resultado**

Mostre a mesma jornada até a mensagem informando que nenhum artigo foi encontrado.

**5. 🖥️ Ambiente**

Apresente:

- modo `headless`;
- navegador `electron`;
- endereço utilizado;
- informações da execução.

---

## 📚 Consolidar todas as execuções no Allure

Para juntar os resultados dos modos já executados:

```bash
npm run allure:report
```

Isso permite consolidar execuções realizadas em:

- ⚡ Headless;
- 🌐 Chrome;
- 👀 Headed.

---

# 🧪 Outros modos de execução

A pasta [`execucoes`](execucoes) separa cada forma de execução.

O detalhamento dos comandos, diretórios de resultados e roteiro de apresentação está disponível em:

[`execucoes/README.md`](execucoes/README.md)

| 💻 Comando | 🎯 Utilização |
| --- | --- |
| `npm test` | ⭐ Demonstração padrão e execução do GitHub Actions |
| `npm run test:chrome` | 🌐 Executar a suíte utilizando o Chrome instalado |
| `npm run test:headed` | 👀 Executar o Electron com a janela visível |
| `npm run cy:open` | 🧪 Abrir o Cypress interativo |
| `node execucoes/relatorio.js headless` | 📊 Reabrir o relatório do `npm test` |
| `npm run allure:report` | 📚 Consolidar os modos já executados |

### 🔄 Reabrir outro relatório

Troque `headless` pelo modo desejado:

```bash
node execucoes/relatorio.js chrome
```

Outras opções:

```text
headless
chrome
headed
interativo
```

---

## 🎯 Executar apenas o spec da pesquisa

Para isolar a execução da funcionalidade:

```bash
npx cypress run --spec cypress/e2e/busca/pesquisa-de-artigos.cy.js
```

---

## 📸 Evidências em caso de falha

Quando um teste falha:

- 📸 o Cypress grava a screenshot em `cypress/screenshots/`;
- 📊 o Allure anexa a evidência correspondente ao relatório;
- 📁 `allure-results` armazena os resultados brutos;
- 📁 `allure-report` armazena o relatório HTML.

Essas pastas são geradas durante a execução e **não são versionadas no Git**.

---

# ⚙️ Pipeline CI/CD

Os dois pipelines executam o mesmo comando:

```bash
npm test
```

Isso é o Cypress headless no Electron, o mesmo modo da apresentação local.

| Pipeline | Arquivo | Quando roda |
| --- | --- | --- |
| GitHub Actions | [`.github/workflows/cypress.yml`](.github/workflows/cypress.yml) | Push, pull request ou disparo manual, no Ubuntu |
| GitLab CI | [`.gitlab-ci.yml`](.gitlab-ci.yml) | Push na branch, merge request ou disparo manual em **Build > Pipelines** |

### 🔧 Ambiente do pipeline

| Item | GitHub Actions | GitLab CI |
| --- | --- | --- |
| 💻 Sistema | Ubuntu | Linux, imagem `cypress/base:22.21.0` |
| 🧪 Framework | Cypress | Cypress |
| 🌐 Navegador | Electron | Electron |
| ⚡ Execução | Headless | Headless |
| 📊 Relatório | Artefato `allure-report` | Artefato `allure-report`, válido por 7 dias |
| 📸 Evidências | Screenshots e vídeo quando a suíte falha | Screenshots, vídeo e HTML, tenha a suíte passado ou falhado |

No GitLab, o HTML fica em `execucoes/headless/allure-report` e pode ser baixado na página do job. O job se chama `pesquisa-de-artigos`.

Para o pipeline existir no GitLab, o repositório precisa estar lá com o arquivo `.gitlab-ci.yml` na branch padrão. Um projeto vazio no GitLab recebe este código com:

```bash
git remote add gitlab https://gitlab.com/<grupo>/<projeto>.git
git push gitlab main
```

---

# 🗂️ Estrutura do projeto

```text
cypress.config.js

cypress/
├── e2e/
│   └── busca/
│       └── pesquisa-de-artigos.cy.js
│           └── cenários na linguagem de quem pesquisa
│
├── fixtures/
│   └── busca.json
│       └── termos pesquisados
│
└── support/
    ├── e2e.js
    │   └── Allure e exceções conhecidas do blog
    │
    ├── commands.js
    │   └── preparação do JavaScript adiado
    │
    ├── seletores.js
    │   └── contrato com o HTML
    │
    └── pages/
        └── ações e validações da jornada

.github/workflows/cypress.yml   pipeline no GitHub Actions
.gitlab-ci.yml                 job pesquisa-de-artigos no GitLab CI

execucoes/
└── scripts por modo de execução

docs/
├── analise-e-estrategia.md
│   └── cenários, riscos e escopo
│
└── artigo-allure.md
    └── estratégia de construção do relatório
```

### 🎯 Manutenção dos seletores

Caso o HTML da página altere algum identificador utilizado pela automação, a manutenção começa em:

```text
cypress/support/seletores.js
```

Essa centralização reduz o impacto de mudanças no front-end sobre os cenários automatizados.

---

# ⚠️ Limitações conhecidas

O detalhamento completo está em:

[`docs/analise-e-estrategia.md`](docs/analise-e-estrategia.md)

### 🖥️ Desktop

A suíte cobre o header desktop em:

```text
1366 × 768
```

O header mobile utiliza outro markup e, portanto, não faz parte deste escopo.

### ⚙️ JavaScript da lupa

O JavaScript responsável pela abertura da lupa chega à página por meio de:

```html
script[data-src]
```

O loader atual não executa esse bundle automaticamente.

Por isso:

```text
cy.prepararBusca()
```

carrega o bundle e reaplica o handler na lupa visível.

Isso ocorre porque o header fixo recria o ícone sem o `onclick` esperado.

### ❌ Fechamento pelo X

O fechamento pelo botão **X** do overlay fica coberto pelo header fixo.

Por isso, o cenário de saída utiliza:

```text
Escape
```

### 🔎 Sugestões durante a digitação

A sugestão automática enquanto o usuário digita ficou fora do escopo.

A funcionalidade depende do evento `load` e exige uma validação específica antes de ser transformada em critério automatizado.

### ⌨️ Pesquisa vazia

A pesquisa com o campo vazio também não foi incluída.

Antes de automatizá-la, é necessário definir uma **regra de produto clara** para estabelecer o comportamento esperado.

> 💡 **Princípio adotado:** não transformar comportamento indefinido em falso critério de teste.

---

# 🏁 Conclusão

A solução foi construída para demonstrar mais do que simplesmente **"clicar na lupa e validar uma URL"**.

A suíte contempla:

```text
🔎 Jornada do usuário
        ↓
🧪 Cenários funcionais
        ↓
🎯 Page Objects + Seletores
        ↓
📊 Evidências Allure
        ↓
⚙️ Execução CI/CD
        ↓
📈 Resultado rastreável
```

O resultado é uma suíte E2E **executável, rastreável e preparada para CI/CD**, com separação entre cenário, massa, ações, seletores e evidências.

---

## 📄 Licença

MIT.

Consulte [`LICENSE`](LICENSE).