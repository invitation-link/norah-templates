(function () {
  'use strict';

  var CONSENT_KEY = 'invitelink_consent_v1';
  // Add the published container ID here once the GTM workspace is created.
  // All Invite Link funnel events already use dataLayer-compatible names.
  var GTM_ID = '';
  var GA_ID = 'G-81CCB5ZMLX';
  var CLARITY_ID = 'wzp3yr2x2l';
  var directMeasurementReady = false;
  window.dataLayer = window.dataLayer || [];

  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });

  function track(name, params) {
    var detail = Object.assign({ event: name, page_path: window.location.pathname }, params || {});
    window.dataLayer.push(detail);
    if (directMeasurementReady) {
      window.gtag('event', name, params || {});
      if (typeof window.clarity === 'function') window.clarity('event', name);
    }
    document.dispatchEvent(new CustomEvent('invitelink:track', { detail: detail }));
  }
  window.inviteLinkTrack = track;

  function loadMeasurement() {
    if (document.querySelector('script[data-invitelink-ga]')) return;
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    if (GTM_ID) {
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      var gtm = document.createElement('script');
      gtm.async = true;
      gtm.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
      document.head.appendChild(gtm);
      return;
    }
    var ga = document.createElement('script');
    ga.async = true;
    ga.dataset.invitelinkGa = 'true';
    ga.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(ga);
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { send_page_view: true });
    directMeasurementReady = true;

    window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
    var clarity = document.createElement('script');
    clarity.async = true;
    clarity.dataset.invitelinkClarity = 'true';
    clarity.src = 'https://www.clarity.ms/tag/' + CLARITY_ID;
    document.head.appendChild(clarity);
  }

  function saveConsent(value) {
    localStorage.setItem(CONSENT_KEY, value);
    if (value === 'all') loadMeasurement();
    track('consent_update', { consent_choice: value });
  }

  function showConsent() {
    if (localStorage.getItem(CONSENT_KEY) || document.querySelector('.consent-banner')) return;
    var banner = document.createElement('aside');
    banner.className = 'consent-banner';
    banner.setAttribute('aria-label', 'Privacy choices');
    banner.innerHTML = '<h2>Your privacy, your choice</h2><p>Essential storage keeps drafts working. With your permission, analytics helps us improve the invitation journey. Advertising cookies are not loaded here. <a href="/privacy">Privacy policy</a></p><div class="consent-actions"><button type="button" data-consent="essential">Essential only</button><button type="button" data-consent="all">Allow analytics</button></div>';
    document.body.appendChild(banner);
    banner.addEventListener('click', function (event) {
      var button = event.target.closest('[data-consent]');
      if (!button) return;
      saveConsent(button.dataset.consent);
      banner.remove();
    });
  }

  function addConsentManager() {
    var manage = document.createElement('button');
    manage.type = 'button';
    manage.className = 'consent-manage';
    manage.textContent = 'Privacy choices';
    manage.addEventListener('click', function () {
      localStorage.removeItem(CONSENT_KEY);
      showConsent();
    });
    document.body.appendChild(manage);
  }

  function bindTracking() {
    document.addEventListener('click', function (event) {
      var target = event.target.closest('[data-track]');
      if (!target) return;
      track(target.dataset.track, {
        item_id: target.dataset.itemId || undefined,
        item_category: target.dataset.category || undefined,
        link_url: target.href || undefined,
        link_text: (target.textContent || '').trim().slice(0, 80)
      });
    });
  }

  function setupReveals() {
    var nodes = document.querySelectorAll('.acq-reveal');
    if (!nodes.length || !('IntersectionObserver' in window)) {
      nodes.forEach(function (node) { node.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .12 });
    nodes.forEach(function (node) { observer.observe(node); });
  }

  function init() {
    if (localStorage.getItem(CONSENT_KEY) === 'all') loadMeasurement();
    bindTracking();
    setupReveals();
    showConsent();
    addConsentManager();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
