(function () {
  function todayCT() {
    // YYYY-MM-DD in America/Chicago
    return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  }
  function fmtDate(iso) {
    var p = iso.split("-").map(Number);
    var d = new Date(Date.UTC(p[0], p[1] - 1, p[2], 12));
    return d.toLocaleDateString("en-US", { timeZone: "UTC", weekday: "short", month: "short", day: "numeric", year: "numeric" });
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function card(it, past) {
    var h = '<article class="news-item" id="' + esc(it.id) + '">';
    h += '<p class="news-date">' + esc(fmtDate(it.date)) + (it.time ? " · " + esc(it.time) : "") + "</p>";
    h += "<h4>" + esc(it.title) + "</h4>";
    if (it.location) h += '<p class="news-location">' + esc(it.location) + "</p>";
    if (it.image) h += '<img class="news-image" src="' + esc(it.image) + '" alt="' + esc(it.title) + '" loading="lazy" />';
    h += "<p>" + esc(past && it.recap ? it.recap : it.summary) + "</p>";
    if (it.link) h += '<a class="inline-link" href="' + esc(it.link) + '" target="_blank" rel="noopener noreferrer">Details →</a>';
    return h + "</article>";
  }
  function split(items, today) {
    var up = [], pastEv = [], news = [];
    items.forEach(function (it) {
      if (it.type === "news") news.push(it);
      else if (it.date >= today) up.push(it);
      else pastEv.push(it);
    });
    up.sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
    pastEv.sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    news.sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    return { upcoming: up, past: pastEv, news: news };
  }
  function render(data) {
    var s = split(data.items || [], todayCT());
    var up = document.getElementById("upcoming-list");
    var pe = document.getElementById("past-list");
    var nw = document.getElementById("news-list");
    if (up) up.innerHTML = s.upcoming.length ? s.upcoming.map(function (i) { return card(i, false); }).join("") : '<p class="news-empty">New events are being scheduled. Join the Pod to hear first.</p>';
    if (nw) nw.innerHTML = s.news.length ? s.news.map(function (i) { return card(i, false); }).join("") : '<p class="news-empty">News from the Pod is on the way.</p>';
    if (pe) {
      pe.innerHTML = s.past.map(function (i) { return card(i, true); }).join("");
      var sec = document.getElementById("past-events");
      if (sec) sec.hidden = s.past.length === 0;
    }
  }
  if (typeof module !== "undefined") { module.exports = { split: split, todayCT: todayCT, fmtDate: fmtDate }; return; }
  document.addEventListener("DOMContentLoaded", function () {
    requestAnimationFrame(function () { document.body.classList.add("loaded"); });
    fetch("/news/news.json", { cache: "no-cache" }).then(function (r) { return r.json(); }).then(render).catch(function () {});
  });
})();
