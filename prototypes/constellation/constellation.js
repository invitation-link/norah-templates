(() => {
  const stars = [...document.querySelectorAll('[data-star]')];
  const lines = [...document.querySelectorAll('[data-line]')];
  const status = document.querySelector('[data-story-status]');
  const continueButton = document.querySelector('[data-continue]');
  const revealFocus = document.querySelector('[data-reveal-focus]');
  const rsvpForm = document.querySelector('[data-rsvp-panel]');
  const rsvpStatus = document.querySelector('[data-rsvp-status]');
  const shareButton = document.querySelector('[data-share]');
  const eventCards = [...document.querySelectorAll('.event-card')];
  let progress = -1;
  let rsvpStarted = false;

  function track(event, extra = {}) {
    window.dispatchEvent(new CustomEvent('invitelink:analytics', { detail: { event, template: 'constellation', ...extra } }));
  }

  function renderProgress() {
    stars.forEach((star, i) => {
      const reached = i <= progress;
      const available = i <= progress + 1;
      star.setAttribute('aria-pressed', reached ? 'true' : 'false');
      star.disabled = !available;
    });
    // A connection exists only after both endpoints have been selected.
    lines.forEach((line, i) => line.classList.toggle('is-drawn', i < progress));
  }

  function selectStar(index) {
    if (index > progress + 1) {
      if (status) status.textContent = 'Select the next illuminated story point first.';
      return;
    }

    if (index <= progress) {
      if (status) status.textContent = `Story point ${index + 1} of ${stars.length} is already connected.`;
      return;
    }

    if (progress === -1) track('constellation_start');
    progress = index;
    renderProgress();

    if (status) {
      status.textContent = progress >= stars.length - 1
        ? 'The story is connected. Continue to the celebration details.'
        : `Story point ${index + 1} of ${stars.length} selected. Choose the next illuminated point.`;
    }
    track('milestone_view', { milestone: index + 1 });
  }

  renderProgress();
  stars.forEach((star, index) => star.addEventListener('click', () => selectStar(index)));

  continueButton?.addEventListener('click', () => {
    document.querySelector('#events')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    requestAnimationFrame(() => revealFocus?.focus({ preventScroll: true }));
    track('constellation_complete', { completed_points: progress + 1 });
  });

  if ('IntersectionObserver' in window && eventCards.length) {
    const seen = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = eventCards.indexOf(entry.target);
        if (index < 0 || seen.has(index)) return;
        seen.add(index);
        track('event_view', { event_index: index + 1 });
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    eventCards.forEach((card) => observer.observe(card));
  }

  document.querySelectorAll('[data-track="map_click"]').forEach((link, index) => link.addEventListener('click', () => {
    track('map_click', { event_index: index + 1 });
  }));

  document.querySelectorAll('[data-calendar]').forEach((button) => button.addEventListener('click', () => {
    const label = button.dataset.calendar === 'wedding' ? 'Wedding Ceremony' : 'Welcome Evening';
    const date = button.dataset.calendar === 'wedding' ? '20270221T120000Z' : '20270220T133000Z';
    const end = button.dataset.calendar === 'wedding' ? '20270221T150000Z' : '20270220T163000Z';
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${label}\nDTSTART:${date}\nDTEND:${end}\nLOCATION:Hyderabad\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${button.dataset.calendar}.ics`;
    link.click();
    URL.revokeObjectURL(url);
    track('calendar_add', { event_id: button.dataset.calendar });
  }));

  rsvpForm?.addEventListener('input', () => {
    if (rsvpStarted) return;
    rsvpStarted = true;
    track('rsvp_start');
  }, { once: false });

  rsvpForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(rsvpForm);
    rsvpStatus.textContent = form.get('attendance') === 'yes'
      ? 'RSVP saved for this prototype. Production will submit to InviteLink guest state.'
      : 'Response saved for this prototype. Production will submit to InviteLink guest state.';
    track('rsvp_complete', { attendance: form.get('attendance') });
  });

  shareButton?.addEventListener('click', async () => {
    try {
      if (navigator.share) await navigator.share({ title: document.title, url: location.href });
      else if (navigator.clipboard) await navigator.clipboard.writeText(location.href);
      track('share');
    } catch (_) {}
  });

  track('invite_open');
})();
