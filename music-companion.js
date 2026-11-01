/* Same site-wide spoilerLevel and per-cue reveal pattern as Vow / Ember. */
(() => {
  const levels = ['none', 'book1', 'book2', 'book3', 'book4'];
  const buttons = [...document.querySelectorAll('.track-reveal-btn')];
  const setOpen = (button, open) => {
    const content = document.getElementById(button.getAttribute('aria-controls'));
    content.hidden = !open;
    content.classList.toggle('open', open);
    button.classList.toggle('open', open);
    button.setAttribute('aria-expanded', String(open));
    button.innerHTML = '<em class="reveal-icon" aria-hidden="true">▾</em> ' + (open ? 'Hide' : 'Show') + ' scenes &amp; notes';
  };
  const apply = () => {
    const stored = localStorage.getItem('spoilerLevel');
    const level = levels.includes(stored) ? stored : 'none';
    buttons.forEach(button => {
      button.style.display = levels.indexOf(level) >= levels.indexOf('book3') ? 'inline-flex' : 'none';
      if (levels.indexOf(level) < levels.indexOf('book3')) setOpen(button, false);
    });
    levels.forEach(value => {
      const button = document.getElementById('cfb-' + value);
      if (button) {
        button.classList.toggle('active', level === value);
        button.setAttribute('aria-pressed', String(level === value));
      }
    });
    document.getElementById('companionSpoilerSelect').value = level;
    const footer = document.getElementById('spoilerLevel');
    if (footer) footer.value = level;
    if (typeof window.highlightSpoiler === 'function') window.highlightSpoiler(level);
  };
  buttons.forEach(button => button.addEventListener('click', () => {
    if (levels.indexOf(localStorage.getItem('spoilerLevel')) >= levels.indexOf('book3')) setOpen(button, button.getAttribute('aria-expanded') !== 'true');
  }));
  const original = window.setSpoiler;
  window.setSpoiler = level => { original(level); apply(); };
  document.getElementById('companionSpoilerSelect').addEventListener('change', event => window.setSpoiler(event.target.value));
  window.addEventListener('storage', event => { if (event.key === 'spoilerLevel' || event.key === null) apply(); });
  document.addEventListener('DOMContentLoaded', apply);
  apply();
})();
