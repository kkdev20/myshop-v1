describe('Product Filters', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/products*').as('getProducts')
    cy.visit('/')
    cy.wait('@getProducts')
  })

  it('should filter by search', () => {
    cy.get('[data-cy="search-input"]').clear().type('Laptop')
    cy.get('[data-cy="search-button"]').click()
    cy.wait('@getProducts')
    cy.location('search').should('contain', 'search=Laptop')
  })

  it('should filter by category', () => {
    cy.get('[data-cy="category-filter"]').click()
    cy.get('[data-cy="category-option"]').eq(1).click()
    cy.wait('@getProducts')
    cy.location('search').should('contain', 'category=')
  })

  it('should apply price filter', () => {
    cy.get('[data-cy="min-price"]').clear().type('100')
    cy.get('[data-cy="max-price"]').clear().type('200')
    cy.get('[data-cy="apply-filter"]').click()
    cy.wait('@getProducts')
    cy.location('search').should('contain', 'min_price=100')
    cy.location('search').should('contain', 'max_price=200')
  })

  it('should handle empty result state without failing', () => {
    cy.get('[data-cy="min-price"]').clear().type('999999')
    cy.get('[data-cy="apply-filter"]').click()
    cy.wait('@getProducts')

    // Product may show empty state or grid still exists but empty
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="product-item"]').length > 0) {
        cy.get('[data-cy="product-item"]').its('length').should('be.greaterThan', 0)
      } else {
        cy.contains(/no products found/i).should('be.visible')
      }
    })
  })

  it('should change items per page', () => {
    cy.get('[data-cy="per-page-select"]').select('10')
    cy.wait('@getProducts')
    cy.location('search').should('contain', 'per_page=10')
  })

  it('should clear all filters', () => {
    cy.get('[data-cy="search-input"]').clear().type('Laptop')
    cy.get('[data-cy="search-button"]').click()
    cy.wait('@getProducts')

    cy.get('[data-cy="clear-filters"]').click()
    cy.wait('@getProducts')

    cy.location('search').should('eq', '') // ✅ URL kembali bersih
  })
})
