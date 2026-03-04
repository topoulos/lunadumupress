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

  function getHeroImages() {

    const level = localStorage.getItem("spoilerLevel") || "none";

    const publicImages = [
      "images/public/01_alex_kelli_porch.jpg",
      "images/public/02_alex_kelli_hair.jpg",
      "images/public/03_pod_pizza_party.jpg",
      "images/public/04_church_cornfield_earth.jpg",
      "images/public/05_sam_alex_kelli_lila_family_night.jpg",
      "images/public/06_sam_alex_running_recruites.jpg",
    ];

    const book1Images = [
      "images/book1/01_alex_kelli_sam_rover.jpg"
    ];

    const book2Images = [
      "images/book2/01_sam_alex_kill.jpg",
      "images/book2/02_harmonic_cortex.jpg",
      "images/book2/03_fork_array_destruction.jpg",
      "images/book2/04_sam_alex_war.jpg",
      "images/book2/05_alex_sam_keira.jpg",
      "images/book2/06_lila_tim_carnival.jpg"
    ];

    let images = [...publicImages];

    if (level === "book1" || level === "book2" || level === "book3") {
      images = images.concat(book1Images);
    }

    if (level === "book2" || level === "book3") {
      images = images.concat(book2Images);
    }

    return images;
  }

  let images = getHeroImages();

  const FADE_MS = 1200;
  const HOLD_MS = 10000;

  let idx = 0;

  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  hero.style.setProperty("--hero-img", `url("${images[idx]}")`);

  function next() {
    idx = (idx + 1) % images.length;

    hero.style.setProperty("--hero-opacity", "0");

    setTimeout(() => {
      hero.style.setProperty("--hero-img", `url("${images[idx]}")`);
      hero.style.setProperty("--hero-opacity", "1");
    }, FADE_MS);
  }

  setInterval(next, HOLD_MS);

})();