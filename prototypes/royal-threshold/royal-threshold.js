(() => {
  const frame = document.querySelector('[data-reveal-controller]');
  const revealButton = document.querySelector('[data-reveal-action]');
  const doors = document.querySelectorAll('[data-door]');
  const revealed = document.querySelectorAll('[data-revealed]');
  const status = document.querySelector('[data-rsvp-status]');

  const open = () => {
    if (!frame || frame.classList.contains('is-open')) return;
    frame.classList.add('is-open');
    revealButton?.setAttribute('aria-expanded', 'true');
    revealButton && (revealButton.textContent = 'Celebration opened');
    revealed.forEach((node) => { node.hidden = false; });
    window.dispatchEvent(new CustomEvent('invitelink:analytics', { detail: { event: 'reveal_complete', template: 'royal-threshold' } }));
  };

  revealButton?.addEventListener('click', open);
  doors.forEach((door) => door.addEventListener('click', open));

  document.querySelectorAll('[data-calendar-event]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const eventName = link.dataset.calendarEvent || 'wedding';
      const details = {
        haldi: ['Haldi Morning', '20261211T043000Z', '20261211T063000Z'],
        sangeet: ['Sangeet Under the Stars', '20261211T133000Z', '20261211T163000Z'],
        wedding: ['Wedding Ceremony', '20261212T120000Z', '20261212T153000Z']
      }[eventName];
      if (!details) return;
      const url = new URL('https://calendar.google.com/calendar/render');
      url.searchParams.set('action', 'TEMPLATE');
      url.searchParams.set('text', details[0]);
      url.searchParams.set('dates', `${details[1]}/${details[2]}`);
      url.searchParams.set('location', 'Udaipur, Rajasthan');
      window.open(url.toString(), '_blank', 'noopener');
    });
  });

  document.querySelector('[data-rsvp-panel]')?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (status) status.textContent = 'Prototype only — RSVP interaction validated locally; no response was submitted.';
    window.dispatchEvent(new CustomEvent('invitelink:analytics', { detail: { event: 'rsvp_complete', template: 'royal-threshold', prototype: true } }));
  });

  document.querySelector('[data-share]')?.addEventListener('click', async () => {
    const payload = { title: 'Royal Threshold', text: 'InviteLink Royal Threshold prototype', url: location.href };
    try {
      if (navigator.share) await navigator.share(payload);
      else await navigator.clipboard?.writeText(location.href);
    } catch (_) {}
  });

  window.dispatchEvent(new CustomEvent('invitelink:analytics', { detail: { event: 'invite_open', template: 'royal-threshold', prototype: true } }));
})();