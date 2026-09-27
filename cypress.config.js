const { defineConfig } = require('cypress')

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
  },
})
