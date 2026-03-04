function setSpoiler(level) {
  localStorage.setItem("spoilerLevel", level);
  applySpoilers();
  highlightSpoiler(level);

  const select = document.getElementById("spoilerLevel");
  if (select) select.value = level;
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

function highlightSpoiler(level) {
  document.querySelectorAll(".spoiler-settings button").forEach(btn => {
    btn.classList.remove("active");
  });

  const activeBtn = document.querySelector(
    `.spoiler-settings button[onclick="setSpoiler('${level}')"]`
  );

  if (activeBtn) activeBtn.classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
  const stored = localStorage.getItem("spoilerLevel") || "none";
  if (!localStorage.getItem("spoilerLevel")) localStorage.setItem("spoilerLevel", "none");

  applySpoilers();
  highlightSpoiler(stored);

  const select = document.getElementById("spoilerLevel");
  if (select) {
    select.value = stored;
    select.addEventListener("change", (e) => {
      setSpoiler(e.target.value);
    });
  }
});

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

(() => {
  const hero = document.getElementById("hero");
  if (!hero) return;

  // SPOILER-SAFE landing page rotation
  const images = [
  "images/public/01_alex_kelli_porch.jpg",
  "images/public/02_alex_kelli_hair.jpg",
  "images/public/03_pod_pizza_party.jpg",
  "images/public/04_church_cornfield_earth.jpg",
  "images/public/05_sam_alex_kelli_lila_family_night.jpg",
  "images/public/06_sam_alex_running_recruites.jpg",
];

  const FADE_MS = 1200;   // match CSS transition
  const HOLD_MS = 10000;  // how long each stays visible (10s feels cinematic)

  let idx = 0;

  // Preload to prevent flicker
  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  // Set initial image
  hero.style.setProperty("--hero-img", `url("${images[idx]}")`);

  function next() {
  hero.style.setProperty("--hero-opacity", "0");

  setTimeout(() => {
    idx = (idx + 1) % images.length;
    hero.style.setProperty("--hero-img", `url("${images[idx]}")`);
    hero.style.setProperty("--hero-opacity", "1");
  }, FADE_MS);
}

  setInterval(next, HOLD_MS);
})();