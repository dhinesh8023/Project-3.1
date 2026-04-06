/**
 * Cart CRUD — localStorage key: weddingPlannerCart
 * Item: { id, name, price, image, quantity }
 */
const CART_KEY = "weddingPlannerCart";
const BUDGET_MONTHS_KEY = "weddingPlannerBudgetMonths";

function getBudgetMonths() {
  const raw = localStorage.getItem(BUDGET_MONTHS_KEY);
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n >= 1 ? n : 12;
}

function setBudgetMonths(value) {
  let m = Math.floor(Number(value));
  if (!Number.isFinite(m) || m < 1) m = 12;
  if (m > 120) m = 120;
  localStorage.setItem(BUDGET_MONTHS_KEY, String(m));
  return m;
}

/** Spread cart total over months — estimated monthly expenditure for planning */
function getMonthlyExpenditure(total, months) {
  let m = Math.floor(Number(months));
  if (!Number.isFinite(m) || m < 1) m = getBudgetMonths();
  m = Math.max(1, m);
  return Math.round(total / m);
}

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function addToCart(product) {
  const { id, name, price, image } = product;
  const cart = getCart();
  const idx = cart.findIndex((item) => item.id === id);
  if (idx >= 0) {
    cart[idx].quantity += 1;
  } else {
    cart.push({ id, name, price, image, quantity: 1 });
  }
  setCart(cart);
  return cart;
}

function updateQuantity(id, quantity) {
  const qty = Math.max(0, Math.floor(Number(quantity)) || 0);
  let cart = getCart();
  if (qty === 0) {
    cart = cart.filter((item) => item.id !== id);
  } else {
    const item = cart.find((i) => i.id === id);
    if (item) item.quantity = qty;
  }
  setCart(cart);
  return cart;
}

function removeFromCart(id) {
  const cart = getCart().filter((item) => item.id !== id);
  setCart(cart);
  return cart;
}

function getCartLineTotal(item) {
  return item.price * item.quantity;
}

function getCartGrandTotal() {
  return getCart().reduce((sum, item) => sum + getCartLineTotal(item), 0);
}

function formatRupee(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function isCartEmpty() {
  return getCart().length === 0;
}
