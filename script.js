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
      "images/public/06_sam_alex_running_recruits.jpg",
    ];

    const book1Images = [
      "images/book1/01_alex_kelli_sam_rover.jpg",
      "images/book1/02_alex_kelli_sam_preg_porch.jpg",
    ];

    const book2Images = [
      "images/book2/01_sam_alex_kill.jpg",
      "images/book2/02_harmonic_cortex.jpg",
      "images/book2/03_fork_array_destruction.jpg",
      "images/book2/05_alex_sam_keira.jpg",
      "images/book2/06_lila_tim_carnival.jpg",
      "images/book2/08_kellis_message.jpg",
      "images/book2/09_killing_olosk.jpg",
      "images/book2/10_missing_boy.jpg",

    ];

    let images = [...publicImages];
    if (level === "book1" || level === "book2" || level === "book3") images.push(...book1Images);
    if (level === "book2" || level === "book3") images.push(...book2Images);

    return images;
  }

  let images = getHeroImages();
  if (images.length === 0) return;

  // Preload (prevents flash)
  images.forEach(src => { const img = new Image(); img.src = src; });

  const FADE_MS = 1200;
  const HOLD_MS = 12000;

  let idx = 0;
  let showingA = true;

  // Initialize: A visible, B hidden
  hero.style.setProperty("--hero-img-a", `url("${images[idx]}")`);
  hero.style.setProperty("--hero-a-opacity", "1");

  hero.style.setProperty("--hero-img-b", `url("${images[(idx + 1) % images.length]}")`);
  hero.style.setProperty("--hero-b-opacity", "0");

  function tick() {
    const nextIdx = (idx + 1) % images.length;

    if (showingA) {
      // Put next image into B and crossfade A -> B
      hero.style.setProperty("--hero-img-b", `url("${images[nextIdx]}")`);
      hero.style.setProperty("--hero-b-opacity", "1");
      hero.style.setProperty("--hero-a-opacity", "0");
      showingA = false;
    } else {
      // Put next image into A and crossfade B -> A
      hero.style.setProperty("--hero-img-a", `url("${images[nextIdx]}")`);
      hero.style.setProperty("--hero-a-opacity", "1");
      hero.style.setProperty("--hero-b-opacity", "0");
      showingA = true;
    }

    idx = nextIdx;
  }

  // Start rotation
  setInterval(tick, HOLD_MS);
})();