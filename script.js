function setSpoiler(level) {
  localStorage.setItem("spoilerLevel", level);
  applySpoilers();
}

function applySpoilers() {
  const level = localStorage.getItem("spoilerLevel") || "none";

  const order = ["none","book1","book2","book3"];

  document.querySelectorAll("[data-spoiler]").forEach(el => {
    const required = el.dataset.spoiler;

    if (order.indexOf(level) >= order.indexOf(required)) {
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  });
}

document.addEventListener("DOMContentLoaded", applySpoilers);


const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".fade").forEach(el => observer.observe(el));