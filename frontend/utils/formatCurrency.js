export function formatCurrency(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return ''
  // IDR typically has no decimal fraction in display
  return n.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
}

export default formatCurrency
