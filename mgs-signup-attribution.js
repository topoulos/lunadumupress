/* Shared signup attribution helpers.
 * Stashes Ads UTMs + click IDs + signup email for enhanced conversion on
 * vow-thanks / act-one-thanks, and future ML Ad Platform mapping
 * (Newsletter owns the MailerLite field).
 * Do NOT fire Ads conversions here — Pod Signup Confirmed may fire on vow-thanks
 * OR act-one-thanks (session-deduped via mgs_pod_signup_confirmed).
 */
(function () {
  try {
    var params = new URLSearchParams(window.location.search);
    var keys = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'gclid',
      'gbraid',
      'wbraid',
      'fbclid'
    ];
    var existing = {};
    try {
      existing = JSON.parse(sessionStorage.getItem('mgs_google_attribution')) || {};
    } catch (parseError) {
      existing = {};
    }
    if (!existing || typeof existing !== 'object') existing = {};

    var changed = false;
    keys.forEach(function (key) {
      var value = params.get(key);
      if (value) {
        existing[key] = value;
        changed = true;
      }
    });
    // Merge only: never overwrite existing keys with empty/missing URL values.
    if (changed) {
      existing.recordedAt = Date.now();
      sessionStorage.setItem('mgs_google_attribution', JSON.stringify(existing));
    }
  } catch (error) {}

  document.addEventListener('submit', function (event) {
    try {
      var form = event.target;
      if (!form || !form.querySelector) return;
      var emailInput = form.querySelector('input[type="email"]');
      var email = emailInput && emailInput.value && emailInput.value.trim().toLowerCase();
      if (email) sessionStorage.setItem('mgs_signup_email', email);
    } catch (error) {}
  }, true);
}());
