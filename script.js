window.setSpoiler = function(level) {
  localStorage.setItem("spoilerLevel", level);
  applySpoilers();
  highlightSpoiler(level);

  const select = document.getElementById("spoilerLevel");
  if (select) select.value = level;

  // Rebuild hero if available
  if (typeof window.rebuildHeroFromSpoilerLevel === "function") {
    window.rebuildHeroFromSpoilerLevel();
  }
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
  
 
document.addEventListener("DOMContentLoaded", () => {
  // Double rAF ensures at least one paint frame before the transition fires.
  // Without this, mobile browsers can skip the #pageFade opacity transition
  // entirely and leave a black screen.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.add("loaded");
    });
  });

  const stored = localStorage.getItem("spoilerLevel") || "none";
  if (!localStorage.getItem("spoilerLevel")) {
    localStorage.setItem("spoilerLevel", "none");
  }

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
  const musicToggle = document.getElementById("musicToggle");
  const heroAudio = document.getElementById("heroAudio");

  let focusTimer = null;
  let ignoreWakeUntil = 0;
  let cinematicTimer = null;
  let shouldRunIntro = false;

  function enterFocusMode() {
    if (!hero || !heroAudio || heroAudio.paused) return;
    hero.classList.remove("is-awake");
    hero.classList.add("is-focused");
  }

  function exitFocusMode() {
    if (!hero) return;
    hero.classList.remove("is-focused", "is-awake");
  }

  function wakeHeroTemporarily() {
    if (!hero || !heroAudio || heroAudio.paused) return;
    if (Date.now() < ignoreWakeUntil) return;

    hero.classList.remove("is-focused");
    hero.classList.add("is-awake");

    clearTimeout(focusTimer);
    focusTimer = setTimeout(() => {
      if (!heroAudio.paused) {
        hero.classList.remove("is-awake");
        hero.classList.add("is-focused");
      }
    }, 3500);
  }

  if (musicToggle && heroAudio) {
    const label = musicToggle.querySelector(".music-label");
    const icon = musicToggle.querySelector(".music-icon");

    const updateMusicUI = () => {
      const isPlaying = !heroAudio.paused;
      musicToggle.classList.toggle("playing", isPlaying);

      if (label) label.textContent = isPlaying ? "Pause Presentation" : "Play Presentation";
      if (icon) icon.textContent = "♪";

      musicToggle.setAttribute(
        "aria-label",
        isPlaying ? "Pause background music" : "Play background music"
      );
    };

    musicToggle.addEventListener("click", async () => {
      try {
        if (heroAudio.paused) {

          shouldRunIntro = true;   // ← ADD THIS LINE

          heroAudio.currentTime = 0;

          if (typeof window.restartHeroSequence === "function") {
            window.restartHeroSequence();
          }

          await heroAudio.play();
        } else {
          heroAudio.pause();
        }

        updateMusicUI();
      } catch (err) {
        console.error("Audio playback failed:", err);
      }
    });

    heroAudio.addEventListener("play", () => {
      clearTimeout(focusTimer);
      clearTimeout(cinematicTimer);
      updateMusicUI();

      ignoreWakeUntil = Date.now() + 2200;

      if (hero && shouldRunIntro) {
        console.log("triggering intro/glint", hero.className);
        hero.classList.remove("music-started", "cinematic-start");
        void hero.offsetWidth;
        hero.classList.add("music-started");
        hero.classList.add("cinematic-start");

        cinematicTimer = setTimeout(() => {
          hero.classList.remove("cinematic-start");
        }, window.innerWidth < 700 ? 9000 : 7000);
      }

      setTimeout(() => {
        enterFocusMode();
      }, 800); 

      shouldRunIntro = false;
    });

    heroAudio.addEventListener("pause", () => {
      clearTimeout(focusTimer);
      clearTimeout(cinematicTimer);
      updateMusicUI();

      if (hero) {
        hero.classList.remove("cinematic-start", "music-started");
      }

      exitFocusMode();
    });

  } // ← closes if (musicToggle && heroAudio)

  // --- Music track init ---
  const savedTrack = localStorage.getItem("musicTrack") || "cirrus";
  applyMusicTrack(savedTrack);

  const musicTrackSelect = document.getElementById("musicTrackSelect");
  if (musicTrackSelect) {
    musicTrackSelect.value = savedTrack;
    musicTrackSelect.addEventListener("change", (e) => {
      applyMusicTrack(e.target.value);
    });
  }

}); // ← closes DOMContentLoaded

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        entry.target.classList.add("decoded");
      }
    });
  },
  { threshold: 0, rootMargin: "0px 0px -10px 0px" }
);

document.querySelectorAll(".fade, .decode").forEach(el => {
  observer.observe(el);
  // Fallback: immediately reveal anything already in the viewport on load
  const rect = el.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    el.classList.add("visible", "decoded");
  }
});

(() => {
  const hero = document.getElementById("hero");
  if (!hero) return;

  const VERSION = "20260930-human-art"; // bump this when you replace images

  let intervalId = null;
  let idx = 0;
  let showingA = true;
  let images = [];
  let touchStartX = 0;
  let touchEndX = 0;

  function buildHeroImages() {
    return [
      `images/artists/shawn-lee/vow-family.jpg?v=${VERSION}`,
      `images/artists/shawn-lee/broken-chain.jpg?v=${VERSION}`,
      `images/artists/shawn-lee/ember.jpg?v=${VERSION}`,
      `images/artists/shawn-lee/promise.jpg?v=${VERSION}`,
      `images/artists/shawn-lee/psalms-of-chaos.jpg?v=${VERSION}`,
      `images/artists/shawn-lee/war-ellipse.jpg?v=${VERSION}`,
    ];

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

  function showSlide(newIdx) {
    if (!images.length) return;

    const normalizedIdx = (newIdx + images.length) % images.length;

    if (showingA) {
      hero.style.setProperty("--hero-img-b", `url("${images[normalizedIdx]}")`);
      hero.style.setProperty("--hero-b-opacity", "1");
      hero.style.setProperty("--hero-a-opacity", "0");
      showingA = false;
    } else {
      hero.style.setProperty("--hero-img-a", `url("${images[normalizedIdx]}")`);
      hero.style.setProperty("--hero-a-opacity", "1");
      hero.style.setProperty("--hero-b-opacity", "0");
      showingA = true;
    }

    idx = normalizedIdx;
  }

  function startRotation(holdOverride) {
    const isMobile = window.innerWidth < 700;
    let HOLD_MS;

    if (isMobile) {
      HOLD_MS = 12000;
    } else if (holdOverride) {
      HOLD_MS = holdOverride;
    } else {
      const audio = document.getElementById("heroAudio");
      const duration = audio && isFinite(audio.duration) ? audio.duration : null;

      if (duration && images.length > 0) {
        // Distribute slides evenly across the song duration
        HOLD_MS = Math.round((duration / images.length) * 1000);
        // Clamp: no faster than 3s, no slower than 15s per slide
        HOLD_MS = Math.max(3000, Math.min(15000, HOLD_MS));
        console.log(`Song duration: ${duration.toFixed(1)}s, ${images.length} slides → ${HOLD_MS}ms per slide`);
      } else {
        HOLD_MS = 7000; // fallback if audio metadata isn't ready
      }
    }

    if (intervalId) clearInterval(intervalId);

    intervalId = setInterval(() => {
      if (!images.length) return;
      showSlide(idx + 1);
    }, HOLD_MS);
  }

  function rebuildFromSpoilerLevel() {
    images = buildHeroImages();

    if (!images.length) return;

    preload(images);
    applyInitialState(images);
    startRotation();
  }

  // Build on load
  rebuildFromSpoilerLevel();

  // Expose so setSpoiler (top-level) can call it
  window.rebuildHeroFromSpoilerLevel = rebuildFromSpoilerLevel;

  hero.addEventListener("touchstart", (e) => {
    if (window.innerWidth >= 700) return;
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  hero.addEventListener("touchend", (e) => {
    if (window.innerWidth >= 700) return;

    touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;
    const swipeThreshold = 40;

    if (Math.abs(deltaX) < swipeThreshold) return;

    if (deltaX < 0) {
      showSlide(idx + 1); // swipe left = next
    } else {
      showSlide(idx - 1); // swipe right = previous
    }

    startRotation(); // restart timer so it doesn't jump immediately
  }, { passive: true });


  window.restartHeroSequence = function() {
    rebuildFromSpoilerLevel();
  };

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

// =========================
//   MUSIC TRACK SELECTOR
// =========================

const MUSIC_TRACKS = {
  cirrus: {
    src: "audio/Cirrus.mp3",
    creditHTML: `"Cirrus" by <a href="https://www.scottbuckley.com.au/" target="_blank" rel="noopener noreferrer">Scott Buckley</a> <span class="license-tag">— CC BY 4.0</span>`,
  },
  frankincense: {
    src: "audio/sb_frankincenseandmyrrh.mp3",
    creditHTML: `"Frankincense and Myrrh" by <a href="https://www.scottbuckley.com.au/" target="_blank" rel="noopener noreferrer">Scott Buckley</a> <span class="license-tag">— CC BY 4.0</span>`,
  },
};

function applyMusicTrack(trackKey) {
  const track = MUSIC_TRACKS[trackKey] || MUSIC_TRACKS["cirrus"];
  const audio = document.getElementById("heroAudio");
  const credit = document.getElementById("musicCredit");
  const select = document.getElementById("musicTrackSelect");

  const wasPlaying = audio && !audio.paused;

  if (audio) {
    if (wasPlaying) {
      audio.pause();
    }
    // Swap source
    audio.src = track.src;
    audio.load();
    // If it was playing, resume
    if (wasPlaying) {
      audio.play().catch(() => {});
    }
  }

  if (credit) {
    credit.innerHTML = track.creditHTML;
  }

  if (select) {
    select.value = trackKey;
  }

  localStorage.setItem("musicTrack", trackKey);
}

// Expose globally so it can be called from other contexts if needed
window.applyMusicTrack = applyMusicTrack;
