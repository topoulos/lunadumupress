/* Shared MailerLite signup attribution helpers.
 * Stashes Google click IDs + signup email for vow-thanks enhanced conversion.
 * Do NOT fire Ads conversions here — Pod Signup Confirmed fires only on vow-thanks.
 */
(function () {
  try {
    var params = new URLSearchParams(window.location.search);
    var attribution = {};
    ['gclid', 'gbraid', 'wbraid'].forEach(function (key) {
      var value = params.get(key);
      if (value) attribution[key] = value;
    });
    if (Object.keys(attribution).length) {
      attribution.recordedAt = Date.now();
      sessionStorage.setItem('mgs_google_attribution', JSON.stringify(attribution));
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
