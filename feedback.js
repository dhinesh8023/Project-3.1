document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("feedback-form-el");
  const thanks = document.getElementById("feedback-thanks");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("fb-name");
    const message = document.getElementById("fb-message");
    if (!name.value.trim() || !message.value.trim()) {
      form.reportValidity();
      return;
    }
    appendSubmittedFeedback({ name: name.value.trim(), message: message.value.trim() });
    form.style.display = "none";
    if (thanks) thanks.style.display = "block";
  });
});
