describe('Shopping Cart', () => {
  beforeEach(() => {
    cy.visit('/')
    // Clear cart if needed
    cy.window().then((win) => {
      win.localStorage.removeItem('cart')
    })
  })

  it('should add items to cart', () => {
    // Add first product to cart
    cy.get('[data-cy="add-to-cart"]').first().click()
    
    // Verify toast notification (using our custom toast)
    cy.get('[aria-live="polite"]').find('div[class*="bg-green-600"]').should('be.visible')
    
    // Verify cart counter
    // Wait for counter to update and be visible
    cy.get('[data-cy="cart-count"]')
      .should('be.visible')
      .and(($counter) => {
        const count = parseInt($counter.text())
        expect(count).to.equal(1)
      })
  })

  it('should show items in cart page', () => {
    // Add product to cart
    cy.get('[data-cy="add-to-cart"]').first().click()
    
    // Go to cart page
    cy.get('[data-cy="cart-link"]').click()
    
    // Verify cart items
    cy.get('[data-cy="cart-item"]').should('have.length', 1)
    cy.get('[data-cy="cart-total"]').should('be.visible')
  })

  it('should update cart quantities', () => {
    // Add product and go to cart
    cy.get('[data-cy="add-to-cart"]').first().click()
    cy.get('[data-cy="cart-link"]').click()
    
    // Update quantity: scope to the first cart item and select-all then type to replace value
    cy.get('[data-cy="cart-item"]').first().within(() => {
      cy.get('[data-cy="product-quantity"]')
        .click()
        .type('{selectAll}2')
        .should('have.value', '2')
        .then($input => {
          // trigger framework listeners
          cy.wrap($input).trigger('input')
          cy.wrap($input).trigger('change')
        })
    })

    // Don't depend on timing of localStorage writes; verify via UI total update instead
    // Verify total updated and correct: get product price then wait for cart total to match price*2
    cy.get('[data-cy="product-price"]').first().invoke('text').then((priceText) => {
      const price = parseInt(priceText.replace(/[^0-9]/g, ''))
      cy.get('[data-cy="cart-total"]').should('be.visible').invoke('text').should((text) => {
        const total = parseInt(text.replace(/[^0-9]/g, ''))
        expect(total).to.equal(price * 2)
      })
    })
  })

  it('should remove items from cart', () => {
    // Add product and go to cart
    cy.get('[data-cy="add-to-cart"]').first().click()
    cy.get('[data-cy="cart-link"]').click()
    
    // Click remove button
    cy.get('[data-cy="remove-item"]').first().click()
    
    // Verify item removed
    cy.get('[data-cy="cart-item"]').should('have.length', 0)
    
    // Verify item removed from DOM
    cy.get('[data-cy="cart-item"]').should('have.length', 0)

    // Debug: print cart localStorage after remove (helps diagnose race conditions)
    cy.window().its('localStorage').invoke('getItem', 'cart').then(v => {
      cy.log('cart localStorage after remove:', v)
      // also print to browser console for interactive runs
      // eslint-disable-next-line no-console
      console.log('cart localStorage after remove:', v)
    })

    // Ground-truth: localStorage cart should be empty
    cy.window().its('localStorage').invoke('getItem', 'cart')
      .then(cart => {
        const items = JSON.parse(cart || '[]')
        expect(items).to.have.length(0)
      })

    // Tolerant assertion for cart count badge: accept either removed OR present-but-zero/hidden
    cy.get('body').then($body => {
      const $count = $body.find('[data-cy="cart-count"]')
      if ($count.length === 0) {
        cy.log('cart-count removed from DOM')
      } else {
        // element exists — verify it's either hidden or shows '0' / empty
        cy.wrap($count).then($el => {
          const txt = $el.text().trim()
          const visible = $el.is(':visible')
          if (visible) {
            expect(['', '0']).to.include(txt)
          } else {
            // hidden is acceptable
            expect(true).to.equal(true)
          }
        })
      }
    })
  })
})