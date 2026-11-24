// Quantities arrive as decimal strings such as "2.00"; drop trailing zeros.
export default function formatQuantity(value) {
  return String(Number(value));
}
