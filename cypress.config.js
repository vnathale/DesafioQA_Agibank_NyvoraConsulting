const os = require('os')
const { defineConfig } = require('cypress')
const { allureCypress } = require('allure-cypress/reporter')

module.exports = defineConfig({
  video: Boolean(process.env.CI),
  screenshotOnRunFailure: true,
  retries: {
    runMode: 1,
    openMode: 0,
  },
  viewportWidth: 1366,
  viewportHeight: 768,
  defaultCommandTimeout: 20000,
  pageLoadTimeout: 90000,
  requestTimeout: 20000,
  responseTimeout: 30000,
  e2e: {
    baseUrl: 'https://blog.agibank.com.br',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    chromeWebSecurity: true,
    setupNodeEvents(on, config) {
      allureCypress(on, config, {
        resultsDir: process.env.ALLURE_RESULTS_DIR || 'allure-results',
        environmentInfo: {
          sistema: os.platform(),
          sistema_versao: os.release(),
          node: process.version,
          modo: process.env.EXECUCAO_MODO || 'padrao',
          navegador: process.env.EXECUCAO_NAVEGADOR || 'electron',
          blog: 'https://blog.agibank.com.br',
        },
      })

      return config
    },
  },
})
