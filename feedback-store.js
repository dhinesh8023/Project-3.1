const FEEDBACK_STORE_KEY = "weddingPlannerCustomerFeedback";

function getSubmittedFeedback() {
  try {
    const raw = localStorage.getItem(FEEDBACK_STORE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function deleteSubmittedFeedback(index) {
  const list = getSubmittedFeedback();
  list.splice(index, 1);
  localStorage.setItem(FEEDBACK_STORE_KEY, JSON.stringify(list));
}

function appendSubmittedFeedback(entry) {
  const name = String(entry.name || "").trim();
  const message = String(entry.message || "").trim();
  if (!name || !message) return;
  const list = getSubmittedFeedback();
  list.unshift({
    name,
    message,
    at: new Date().toISOString(),
  });
  localStorage.setItem(FEEDBACK_STORE_KEY, JSON.stringify(list.slice(0, 40)));
}
