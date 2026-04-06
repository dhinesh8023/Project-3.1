const PRODUCTS = [
  {
    id: "dec-1",
    name: "Floral arch entrance",
    price: 15000,
    image: "https://picsum.photos/seed/wedarch/400/300",
  },
  {
    id: "dec-2",
    name: "Mandap drapes & florals",
    price: 22000,
    image: "https://picsum.photos/seed/wedmandap/400/300",
  },
  {
    id: "dec-3",
    name: "Stage backdrop with lights",
    price: 18000,
    image: "https://picsum.photos/seed/wedstage/400/300",
  },
  {
    id: "dec-4",
    name: "Table centerpiece set (10 tables)",
    price: 4500,
    image: "https://picsum.photos/seed/wedcenter/400/300",
  },
  {
    id: "dec-5",
    name: "Grand entry gate décor",
    price: 12000,
    image: "https://picsum.photos/seed/wedgate/400/300",
  },
  {
    id: "dec-6",
    name: "Photo booth floral frame",
    price: 8000,
    image: "https://picsum.photos/seed/wedbooth/400/300",
  },
  {
    id: "dec-7",
    name: "String lights package",
    price: 6000,
    image: "https://picsum.photos/seed/wedlights/400/300",
  },
  {
    id: "dec-8",
    name: "Aisle runner with petals",
    price: 9500,
    image: "https://picsum.photos/seed/wedaisle/400/300",
  },
  {
    id: "dec-9",
    name: "Chair sashes & bows (50)",
    price: 3500,
    image: "https://picsum.photos/seed/wedchairs/400/300",
  },
  {
    id: "dec-10",
    name: "Cake table styling",
    price: 5000,
    image: "https://picsum.photos/seed/wedcake/400/300",
  },
];

const FEATURED_TESTIMONIALS = [
  {
    name: "Ananya & Rohan",
    message:
      "Bloom & Vows transformed our venue into a fairy tale. The mandap and florals were beyond what we imagined — guests are still talking about it.",
    date: "March 2025",
  },
  {
    name: "Priya & Vikram",
    message:
      "Professional, warm, and detail-obsessed. They handled everything on the day so we could actually enjoy our wedding.",
    date: "January 2025",
  },
  {
    name: "Meera & Arjun",
    message:
      "The lighting and stage design matched our mood board perfectly. Great value and clear communication from start to finish.",
    date: "November 2024",
  },
  {
    name: "Sneha & Karthik",
    message:
      "We had a tight timeline and they delivered. Eco-friendly options were important to us and they made it beautiful.",
    date: "September 2024",
  },
];

let _deletedFeatured = JSON.parse(localStorage.getItem("deletedFeatured") || "[]");
let _adminMode = false;
let _adminClickCount = 0;

function renderTestimonials() {
  const root = document.getElementById("testimonials-list");
  if (!root) return;

  const submitted = getSubmittedFeedback();
  const cards = [];

  FEATURED_TESTIMONIALS.forEach((t, i) => {
    if (!_deletedFeatured.includes(i)) cards.push({ ...t, kind: "featured", featuredIdx: i });
  });

  submitted.forEach((t, i) => {
    cards.push({
      name: t.name,
      message: t.message,
      date: formatFeedbackDate(t.at),
      kind: "submitted",
      submittedIdx: i,
    });
  });

  root.innerHTML = cards
    .map((t) => {
      const isFeatured = t.kind === "featured";
      const showDelete = isFeatured ? _adminMode : true;
      const deleteBtn = showDelete
        ? `<button type="button" class="btn btn--danger btn--delete-feedback" data-kind="${escapeAttr(t.kind)}" data-idx="${isFeatured ? t.featuredIdx : t.submittedIdx}" title="Delete">🗑 Delete</button>`
        : "";
      return `
    <blockquote class="testimonial-card" data-kind="${escapeAttr(t.kind)}">
      <p class="testimonial-card__quote">${escapeHtml(t.message)}</p>
      <footer class="testimonial-card__footer">
        <cite class="testimonial-card__name">${escapeHtml(t.name)}</cite>
        <span class="testimonial-card__date">${escapeHtml(t.date || "")}</span>
        ${deleteBtn}
      </footer>
    </blockquote>`;
    })
    .join("");

  root.querySelectorAll(".btn--delete-feedback").forEach((btn) => {
    btn.addEventListener("click", () => {
      const kind = btn.dataset.kind;
      const idx = parseInt(btn.dataset.idx, 10);
      if (kind === "submitted") {
        deleteSubmittedFeedback(idx);
      } else {
        _deletedFeatured.push(idx);
        localStorage.setItem("deletedFeatured", JSON.stringify(_deletedFeatured));
      }
      renderTestimonials();
    });
  });
}

function formatFeedbackDate(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

function escapeAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function renderCatalog() {
  const root = document.getElementById("catalog");
  if (!root) return;

  root.innerHTML = PRODUCTS.map(
    (p) => `
    <article class="card" data-id="${p.id}">
      <img src="${p.image}" alt="" width="400" height="300" loading="lazy" />
      <div class="card__body">
        <h3 class="card__title">${escapeHtml(p.name)}</h3>
        <p class="card__price">${formatRupee(p.price)}</p>
        <button type="button" class="btn btn--primary btn--block add-to-cart" data-id="${p.id}">
          Add to cart
        </button>
      </div>
    </article>
  `
  ).join("");

  root.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const product = PRODUCTS.find((x) => x.id === id);
      if (!product) return;
      addToCart(product);
      btn.textContent = "Added ✓";
      setTimeout(() => {
        btn.textContent = "Add to cart";
      }, 1200);
    });
  });
}

function escapeHtml(s) {
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", () => {
  renderTestimonials();
  renderCatalog();

  const heading = document.getElementById("testimonials-heading");
  if (heading) {
    heading.style.cursor = "pointer";
    heading.title = "Click 5 times to toggle admin mode";
    heading.addEventListener("click", () => {
      _adminClickCount++;
      if (_adminClickCount >= 5) {
        _adminClickCount = 0;
        _adminMode = !_adminMode;
        heading.textContent = _adminMode
          ? "What our couples say 🔒 Admin"
          : "What our couples say";
        renderTestimonials();
      }
    });
  }
});
