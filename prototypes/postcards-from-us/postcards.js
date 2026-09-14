(() => {
  const track = (event, detail = {}) => {
    window.dispatchEvent(new CustomEvent('invitelink:analytics', { detail: { event, ...detail } }));
    if (window.console) console.info('[InviteLink]', event, detail);
  };

  const readConfig = () => {
    const node = document.getElementById('invite-config');
    try {
      return JSON.parse(node?.textContent || '{}');
    } catch (_) {
      track('invite_config_error');
      return {};
    }
  };

  const applyOptionalModules = (config) => {
    const params = new URLSearchParams(window.location.search);
    const overrides = {
      travel: params.has('demoTravel') ? params.get('demoTravel') !== '0' : undefined,
      memory: params.has('demoMemory') ? params.get('demoMemory') === '1' : undefined
    };

    document.querySelectorAll('[data-optional-module]').forEach((node) => {
      const key = node.dataset.optionalModule;
      const configured = Boolean(config.optionalModules?.[key]);
      const enabled = overrides[key] === undefined ? configured : overrides[key];
      node.hidden = !enabled;
      node.dataset.moduleState = enabled ? 'enabled' : 'omitted';
      track('optional_module_state', { module: key, enabled });
    });
  };

  const activatePhaseDeepLink = () => {
    const params = new URLSearchParams(window.location.search);
    const phase = params.get('phase');
    if (!phase) return;

    const targetId = { arrival: 'travel', travel: 'travel', memory: 'memory' }[phase];
    const target = targetId ? document.getElementById(targetId) : null;
    if (!target || target.hidden) {
      track('phase_deep_link_unavailable', { phase });
      return;
    }

    target.setAttribute('tabindex', '-1');
    requestAnimationFrame(() => {
      target.scrollIntoView({ block: 'start' });
      target.focus({ preventScroll: true });
    });
    track('phase_deep_link', { phase });
  };

  const trackItineraryView = () => {
    const itinerary = document.querySelector('[data-itinerary]');
    if (!itinerary) return;

    if (!('IntersectionObserver' in window)) {
      track('itinerary_view', { method: 'fallback' });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      track('itinerary_view', { method: 'viewport' });
      observer.disconnect();
    }, { threshold: 0.35 });
    observer.observe(itinerary);
  };

  const trackTravelOpens = () => {
    const travel = document.querySelector('[data-optional-module="travel"]');
    if (!travel || travel.hidden) return;
    travel.querySelectorAll('details').forEach((details, index) => {
      details.addEventListener('toggle', () => {
        if (!details.open) return;
        const summary = details.querySelector('summary')?.textContent?.trim() || `item-${index + 1}`;
        track('travel_open', { item: summary });
      });
    });
  };

  class PostcardDeck {
    constructor(root) {
      this.root = root;
      this.cards = [...root.querySelectorAll('[data-card]')];
      this.prev = root.querySelector('[data-prev]');
      this.next = root.querySelector('[data-next]');
      this.index = 0;
      this.prev?.addEventListener('click', () => this.show(this.index - 1));
      this.next?.addEventListener('click', () => this.show(this.index + 1));
      this.show(0, false);
    }

    show(index, emit = true) {
      this.index = Math.max(0, Math.min(index, this.cards.length - 1));
      this.cards.forEach((card, i) => {
        const active = i === this.index;
        card.hidden = !active;
        card.classList.toggle('is-current', active);
      });
      if (this.prev) this.prev.disabled = this.index === 0;
      if (this.next) {
        this.next.disabled = this.index === this.cards.length - 1;
        this.next.textContent = this.index === this.cards.length - 1 ? 'All postcards viewed' : 'Next postcard';
      }
      if (emit) track('postcard_next', { cardIndex: this.index });
    }
  }

  class CalendarAction {
    constructor(link) {
      this.link = link;
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const key = link.dataset.calendar;
        const events = {
          welcome: { title: 'Welcome Dinner', start: '20270218T133000Z', end: '20270218T160000Z' },
          wedding: { title: 'Wedding Ceremony', start: '20270219T113000Z', end: '20270219T153000Z' }
        };
        const item = events[key];
        if (!item) return;
        const url = new URL('https://calendar.google.com/calendar/render');
        url.searchParams.set('action', 'TEMPLATE');
        url.searchParams.set('text', item.title);
        url.searchParams.set('dates', `${item.start}/${item.end}`);
        url.searchParams.set('location', 'Jaipur, India');
        track('calendar_add', { eventKey: key });
        window.open(url.toString(), '_blank', 'noopener');
      });
    }
  }

  class RSVPPanel {
    constructor(form) {
      this.form = form;
      this.status = form.querySelector('[data-rsvp-status]');
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        const data = Object.fromEntries(new FormData(form));
        if (this.status) this.status.textContent = 'Prototype only — RSVP captured locally for interaction testing, not submitted.';
        track('rsvp_complete', { attendance: data.attendance, partySize: data.partySize });
      });
      form.addEventListener('focusin', () => track('rsvp_start'), { once: true });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    track('invite_open', { template: 'postcards-from-us' });
    applyOptionalModules(readConfig());

    const deck = document.querySelector('[data-postcard-deck]');
    if (deck) new PostcardDeck(deck);
    document.querySelectorAll('[data-calendar]').forEach((link) => new CalendarAction(link));
    const rsvp = document.querySelector('[data-rsvp-panel]');
    if (rsvp) new RSVPPanel(rsvp);
    document.querySelectorAll('[data-track]').forEach((node) => node.addEventListener('click', () => track(node.dataset.track)));

    trackItineraryView();
    trackTravelOpens();

    const share = document.querySelector('[data-share]');
    share?.addEventListener('click', async () => {
      track('share_click');
      const payload = { title: document.title, text: 'Maya & Arjun — Jaipur wedding invitation', url: window.location.href };
      if (navigator.share) {
        try { await navigator.share(payload); } catch (_) {}
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        share.textContent = 'Link copied';
      }
    });

    const memoryAction = document.querySelector('[data-memory-action]');
    memoryAction?.addEventListener('click', () => {
      const status = document.querySelector('[data-memory-status]');
      if (status) status.textContent = 'Prototype only — memory mode is enabled; no guest media is uploaded.';
      track('gallery_open', { source: 'memory' });
      track('memory_open');
    });

    activatePhaseDeepLink();
  });
})();