// ============================================
// 🧠 Custom Commands untuk MyShop E2E Testing
// ============================================

// 🛒 CART MANAGEMENT
Cypress.Commands.add('addProductToCart', (index = 0) => {
  cy.get('[data-cy=add-to-cart]').eq(index).click()
})

Cypress.Commands.add('removeFromCart', (index = 0) => {
  cy.get('[data-cy=remove-item]').eq(index).click()
})

Cypress.Commands.add('updateCartQuantity', (index = 0, qty) => {
  cy.get('[data-cy=product-quantity]').eq(index).clear().type(qty)
})

// 🧾 CART ASSERTIONS
Cypress.Commands.add('assertCartCount', (expectedCount) => {
  cy.get('[data-cy=cart-count]').should('have.text', expectedCount.toString())
})

Cypress.Commands.add('assertCartTotal', (expectedTotal) => {
  cy.get('[data-cy=cart-total]').invoke('text').then((text) => {
    const normalize = (v) => parseInt(String(v).replace(/[^0-9]/g, '') || '0', 10)
    const displayed = normalize(text)
    const expected = normalize(expectedTotal)
    expect(displayed).to.be.closeTo(expected, expected * 0.01) // toleransi 1%
  })
})

// 🧾 CHECKOUT FORM
Cypress.Commands.add('fillCheckoutForm', (data) => {
  cy.get('[data-cy=checkout-name]').clear().type(data.name)
  cy.get('[data-cy=checkout-phone]').clear().type(data.phone)
  cy.get('[data-cy=checkout-address]').clear().type(data.address)
})

// 🧭 NAVIGATION
Cypress.Commands.add('goToCart', () => {
  cy.get('[data-cy=cart-link]').click()
})

Cypress.Commands.add('goToCheckout', () => {
  cy.get('[data-cy=checkout-button]').click()
})

// 🧹 STATE MANAGEMENT
Cypress.Commands.add('clearCart', () => {
  cy.window().then(win => win.localStorage.clear())
})

// 🧾 PRODUCT ASSERTIONS
Cypress.Commands.add('assertProductDetails', (product, index = 0) => {
  cy.get('[data-cy=product-item]').eq(index).within(() => {
    cy.get('[data-cy=product-name]').should('contain', product.name)
    cy.get('[data-cy=product-price]').should('be.visible')
    if (product.image) {
      cy.get('[data-cy=product-image]')
        .should('have.attr', 'src')
        .and('include', product.image)
    }
  })
})
