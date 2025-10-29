const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    video: false,
    chromeWebSecurity: false,
    reporter: "mochawesome",
    reporterOptions: {
      reportDir: "cypress/reports",
      overwrite: false,
      html: false,
      json: true
    },
    env: {
      apiUrl: "http://127.0.0.1:8000/api",
    },
    setupNodeEvents(on, config) {
      // event plugin bisa dibiarkan kosong
    },
  },
});
