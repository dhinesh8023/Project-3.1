function renderOrderSummary() {
  const list = document.getElementById("order-summary-list");
  const totalEl = document.getElementById("order-summary-total");
  if (!list || !totalEl) return;

  const cart = getCart();
  if (cart.length === 0) {
    window.location.href = "cart.html";
    return;
  }

  list.innerHTML = cart
    .map(
      (item) => `
    <li>
      <span>${escapeHtml(item.name)} × ${item.quantity}</span>
      <span>${formatRupee(item.price * item.quantity)}</span>
    </li>
  `
    )
    .join("");
  const total = getCartGrandTotal();
  totalEl.textContent = `Total: ${formatRupee(total)}`;

  const monthlyLine = document.getElementById("order-monthly-line");
  if (monthlyLine) {
    const months = getBudgetMonths();
    const perMonth = getMonthlyExpenditure(total, months);
    monthlyLine.innerHTML = `Planning over <strong>${months}</strong> month${months === 1 ? "" : "s"} — estimated monthly expenditure: <strong>${formatRupee(perMonth)}</strong>`;
  }
}

function escapeHtml(s) {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

function setupPaymentToggle() {
  const gpay = document.getElementById("pay-gpay");
  const cash = document.getElementById("pay-cash");
  const qrBlock = document.getElementById("qr-block");
  const cashNote = document.getElementById("cash-note");
  if (!gpay || !cash || !qrBlock || !cashNote) return;

  function sync() {
    if (gpay.checked) {
      qrBlock.classList.remove("is-hidden");
      cashNote.classList.add("is-hidden");
    } else if (cash.checked) {
      qrBlock.classList.add("is-hidden");
      cashNote.classList.remove("is-hidden");
    } else {
      qrBlock.classList.add("is-hidden");
      cashNote.classList.add("is-hidden");
    }
  }

  gpay.addEventListener("change", sync);
  cash.addEventListener("change", sync);
  sync();
}

function setupForm() {
  const form = document.getElementById("order-form");
  const modal = document.getElementById("thank-modal");
  const closeBtn = document.getElementById("thank-close");
  if (!form || !modal || !closeBtn) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("cust-name");
    const phone = document.getElementById("cust-phone");
    const email = document.getElementById("cust-email");
    const address = document.getElementById("cust-address");
    const paymentGpay = document.getElementById("pay-gpay");
    const paymentCash = document.getElementById("pay-cash");

    if (!name.value.trim() || !phone.value.trim() || !email.value.trim() || !address.value.trim()) {
      form.reportValidity();
      return;
    }

    if (!paymentGpay.checked && !paymentCash.checked) {
      alert("Please choose a payment method: G-pay or Cash.");
      return;
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  });

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    localStorage.removeItem("weddingPlannerCart");
    window.location.href = "index.html";
  }

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderOrderSummary();
  setupPaymentToggle();
  setupForm();
});
