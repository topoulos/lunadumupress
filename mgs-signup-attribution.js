/* Shared signup attribution helpers.
 * Stashes Ads UTMs + click IDs + signup email for enhanced conversion on
 * vow-thanks / act-one-thanks, and bridges sessionStorage into MailerLite
 * form 9NV2sK hidden fields (Ad Platform + utm_campaign).
 * Newsletter owns ML field definitions + 1b automation; Web only fills values.
 * Do NOT fire Ads conversions here — Pod Signup Confirmed may fire on vow-thanks
 * OR act-one-thanks (session-deduped via mgs_pod_signup_confirmed).
 */
(function () {
  var ATTR_KEY = 'mgs_google_attribution';
  var AD_PLATFORM_NAME = 'fields[ad_platform]';
  var UTM_CAMPAIGN_NAME = 'fields[utm_campaign]';

  function readAttribution() {
    try {
      var existing = JSON.parse(sessionStorage.getItem(ATTR_KEY)) || {};
      if (!existing || typeof existing !== 'object') return {};
      return existing;
    } catch (error) {
      return {};
    }
  }

  function stashFromUrl() {
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
      var existing = readAttribution();
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
        sessionStorage.setItem(ATTR_KEY, JSON.stringify(existing));
      }
    } catch (error) {}
  }

  /** Ads lander standards → ML Ad Platform allowed values. Empty = no copy by 1b. */
  function adPlatformFromAttribution(attr) {
    var source = String((attr && attr.utm_source) || '').toLowerCase().trim();
    if (
      source === 'facebook' ||
      source === 'instagram' ||
      source === 'youtube' ||
      source === 'google'
    ) {
      return source;
    }
    if (attr && attr.fbclid) return 'facebook';
    return '';
  }

  function findNamedField(form, name) {
    return (
      form.querySelector('input[name="' + name + '"]') ||
      form.querySelector('textarea[name="' + name + '"]') ||
      form.querySelector('select[name="' + name + '"]')
    );
  }

  /** Prefer native ML fields; hide them on landers. Inject only if missing. */
  function setAttributionField(form, name, value) {
    if (!form) return;
    var field = findNamedField(form, name);
    if (!field) {
      if (value == null || value === '') return;
      field = document.createElement('input');
      field.type = 'hidden';
      field.name = name;
      form.appendChild(field);
    } else {
      // Native embed may render these as visible text — fill + hide UI, keep type.
      field.setAttribute('aria-hidden', 'true');
      field.tabIndex = -1;
      var group = field.closest(
        '.ml-field-group, .ml-form-fieldRow, .ml-form-fieldWrapper, .form-group'
      );
      if (group) {
        group.style.display = 'none';
        group.setAttribute('aria-hidden', 'true');
      } else {
        field.style.position = 'absolute';
        field.style.left = '-9999px';
        field.style.height = '1px';
        field.style.width = '1px';
        field.style.overflow = 'hidden';
      }
    }
    if (value != null && value !== '') {
      field.value = String(value);
    }
  }

  function applyAttributionToForm(form) {
    if (!form || !form.querySelector) return;
    // MailerLite embedded forms (and any form that already has these fields).
    var looksLikeMl =
      form.querySelector('input[name="ml-submit"]') ||
      findNamedField(form, AD_PLATFORM_NAME) ||
      findNamedField(form, UTM_CAMPAIGN_NAME) ||
      (form.closest && form.closest('.ml-embedded, .ml-form-embedContainer'));
    if (!looksLikeMl) return;

    var attr = readAttribution();
    var platform = adPlatformFromAttribution(attr);
    var campaign = attr.utm_campaign ? String(attr.utm_campaign) : '';
    // Always hide native Ad Platform / utm_campaign controls on landers,
    // even when values are empty (organic).
    setAttributionField(form, AD_PLATFORM_NAME, platform);
    setAttributionField(form, UTM_CAMPAIGN_NAME, campaign);
  }

  function applyToAllMlForms() {
    try {
      var forms = document.querySelectorAll(
        'form.ml-block-form, .ml-embedded form, .ml-form-embedContainer form, form'
      );
      for (var i = 0; i < forms.length; i++) {
        applyAttributionToForm(forms[i]);
      }
    } catch (error) {}
  }

  stashFromUrl();

  document.addEventListener(
    'submit',
    function (event) {
      try {
        var form = event.target;
        if (!form || !form.querySelector) return;
        var emailInput = form.querySelector('input[type="email"]');
        var email =
          emailInput &&
          emailInput.value &&
          emailInput.value.trim().toLowerCase();
        if (email) sessionStorage.setItem('mgs_signup_email', email);
        applyAttributionToForm(form);
      } catch (error) {}
    },
    true
  );

  // ML embeds inject forms async — fill when they appear, and once after load.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyToAllMlForms);
  } else {
    applyToAllMlForms();
  }
  window.addEventListener('load', function () {
    applyToAllMlForms();
    setTimeout(applyToAllMlForms, 500);
    setTimeout(applyToAllMlForms, 1500);
  });
  try {
    var observer = new MutationObserver(function () {
      applyToAllMlForms();
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  } catch (error) {}
})();
