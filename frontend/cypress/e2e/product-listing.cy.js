// cypress/e2e/product-listing.cy.js

describe('Product Listing', () => {

  beforeEach(() => {
    // Buka halaman utama sebelum setiap test
    cy.visit('/')
  })

  it('should load product listing page', () => {
    // Pastikan grid produk tampil
    cy.get('[data-cy="product-grid"]').should('be.visible')
  })

  it('should display products correctly', () => {
    // Harus ada minimal 1 produk
    cy.get('[data-cy="product-item"]').should('have.length.at.least', 1)
    
    // Cek elemen penting di produk pertama
    cy.get('[data-cy="product-item"]').first().within(() => {
      cy.get('[data-cy="product-name"]').should('be.visible')
      cy.get('[data-cy="product-category"]').should('be.visible')
      cy.get('[data-cy="product-price"]').should('be.visible')
      cy.get('[data-cy="product-stock"]').should('be.visible')
      cy.get('[data-cy="add-to-cart"]').should('be.visible')
    })
  })

  it('should display product images', () => {
    // Cek bahwa ada gambar dan punya atribut src valid
    cy.get('[data-cy="product-image"]')
      .should('be.visible')
      .and('have.attr', 'src')
      .and('match', /^https?:\/\//)
  })

  it('should format prices in IDR', () => {
    // Cek format harga — fleksibel ke Rp12.000 atau Rp 12,000
    cy.get('[data-cy="product-price"]').first()
      .invoke('text') // ambil teks harga
      .then((text) => {
        expect(text).to.include('Rp') // wajib ada awalan Rp
        expect(text.trim()).to.match(/Rp\s*\d{1,3}([.,]\d{3})*/) // cocok format ribuan (titik/koma)
      })
  })

  it('should have working add to cart buttons', () => {
    // Tombol add to cart harus aktif dan teksnya benar
    cy.get('[data-cy="add-to-cart"]').first()
      .should('be.visible')
      .and('not.be.disabled')
      .and('have.text', 'Add to cart')
  })
})
