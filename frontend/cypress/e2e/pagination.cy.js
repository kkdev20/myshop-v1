describe('Product Pagination', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/products*').as('getProducts')
    cy.visit('/')
    cy.wait('@getProducts')
  })

  // ✅ Pastikan pagination info & tombol halaman muncul
  it('should render pagination info and page buttons', () => {
    cy.get('[data-cy="pagination-info"]').should('exist')
    cy.get('[data-cy^="page-"]').should('have.length.greaterThan', 0)
  })

  // ✅ Klik page number update URL (dengan stabilitas tambahan)
  it('should update URL when clicking a page number', () => {
    // klik page 2
    cy.get('[data-cy="page-2"]').should('be.visible').click({ force: true })
    cy.wait('@getProducts')
    cy.url().should('include', 'page=2')

    // tunggu render selesai sebelum klik balik page 1
    cy.get('[data-cy="page-1"]').should('be.visible').click({ force: true })
    cy.wait('@getProducts')
    cy.url().should('include', 'page=1')
  })

  // ✅ Pagination disembunyikan kalau cuma 1 halaman
  it('should hide pagination when only one page', () => {
    cy.visit('/?total=10&per_page=20') // total < perPage = cuma 1 halaman
    cy.wait('@getProducts')
    cy.get('[data-cy="pagination-info"]').should('not.exist')
    cy.get('[data-cy^="page-"]').should('not.exist')
  })
})
