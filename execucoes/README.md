# Modos de execução

Cada modo grava o Allure em uma pasta própria e, ao terminar, gera o HTML.

| Comando | Modo | O que acontece |
| --- | --- | --- |
| `npm test` | `execucoes/headless` | Cypress headless no Electron. É o comando do pipeline |
| `npm run test:chrome` | `execucoes/chrome` | Cypress headless no Chrome instalado na máquina |
| `npm run test:headed` | `execucoes/headed` | Electron com a janela visível |
| `npm run cy:open` | `execucoes/interativo` | Cypress interativo. O relatório sai quando a janela fecha |
| `npm run allure:report` | `execucoes/consolidado` | Junta os resultados que já existem e abre o HTML |

Para reabrir só um modo:

```bash
node execucoes/relatorio.js headless
```

Troque `headless` por `chrome`, `headed` ou `interativo`.

As pastas `allure-results` e `allure-report` são geradas na hora e não entram no Git.
