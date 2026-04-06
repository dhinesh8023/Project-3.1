function renderCartPage() {
  const root = document.getElementById("cart-root");
  const actions = document.getElementById("cart-actions");
  if (!root || !actions) return;

  const cart = getCart();

  if (cart.length === 0) {
    actions.hidden = true;
    root.innerHTML = `
      <div class="empty-state">
        <p>Your cart is empty.</p>
        <p style="margin-top:1rem"><a class="btn btn--primary" href="index.html">Browse decorations</a></p>
      </div>
    `;
    return;
  }

  actions.hidden = false;

  const rows = cart
    .map(
      (item) => `
    <tr data-id="${escapeAttr(item.id)}">
      <td>
        <img class="cart-item-thumb" src="${escapeAttr(item.image)}" alt="" width="56" height="56" />
      </td>
      <td>${escapeHtml(item.name)}</td>
      <td>${formatRupee(item.price)}</td>
      <td>
        <div class="qty-control">
          <button type="button" class="btn btn--ghost qty-minus" data-id="${escapeAttr(item.id)}" aria-label="Decrease quantity">−</button>
          <input type="number" min="1" class="qty-input" data-id="${escapeAttr(item.id)}" value="${item.quantity}" />
          <button type="button" class="btn btn--ghost qty-plus" data-id="${escapeAttr(item.id)}" aria-label="Increase quantity">+</button>
        </div>
      </td>
      <td class="line-total">${formatRupee(item.price * item.quantity)}</td>
      <td>
        <button type="button" class="btn btn--danger btn-remove" data-id="${escapeAttr(item.id)}">Remove</button>
      </td>
    </tr>
  `
    )
    .join("");

  root.innerHTML = `
    <div class="cart-table-wrap">
      <table class="cart-table">
        <thead>
          <tr>
            <th></th>
            <th>Item</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div class="cart-summary">
      <span>Total</span>
      <span class="cart-summary__total" id="cart-grand-total">${formatRupee(getCartGrandTotal())}</span>
    </div>
    <div class="monthly-panel" aria-labelledby="monthly-heading">
      <p id="monthly-heading" style="margin:0 0 0.5rem;font-size:0.95rem;font-weight:600;color:var(--pink-900)">
        Monthly expenditure planner
      </p>
      <label for="budget-months">Months until wedding (spread this budget)</label>
      <input type="number" id="budget-months" min="1" max="120" step="1" value="${getBudgetMonths()}" />
      <p class="monthly-exp">
        Estimated monthly expenditure:
        <strong id="monthly-exp-value">${formatRupee(getMonthlyExpenditure(getCartGrandTotal(), getBudgetMonths()))}</strong>
      </p>
    </div>
  `;

  wireMonthlyPlanner(root);

  root.querySelectorAll(".qty-minus").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const cartNow = getCart();
      const item = cartNow.find((i) => i.id === id);
      if (!item) return;
      updateQuantity(id, item.quantity - 1);
      renderCartPage();
    });
  });

  root.querySelectorAll(".qty-plus").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const cartNow = getCart();
      const item = cartNow.find((i) => i.id === id);
      if (!item) return;
      updateQuantity(id, item.quantity + 1);
      renderCartPage();
    });
  });

  root.querySelectorAll(".qty-input").forEach((input) => {
    input.addEventListener("change", () => {
      const id = input.getAttribute("data-id");
      updateQuantity(id, input.value);
      renderCartPage();
    });
  });

  root.querySelectorAll(".btn-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      removeFromCart(btn.getAttribute("data-id"));
      renderCartPage();
    });
  });
}

function wireMonthlyPlanner(root) {
  const input = root.querySelector("#budget-months");
  const out = root.querySelector("#monthly-exp-value");
  if (!input || !out) return;

  function refresh() {
    const months = setBudgetMonths(input.value);
    input.value = String(months);
    const total = getCartGrandTotal();
    out.textContent = formatRupee(getMonthlyExpenditure(total, months));
  }

  input.addEventListener("input", refresh);
  input.addEventListener("change", refresh);
}

function escapeHtml(s) {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

document.addEventListener("DOMContentLoaded", renderCartPage);
