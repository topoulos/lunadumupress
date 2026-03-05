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
      entry.target.classList.add("decoded");
    }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".decode").forEach((el) => {
  observer.observe(el);
});

document.querySelectorAll(".fade").forEach(el => observer.observe(el));

(() => {
  const hero = document.getElementById("hero");
  if (!hero) return;

  const VERSION = "20260304a"; // bump this when you replace images

  let intervalId = null;
  let idx = 0;
  let showingA = true;
  let images = [];

  function levelAtLeast(level, required) {
    const order = ["none", "book1", "book2", "book3"];
    return order.indexOf(level) >= order.indexOf(required);
  }

  function buildHeroImages(level) {
    const list = [];

    // ===== PUBLIC (no spoilers) =====
    list.push(`images/public/01_alex_kelli_porch.jpg?v=${VERSION}`);          // porch swing
    list.push(`images/public/02_alex_kelli_hair.jpg?v=${VERSION}`);           // hair dye
    list.push(`images/public/03_pod_pizza_party.jpg?v=${VERSION}`);           // pizza pod
    list.push(`images/public/04_church_cornfield_earth.jpg?v=${VERSION}`);    // cornfield church
    list.push(`images/public/05_sam_alex_kelli_lila_family_night.jpg?v=${VERSION}`); // family night

    // IMPORTANT: match your actual filename EXACTLY.
    // If your file is still "recruites" (with an e), use that spelling:
    list.push(`images/public/06_sam_alex_running_recruits.jpg?v=${VERSION}`); // recruits run (CHECK NAME)

    // ===== BOOK 1 =====
    if (levelAtLeast(level, "book1")) {
      list.push(`images/book1/01_alex_kelli_sam_rover.jpg?v=${VERSION}`);
      list.push(`images/book1/02_alex_kelli_sam_preg_porch.jpg?v=${VERSION}`);
      // list.push(`images/book1/03_whatever.jpg?v=${VERSION}`); // toggle on/off
    }

    // ===== BOOK 2 =====
    if (levelAtLeast(level, "book2")) {
      list.push(`images/book2/01_sam_alex_kill.jpg?v=${VERSION}`);
      list.push(`images/book2/02_harmonic_cortex.jpg?v=${VERSION}`);
      list.push(`images/book2/03_fork_array_destruction.jpg?v=${VERSION}`);

      // list.push(`images/book2/05_alex_sam_keira.jpg?v=${VERSION}`); // spoiler heavy? toggle
      list.push(`images/book2/06_lila_tim_carnival.jpg?v=${VERSION}`);
      list.push(`images/book2/08_kellis_message.jpg?v=${VERSION}`);
      list.push(`images/book2/09_killing_olosk.jpg?v=${VERSION}`);
      list.push(`images/book2/10_missing_boy.jpg?v=${VERSION}`);
    }

    return list;
  }

  function preload(list) {
    list.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }

  function applyInitialState(list) {
    idx = 0;
    showingA = true;

    hero.style.setProperty("--hero-img-a", `url("${list[idx]}")`);
    hero.style.setProperty("--hero-a-opacity", "1");

    hero.style.setProperty("--hero-img-b", `url("${list[(idx + 1) % list.length]}")`);
    hero.style.setProperty("--hero-b-opacity", "0");
  }

  function startRotation() {
    const FADE_MS = 1200;
    const HOLD_MS = 12000;

    if (intervalId) clearInterval(intervalId);

    intervalId = setInterval(() => {
      if (!images.length) return;

      const nextIdx = (idx + 1) % images.length;

      if (showingA) {
        hero.style.setProperty("--hero-img-b", `url("${images[nextIdx]}")`);
        hero.style.setProperty("--hero-b-opacity", "1");
        hero.style.setProperty("--hero-a-opacity", "0");
        showingA = false;
      } else {
        hero.style.setProperty("--hero-img-a", `url("${images[nextIdx]}")`);
        hero.style.setProperty("--hero-a-opacity", "1");
        hero.style.setProperty("--hero-b-opacity", "0");
        showingA = true;
      }

      idx = nextIdx;
    }, HOLD_MS);
  }

  function rebuildFromSpoilerLevel() {
    const level = localStorage.getItem("spoilerLevel") || "none";
    images = buildHeroImages(level);

    if (!images.length) return;

    preload(images);
    applyInitialState(images);
    startRotation();
  }

  // Build on load
  rebuildFromSpoilerLevel();

  // Rebuild when the user changes spoiler level (in this tab)
  const originalSetSpoiler = window.setSpoiler;
  window.setSpoiler = function(level) {
    if (typeof originalSetSpoiler === "function") originalSetSpoiler(level);
    rebuildFromSpoilerLevel();
  };

  // Also rebuild if localStorage changes from another tab
  window.addEventListener("storage", (e) => {
    if (e.key === "spoilerLevel") rebuildFromSpoilerLevel();
  });
})();