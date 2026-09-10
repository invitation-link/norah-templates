(() => {
  const track = (event, detail = {}) => {
    window.dispatchEvent(new CustomEvent('invitelink:analytics', { detail: { event, ...detail } }));
    if (window.console) console.info('[InviteLink]', event, detail);
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
    const deck = document.querySelector('[data-postcard-deck]');
    if (deck) new PostcardDeck(deck);
    document.querySelectorAll('[data-calendar]').forEach((link) => new CalendarAction(link));
    const rsvp = document.querySelector('[data-rsvp-panel]');
    if (rsvp) new RSVPPanel(rsvp);
    document.querySelectorAll('[data-track]').forEach((node) => node.addEventListener('click', () => track(node.dataset.track)));
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
  });
})();