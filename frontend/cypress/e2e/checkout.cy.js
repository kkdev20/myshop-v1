describe('Checkout Flow', () => {
  beforeEach(() => {
    // Reset state dan tambahkan item ke cart
    cy.visit('/')
    cy.get('[data-cy=add-to-cart]').first().click()
    cy.get('[data-cy=cart-link]').click()
    cy.url().should('include', '/cart')
    cy.get('[data-cy=checkout-button]').click()
    cy.url().should('include', '/checkout')
  })

  it('shows checkout form and summary', () => {
    cy.get('h1').contains('Checkout')
    cy.get('[data-cy=checkout-name]').should('be.visible')
    cy.get('[data-cy=checkout-address]').should('be.visible')
    cy.get('[data-cy=checkout-phone]').should('be.visible')
    cy.get('aside').contains('Order Summary')
  })

  it('validates phone number', () => {
    cy.get('[data-cy=checkout-name]').type('Bali Tester')
    cy.get('[data-cy=checkout-address]').type('Jl. Sunset Road No. 123')
    cy.get('[data-cy=checkout-phone]').type('abc123')
    cy.get('[data-cy=submit-order]').click()
    cy.get('[data-cy=phone-error]').should('exist').and('contain', 'Invalid phone number')
  })

  it('submits order successfully (mocked)', () => {
    cy.intercept('POST', '**/orders', {
      statusCode: 200,
      body: { id: 99 },
    }).as('placeOrder')

    cy.get('[data-cy=checkout-name]').type('Bali Tester')
    cy.get('[data-cy=checkout-address]').type('Jl. Sunset Road No. 123')
    cy.get('[data-cy=checkout-phone]').type('08123456789')

    cy.get('[data-cy=submit-order]').click()

    cy.wait('@placeOrder')
    cy.url().should('include', '/thanks')
  })

  it('handles transfer payment and loads bank account (mocked)', () => {
    cy.intercept('GET', '**/settings/bank_account', {
      statusCode: 200,
      body: {
        bank: 'BCA',
        account_number: '1234567890',
        account_name: 'PT MyShop',
      },
    }).as('getBank')

    cy.get('select').select('Transfer')
    cy.wait('@getBank')

    cy.contains('Bank: BCA')
    cy.contains('Account: 1234567890')
    cy.contains('Name: PT MyShop')
  })

  it('shows message when no bank account found', () => {
    cy.intercept('GET', '**/settings/bank_account', {
      statusCode: 404,
      body: {},
    }).as('getBankEmpty')

    cy.get('select').select('Transfer')
    cy.wait('@getBankEmpty')

    cy.contains('No bank account configured')
  })
})
