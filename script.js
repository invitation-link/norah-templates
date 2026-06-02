/* ============================================
   NORAH - 3-Screen Cinematic Experience
   ============================================ */
(function () {
  'use strict';

  var state = {
    doorOpened: false,
    audio: null,
    audioPlaying: false
  };

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    setupDoorInteraction();
    setupScrollObserver();
    setupRSVPModal();
    setupSeeYouButton();
    setupScrollProgress();
    setupEnvironmentalDepth();
    setupCountdown();
    setupAddToCalendar();
  }

  /* ---- AUDIO (real file) ---- */
  function startMusic() {
    if (state.audio) return;
    var a = document.createElement('audio');
    a.src = 'assets/audio/bg-music.mp4';
    a.loop = true;
    a.volume = 0.35;
    a.setAttribute('playsinline', '');
    state.audio = a;
    var p = a.play();
    if (p && p.catch) p.catch(function () { /* autoplay blocked, ok */ });
    state.audioPlaying = true;
  }

  /* ---- DOOR ---- */
  function setupDoorInteraction() {
    var cta = document.getElementById('doorCta');
    if (!cta) return;

    function openDoor(e) {
      e.preventDefault();
      if (state.doorOpened) return;
      state.doorOpened = true;

      if (navigator.vibrate) navigator.vibrate(30);

      cta.style.transform = 'scale(0.88)';
      setTimeout(function () { cta.style.transform = ''; }, 250);

      // Auto-start music
      startMusic();

      // Golden transition
      var overlay = document.getElementById('doorTransition');
      overlay.classList.add('door-transition-overlay--active');

      var door = document.getElementById('screen-door');
      door.style.transition = 'opacity 2.4s cubic-bezier(.25,.1,.25,1), transform 2.8s cubic-bezier(.25,.1,.25,1)';
      setTimeout(function () {
        door.style.opacity = '0';
        door.style.transform = 'scale(1.06)';
      }, 350);

      setTimeout(spawnPetals, 600);

      setTimeout(function () {
        door.classList.add('screen--hidden');
        var inv = document.getElementById('screen-invitation');
        var cls = document.getElementById('screen-closing');
        if (inv) inv.classList.remove('screen--hidden');
        if (cls) cls.classList.remove('screen--hidden');
        overlay.classList.remove('door-transition-overlay--active');

        triggerReveals(inv);
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 2600);
    }

    cta.addEventListener('click', openDoor);
    cta.addEventListener('touchend', function (e) { e.preventDefault(); openDoor(e); });
    cta.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDoor(e); }
    });
  }

  /* ---- PETALS ---- */
  function spawnPetals() {
    var c = document.getElementById('petalBurst');
    if (!c) return;
    var colors = ['rgba(196,163,90,0.45)', 'rgba(212,185,120,0.35)', 'rgba(250,230,200,0.45)', 'rgba(184,160,128,0.35)'];
    for (var i = 0; i < 24; i++) {
      var p = document.createElement('div');
      p.className = 'petal';
      var s = 8 + Math.random() * 10;
      var x = 25 + Math.random() * 50;
      var drift = (Math.random() - 0.5) * 120;
      var spin = (Math.random() * 360) + 'deg';
      var dur = 2.5 + Math.random() * 2;
      p.style.cssText = 'width:' + s + 'px;height:' + s + 'px;left:' + x + '%;top:12%;' +
        'background:' + colors[i % colors.length] + ';--drift:' + drift + 'px;--spin:' + spin + ';' +
        'animation:petalFall ' + dur + 's ease-out ' + (i * 0.06) + 's forwards;';
      c.appendChild(p);
    }
    setTimeout(function () { c.innerHTML = ''; }, 5000);
  }

  /* ---- COUNTDOWN TIMER ---- */
  function setupCountdown() {
    var target = new Date('2026-07-25T12:00:00+05:30').getTime();
    var daysEl = document.getElementById('countDays');
    var hoursEl = document.getElementById('countHours');
    var minsEl = document.getElementById('countMins');
    var secsEl = document.getElementById('countSecs');
    if (!daysEl) return;

    function update() {
      var now = Date.now();
      var diff = Math.max(0, target - now);
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      daysEl.textContent = d < 10 ? '0' + d : d;
      hoursEl.textContent = h < 10 ? '0' + h : h;
      minsEl.textContent = m < 10 ? '0' + m : m;
      secsEl.textContent = s < 10 ? '0' + s : s;
    }
    update();
    setInterval(update, 1000);
  }

  /* ---- ADD TO CALENDAR ---- */
  function setupAddToCalendar() {
    var btn = document.getElementById('addCalendarBtn');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      // Generate .ics file content
      var ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//NORAH//Housewarming//EN',
        'BEGIN:VEVENT',
        'DTSTART:20260725T063000Z',
        'DTEND:20260725T123000Z',
        'SUMMARY:NORAH Housewarming Celebration',
        'DESCRIPTION:You are warmly invited to the housewarming of NORAH by Joylin & Noel Monis.',
        'LOCATION:Flat No. 505\\, Kalkura Heights\\, Opp. Robosoft Technologies\\, NH66\\, Santekatte\\, Udupi - 576105',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      var blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'NORAH-Housewarming.ics';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast('Calendar event downloaded!');
      if (navigator.vibrate) navigator.vibrate(15);
    });
  }

  /* ---- SCROLL REVEAL ---- */
  function setupScrollObserver() {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add('reveal--visible');
      });
    }, { rootMargin: '0px 0px -30px 0px', threshold: 0.06 });
    document.querySelectorAll('.reveal').forEach(function (el) { obs.observe(el); });
  }

  function triggerReveals(screen) {
    if (!screen) return;
    screen.querySelectorAll('.reveal').forEach(function (el, i) {
      setTimeout(function () { el.classList.add('reveal--visible'); }, 150 + i * 120);
    });
  }

  /* ---- RSVP MODAL ---- */
  function setupRSVPModal() {
    var modal = document.getElementById('rsvpModal');
    var openBtn = document.getElementById('rsvpBtn');
    var closeBtn = document.getElementById('modalClose');
    if (!modal || !openBtn) return;

    openBtn.addEventListener('click', function (e) { e.preventDefault(); openModal(); });
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });

    var options = document.querySelectorAll('.rsvp-option');
    options.forEach(function (opt) {
      opt.addEventListener('click', function () {
        if (navigator.vibrate) navigator.vibrate(15);
        options.forEach(function (o) { o.classList.remove('rsvp-option--selected'); });
        opt.classList.add('rsvp-option--selected');
        opt.style.transform = 'scale(0.97)';
        setTimeout(function () { opt.style.transform = ''; }, 200);

        if (opt.dataset.rsvp === 'attending') spawnConfettiBurst();
        showToast('Opening WhatsApp...');
      });
    });

    // Swipe to close
    var content = modal.querySelector('.modal-content');
    var startY = 0;
    content.addEventListener('touchstart', function (e) { startY = e.touches[0].clientY; }, { passive: true });
    content.addEventListener('touchmove', function (e) {
      var dy = e.touches[0].clientY - startY;
      if (dy > 0 && content.scrollTop <= 0) {
        content.style.transform = 'translateY(' + Math.min(dy * 0.5, 150) + 'px)';
      }
    }, { passive: true });
    content.addEventListener('touchend', function (e) {
      var dy = e.changedTouches[0].clientY - startY;
      if (dy > 100 && content.scrollTop <= 0) closeModal();
      else content.style.transform = '';
    });
  }

  function openModal() {
    document.getElementById('rsvpModal').classList.add('modal-overlay--active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    var m = document.getElementById('rsvpModal');
    m.classList.remove('modal-overlay--active');
    document.body.style.overflow = '';
    setTimeout(function () {
      var c = m.querySelector('.modal-content');
      if (c) c.style.transform = '';
    }, 600);
  }

  /* ---- CONFETTI BURST (enhanced) ---- */
  function spawnConfettiBurst() {
    var c = document.getElementById('confettiContainer');
    if (!c) return;
    var colors = ['#6B2036', '#C4A35A', '#D4B978', '#8B3A52', '#FAF6F1', '#B8A080'];
    for (var i = 0; i < 60; i++) {
      var piece = document.createElement('div');
      piece.className = 'confetti-piece';
      var x = 30 + Math.random() * 40;
      var size = 5 + Math.random() * 8;
      var fallY = 60 + Math.random() * 40;
      var driftX = (Math.random() - 0.5) * 200;
      var spin = (Math.random() * 1080) + 'deg';
      var dur = 1.8 + Math.random() * 1.5;
      var color = colors[Math.floor(Math.random() * colors.length)];
      var borderR = Math.random() > 0.5 ? '50%' : '2px';
      piece.style.cssText =
        'left:' + x + '%;top:25%;width:' + size + 'px;height:' + size + 'px;' +
        'background:' + color + ';border-radius:' + borderR + ';' +
        '--fall-y:' + fallY + 'vh;--drift-x:' + driftX + 'px;--spin:' + spin + ';' +
        'animation:confettiBurst ' + dur + 's ease-out ' + (i * 0.02) + 's forwards;';
      c.appendChild(piece);
    }
    setTimeout(function () { c.innerHTML = ''; }, 5000);
  }

  /* ---- SEE YOU ---- */
  function setupSeeYouButton() {
    var btn = document.getElementById('seeYouBtn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (navigator.vibrate) navigator.vibrate(20);
      spawnConfettiBurst();
      showToast('See you at NORAH!');
      setTimeout(function () { window.scrollTo({ top: 0, behavior: 'smooth' }); }, 2000);
    });
  }

  /* ---- SCROLL PROGRESS ---- */
  function setupScrollProgress() {
    var bar = document.getElementById('scrollProgress');
    if (!bar) return;
    window.addEventListener('scroll', function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? Math.min((window.scrollY / h) * 100, 100) : 0) + '%';
    }, { passive: true });
  }

  /* ---- ENVIRONMENTAL DEPTH ---- */
  function setupEnvironmentalDepth() {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        document.querySelectorAll('.screen:not(.screen--hidden)').forEach(function (s) {
          var bg = s.querySelector('.screen__bg img');
          if (bg) {
            var r = s.getBoundingClientRect();
            var off = (r.top + r.height / 2 - window.innerHeight / 2) * 0.03;
            bg.style.transform = 'translateY(' + off + 'px) scale(1.05)';
          }
        });
        ticking = false;
      });
    }, { passive: true });

    function handlePointer(x, y) {
      var dx = (x / window.innerWidth - 0.5) * 2;
      var dy = (y / window.innerHeight - 0.5) * 2;
      document.querySelectorAll('.sunlight-beam').forEach(function (b) {
        b.style.transform = 'translate(' + (dx * 8) + 'px,' + (dy * 5) + 'px)';
      });
    }
    document.addEventListener('mousemove', function (e) { handlePointer(e.clientX, e.clientY); }, { passive: true });
    document.addEventListener('touchmove', function (e) {
      if (e.touches.length === 1) handlePointer(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', function (e) {
        if (e.gamma == null || e.beta == null) return;
        var tiltX = Math.max(-15, Math.min(15, e.gamma)) / 15;
        var tiltY = Math.max(-15, Math.min(15, e.beta - 45)) / 15;
        document.querySelectorAll('.sunlight-beam').forEach(function (b) {
          b.style.transform = 'translate(' + (tiltX * 10) + 'px,' + (tiltY * 6) + 'px)';
        });
      }, { passive: true });
    }
  }

  /* ---- TOAST ---- */
  function showToast(msg) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('toast--visible');
    setTimeout(function () { t.classList.remove('toast--visible'); }, 3000);
  }

})();
