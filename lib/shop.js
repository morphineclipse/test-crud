export const PROMOS = { QA10: 10, QA20: 20 };

export function applyPromo(total, code) {
  const pct = PROMOS[(code || "").toUpperCase()] || 0;
  return { pct, total: Math.round(total * (1 - pct / 100)) };
}

export function cartFromStorage() {
  try {
    return JSON.parse(localStorage.getItem("crud_cart") || "[]");
  } catch {
    return [];
  }
}

export function cartSave(items) {
  localStorage.setItem("crud_cart", JSON.stringify(items));
}
