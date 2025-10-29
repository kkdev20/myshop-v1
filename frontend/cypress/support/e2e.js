import 'cypress-mochawesome-reporter/register';

import './commands'

Cypress.on('fail', (error, runnable) => {
  console.error('💥 TEST FAILED:', runnable.title)
  console.error(error.message)
  throw error
})


