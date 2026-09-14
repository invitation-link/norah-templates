(() => {
  const stars = [...document.querySelectorAll('[data-star]')];
  const lines = [...document.querySelectorAll('[data-line]')];
  const status = document.querySelector('[data-story-status]');
  const continueButton = document.querySelector('[data-continue]');
  const revealFocus = document.querySelector('[data-reveal-focus]');
  const rsvpForm = document.querySelector('[data-rsvp-panel]');
  const rsvpStatus = document.querySelector('[data-rsvp-status]');
  const shareButton = document.querySelector('[data-share]');
  let progress = -1;

  function track(event, extra = {}) {
    window.dispatchEvent(new CustomEvent('invitelink:analytics', { detail: { event, template: 'constellation', ...extra } }));
  }

  function selectStar(index) {
    progress = Math.max(progress, index);
    stars.forEach((star, i) => star.setAttribute('aria-pressed', i <= progress ? 'true' : 'false'));
    lines.forEach((line, i) => line.classList.toggle('is-drawn', i < progress + 1));
    if (status) status.textContent = progress >= stars.length - 1 ? 'The story is connected. Continue to the celebration details.' : `Story point ${index + 1} of ${stars.length} selected.`;
    track('milestone_view', { milestone: index + 1 });
  }

  stars.forEach((star, index) => star.addEventListener('click', () => selectStar(index)));

  continueButton?.addEventListener('click', () => {
    document.querySelector('#events')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    requestAnimationFrame(() => revealFocus?.focus({ preventScroll: true }));
    track('constellation_complete');
  });

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

  rsvpForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(rsvpForm);
    rsvpStatus.textContent = form.get('attendance') === 'yes' ? 'RSVP saved for this prototype. Production will submit to InviteLink guest state.' : 'Response saved for this prototype. Production will submit to InviteLink guest state.';
    track('rsvp_complete', { attendance: form.get('attendance') });
  });

  shareButton?.addEventListener('click', async () => {
    try {
      if (navigator.share) await navigator.share({ title: document.title, url: location.href });
      else await navigator.clipboard?.writeText(location.href);
      track('share');
    } catch (_) {}
  });

  track('invite_open');
})();
