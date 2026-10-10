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
    track('reveal_complete', { mechanic: 'constellation', completed_points: progress + 1 });
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
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//InviteLink//Constellation Prototype//EN',
      'BEGIN:VEVENT', `UID:${button.dataset.calendar}-${date}@invitelink.shop`,
      `DTSTAMP:${stamp}`, `DTSTART:${date}`, `DTEND:${end}`,
      `SUMMARY:${label}`, 'END:VEVENT', 'END:VCALENDAR', ''
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${button.dataset.calendar}.ics`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
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
    rsvpStatus.textContent = 'Preview only — this response was not saved or sent. Please contact the host to RSVP.';
    track('rsvp_preview', { attendance: form.get('attendance') });
  });

  function showShareFallback(message) {
    let panel = document.querySelector('[data-share-fallback]');
    if (!panel) {
      panel = document.createElement('div');
      panel.setAttribute('data-share-fallback', '');
      const note = document.createElement('p');
      note.setAttribute('role', 'status');
      note.setAttribute('aria-live', 'polite');
      note.setAttribute('data-share-note', '');
      const label = document.createElement('label');
      label.textContent = 'Invitation link';
      const input = document.createElement('input');
      input.type = 'url';
      input.readOnly = true;
      input.setAttribute('aria-label', 'Invitation link — select and copy');
      input.setAttribute('data-share-url', '');
      label.append(input);
      panel.append(note, label);
      document.querySelector('.closing')?.append(panel);
    }
    const input = panel.querySelector('[data-share-url]');
    panel.querySelector('[data-share-note]').textContent = message;
    input.value = location.href;
    panel.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    input.focus({ preventScroll: true });
    input.select();
  }

  shareButton?.addEventListener('click', async () => {
    track('share_tap');
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ title: document.title, url: location.href });
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(location.href);
        showShareFallback('Invitation link copied. You can also select it below.');
        return;
      }
    } catch (error) {
      if (error?.name === 'AbortError') return;
    }
    showShareFallback('Select the invitation link below and copy it manually.');
  });

  track('invitation_open');
})();
