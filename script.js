window.setSpoiler = function(level) {
  localStorage.setItem("spoilerLevel", level);
  applySpoilers();
  highlightSpoiler(level);

  const select = document.getElementById("spoilerLevel");
  if (select) select.value = level;
};

function applySpoilers() {
  const level = localStorage.getItem("spoilerLevel") || "none";
  const order = ["none", "book1", "book2", "book3"];

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

function highlightSpoiler(level) {
  document.querySelectorAll(".spoiler-settings button").forEach(btn => {
    btn.classList.remove("active");
  });

  const activeBtn = document.querySelector(
    `.spoiler-settings button[onclick="setSpoiler('${level}')"]`
  );

  if (activeBtn) activeBtn.classList.add("active");
}

  
  window.addEventListener("scroll", () => {
    if (!heroAudio.paused) {
      hero.classList.remove("is-focused");
      hero.classList.add("is-awake");
    }
  }, { passive: true });

  heroAudio.addEventListener("pause", () => {
    hero.classList.remove("is-focused", "is-awake");
  });

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");
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

  const hero = document.getElementById("hero");
  let focusTimer = null;

  function enterFocusMode() {
    if (!hero || heroAudio.paused) return;
    hero.classList.remove("is-awake");
    hero.classList.add("is-focused");
  }

  function wakeHeroTemporarily() {
    if (!hero || heroAudio.paused) return;

    hero.classList.remove("is-focused");
    hero.classList.add("is-awake");

    clearTimeout(focusTimer);
    focusTimer = setTimeout(() => {
      hero.classList.remove("is-awake");
      hero.classList.add("is-focused");
    }, 3500);
  }

  const musicToggle = document.getElementById("musicToggle");
  const heroAudio = document.getElementById("heroAudio");

  if (musicToggle && heroAudio) {
    const label = musicToggle.querySelector(".music-label");
    const icon = musicToggle.querySelector(".music-icon");

    const updateMusicUI = () => {
      const isPlaying = !heroAudio.paused;
      musicToggle.classList.toggle("playing", isPlaying);
      if (label) label.textContent = isPlaying ? "Pause Theme" : "Play Theme";
      if (icon) icon.textContent = "♪";
      musicToggle.setAttribute(
        "aria-label",
        isPlaying ? "Pause background music" : "Play background music"
      );
    };

    musicToggle.addEventListener("click", async () => {
      try {

        if (!heroAudio.paused) {
          setTimeout(() => {
            enterFocusMode();
          }, 1800);
        } else {
          hero.classList.remove("is-focused", "is-awake");
        }

        if (heroAudio.paused) {
          await heroAudio.play();
        } else {
          heroAudio.pause();
        }
        updateMusicUI();
      } catch (err) {
        console.error("Audio playback failed:", err);
      }
    });

    heroAudio.addEventListener("play", updateMusicUI);
    heroAudio.addEventListener("pause", updateMusicUI);

    updateMusicUI();
  }

  ["mousemove", "touchstart", "click", "keydown"].forEach(evt => {
    window.addEventListener(evt, wakeHeroTemporarily, { passive: true });
  });
  
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
    list.push(`images/public/005_sam_kelli_cornfield_church.jpg?v=${VERSION}`);          // porch swing
    list.push(`images/public/010_alex_kelli_porch.jpg?v=${VERSION}`);          // porch swing
    list.push(`images/public/020_alex_kelli_hair.jpg?v=${VERSION}`);           // hair dye
    list.push(`images/public/025_sam_arienne.jpg?v=${VERSION}`);           // pizza pod
    list.push(`images/public/030_sam_alex_scale_wall.jpg?v=${VERSION}`);    // sam and alex scale wall
    list.push(`images/public/040_sam_alex_running_recruits.jpg?v=${VERSION}`); // sam and alex running
    list.push(`images/public/045_sam_alex_bunks.jpg?v=${VERSION}`); // sam and alex bunks night
    list.push(`images/public/050_sam_alex_jamestown_mess_hall.jpg?v=${VERSION}`); // friends in mess hall
    list.push(`images/public/060_sam_alex_comfort.jpg?v=${VERSION}`); // sam holding alex in barracks
    list.push(`images/public/070_sam_alex_training_photo.jpg?v=${VERSION}`); // sam and alex pose in training gear
    list.push(`images/public/075_west_comm_tower_wide_shot.jpg?v=${VERSION}`); // west comm tower wide shot
    list.push(`images/public/077_sam_alex_west_comm_sneak.jpg?v=${VERSION}`); // family night
    list.push(`images/public/090_sam_alex_kelli_west_comm.jpg?v=${VERSION}`); // family night
    list.push(`images/public/095_sam_alex_west_comm.jpg?v=${VERSION}`); // sam and alex sneak into west comm
    list.push(`images/public/100_alex_kelli_sam_rover.jpg?v=${VERSION}`); // family night
    list.push(`images/public/105_sam_kelli_karaoke_bar2.jpg?v=${VERSION}`); // family night
    list.push(`images/public/110_sam_alex_charge_tower_fenyang.jpg?v=${VERSION}`); // family night
    list.push(`images/public/120_water_tower_battle.jpg?v=${VERSION}`); // family night
    list.push(`images/public/130_sam_alex_graduation.jpg?v=${VERSION}`); // family night
    list.push(`images/public/140_sam_alex_kelli_after_graduation.jpg?v=${VERSION}`); // family night
    list.push(`images/public/150_wedding_photo_sam_alex_kelli.jpg?v=${VERSION}`); // family night
    list.push(`images/public/160_sam_kelli_hopper.jpg?v=${VERSION}`); // family night
    list.push(`images/book1/025_marriedlife.jpg?v=${VERSION}`); // toggle on/off
    list.push(`images/book1/020_alex_kelli_sam_preg_porch.jpg?v=${VERSION}`); // toggle on/off
    list.push(`images/book1/035_sam_alex_brink_kelli_pregnant_to_hospital.jpg?v=${VERSION}`); // toggle on/off
    list.push(`images/book1/038_sam_alex_kelli_lila_born.jpg?v=${VERSION}`); // toggle on/off
    list.push(`images/public/170_sam_alex_kelli_lila_family_night.jpg?v=${VERSION}`); // family night
    list.push(`images/book1/060_Kelli_Lila_west_comm.jpg?v=${VERSION}`); // toggle on/off
    list.push(`images/book1/050_kelli_alex_gethsemane.jpg?v=${VERSION}`); // toggle on/off
    list.push(`images/book2/01_sam_alex_kill.jpg?v=${VERSION}`);
    list.push(`images/book2/02_harmonic_cortex.jpg?v=${VERSION}`);
    list.push(`images/book2/03_fork_array_destruction.jpg?v=${VERSION}`);


       // ===== BOOK 1 =====
    if (levelAtLeast(level, "book1")) {
      list.push(`images/book1/010_cadet_funeral.jpg?v=${VERSION}`);
      list.push(`images/book1/012_shoemaker_families.jpg?v=${VERSION}`);
      list.push(`images/book1/015_shoemaker_disaster.jpg?v=${VERSION}`); // toggle on/off
      list.push(`images/book1/040_spaghetti_night.jpg?v=${VERSION}`); // toggle on/off
      list.push(`images/book1/070_lila_doesnt_want_to_say_goodbye.jpg?v=${VERSION}`); // toggle on/off
      list.push(`images/book1/080_kelli_waves_goodbye.jpg?v=${VERSION}`); // toggle on/off
      list.push(`images/book1/085_arbitor.jpg?v=${VERSION}`); // toggle on/off
    }

    // ===== BOOK 2 =====
    if (levelAtLeast(level, "book2")) {
      list.push(`images/book2/03_pod_pizza_party.jpg?v=${VERSION}`);
      list.push(`images/book2/04_sam_alex_war.jpg?v=${VERSION}`);
      list.push(`images/book2/05_alex_sam_keira.jpg?v=${VERSION}`); // spoiler heavy? toggle
      list.push(`images/book2/06_lila_tim_carnival.jpg?v=${VERSION}`);
      list.push(`images/book2/07_alex_sam_remember.jpg?v=${VERSION}`);
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
    const HOLD_MS = 6000;

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