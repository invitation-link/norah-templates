/* ============================================
   NORAH Template Platform — Dynamic Invitation Renderer
   ============================================ */

(function () {
  'use strict';

  // Supabase Credentials
  const SUPABASE_URL = "https://saxnxzfwufzilnsttnwa.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNheG54emZ3dWZ6aWxuc3R0bndhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyMDU0OTMsImV4cCI6MjA5NTc4MTQ5M30._Kv4_OHLkyiyF3Ck3tmlxDaC8CPPbLV34xfp5N-kctU";
  let supabaseClient = null;

  var state = {
    doorOpened: false,
    audio: null,
    audioPlaying: false,
    data: null
  };

  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    // 1. Initialize Supabase
    if (typeof supabase !== 'undefined') {
      supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    } else {
      console.error("Supabase client not loaded!");
      showToast("Connection error. Please refresh.");
      return;
    }

    // 2. Fetch invitation data
    const slug = getSlugFromPath();
    if (!slug) {
      // Check if we are in preview mode inside the builder iframe
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'preview') {
        // Wait for postMessage updates
        window.addEventListener('message', function(event) {
          if (event.data && event.data.type === 'preview') {
            renderInvitation(event.data.payload);
          }
        });
        // Request initial data from parent
        window.parent.postMessage({ type: 'preview_ready' }, '*');
        return;
      }
      showError("No invitation selected. Please check your link.");
      return;
    }

    try {
      const { data, error } = await supabaseClient
        .from('invitations')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error || !data) {
        showError("Invitation not found. Please check the URL.");
        return;
      }

      state.data = data;
      renderInvitation(data);
    } catch (err) {
      console.error(err);
      showError("Failed to load invitation. Please try again.");
    }
  }

  function getSlugFromPath() {
    // Expected path: /invite/xyz
    const pathParts = window.location.pathname.split('/');
    const inviteIndex = pathParts.indexOf('invite');
    if (inviteIndex !== -1 && pathParts[inviteIndex + 1]) {
      return pathParts[inviteIndex + 1];
    }
    // Fallback: query parameter ?slug=xyz
    const params = new URLSearchParams(window.location.search);
    return params.get('slug') || params.get('id');
  }

  function showError(msg) {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.innerHTML = `
        <div style="text-align:center; padding: 24px; max-width: 320px;">
          <h2 style="color:#6B2036; margin-bottom:12px; font-size:24px;">Oops!</h2>
          <p style="color:#6B5A4E; font-size:16px; line-height:1.5; margin-bottom:20px;">${msg}</p>
          <a href="/" style="display:inline-block; padding:12px 24px; background:#6B2036; color:#fff; text-decoration:none; border-radius:30px; font-family:sans-serif; font-size:13px; font-weight:600; letter-spacing:1px; text-transform:uppercase;">Create Your Own</a>
        </div>
      `;
    }
  }

  function renderInvitation(data) {
    // Set Document Title
    document.title = `${data.home_name} — Home Celebration`;

    // Apply Colors
    if (data.color_primary) {
      document.documentElement.style.setProperty('--maroon', data.color_primary);
      // Derive soft/deep maroon or use primary directly
      document.documentElement.style.setProperty('--maroon-soft', data.color_primary);
      document.documentElement.style.setProperty('--maroon-deep', data.color_primary);
    }
    if (data.color_accent) {
      document.documentElement.style.setProperty('--gold', data.color_accent);
      document.documentElement.style.setProperty('--gold-muted', data.color_accent);
      document.documentElement.style.setProperty('--gold-light', data.color_accent);
    }

    // Set Images (fallbacks to defaults if not set)
    document.getElementById('bgDoor').src = data.bg_image_door || 'https://norah-housewarming.vercel.app/assets/images/door-scene.webp';
    document.getElementById('bgInvite').src = data.bg_image_invite || 'https://norah-housewarming.vercel.app/assets/images/bg-curtain-flowers.webp';
    document.getElementById('bgClosing').src = data.bg_image_closing || 'https://norah-housewarming.vercel.app/assets/images/bg-evening-warmth.webp';

    // Populate Fields
    document.getElementById('doorWelcome').textContent = data.welcome_text || 'Welcome to';
    document.getElementById('doorTitle').textContent = data.home_name;
    document.getElementById('invitationHosts').textContent = data.hosts;
    document.getElementById('invitationInvite').innerHTML = data.invite_text ? data.invite_text.replace(/\n/g, '<br>') : 'invite you to bless our new home.';
    document.getElementById('invitationName').textContent = data.home_name;
    document.getElementById('modalTitle').textContent = data.home_name;

    // Date/Time
    const dateFormatted = formatDate(data.event_date);
    document.getElementById('detailDate').textContent = dateFormatted;
    document.getElementById('detailTime').textContent = data.event_time;
    document.getElementById('detailTimeExtra').textContent = "Followed by Celebrations";

    // Venue
    document.getElementById('detailVenueName').textContent = data.venue_name || '';
    document.getElementById('detailVenueAddress').innerHTML = data.venue_address ? data.venue_address.replace(/\n/g, '<br>') : '';
    
    if (data.venue_maps_url) {
      document.getElementById('directionsBtn').href = data.venue_maps_url;
      document.getElementById('directionsBtn').style.display = 'flex';
    } else {
      document.getElementById('directionsBtn').style.display = 'none';
    }

    // Closing Screen
    if (data.show_bible_verse && data.bible_verse) {
      document.getElementById('doorScripture').style.display = 'block';
      document.getElementById('scriptureText').innerHTML = `&ldquo;${data.bible_verse}&rdquo;`;
      document.getElementById('scriptureRef').textContent = data.bible_ref ? `— ${data.bible_ref}` : '';
    } else {
      document.getElementById('doorScripture').style.display = 'none';
    }

    document.getElementById('closingQuote').innerHTML = data.closing_quote ? data.closing_quote.replace(/\n/g, '<br>') : 'A home is made of moments and people.';
    document.getElementById('closingSubquote').innerHTML = data.closing_subtext ? data.closing_subtext.replace(/\n/g, '<br>') : 'Thank you for becoming part of ours.';
    
    document.getElementById('hostsCardNames').textContent = data.hosts;
    document.getElementById('modalContactName').textContent = data.hosts;

    // Presents in blessings only
    if (data.show_presence_note && data.presence_note) {
      document.getElementById('presenceNote').textContent = `"${data.presence_note}"`;
      document.getElementById('presenceNote').style.display = 'block';
    } else {
      document.getElementById('presenceNote').style.display = 'none';
    }

    // Phone / RSVP URLs
    if (data.phone) {
      const cleanPhone = data.phone.replace(/\D/g, '');
      document.getElementById('modalContactPhone').href = `tel:${cleanPhone}`;
      document.getElementById('modalContactPhone').textContent = `📞 ${data.phone}`;

      const hostEscaped = encodeURIComponent(data.hosts);
      const homeEscaped = encodeURIComponent(data.home_name);

      document.getElementById('rsvpAttending').href = `https://wa.me/${cleanPhone}?text=Hi%20${hostEscaped}!%20🏡%20We%20will%20gladly%20be%20there%20for%20the%20housewarming%20of%20${homeEscaped}!%20❤️`;
      document.getElementById('rsvpMaybe').href = `https://wa.me/${cleanPhone}?text=Hi%20${hostEscaped}!%20🏡%20We%20will%20try%20our%20best%20to%20make%20it%20to%20the%20housewarming!%20😊`;
      document.getElementById('rsvpBlessings').href = `https://wa.me/${cleanPhone}?text=Hi%20${hostEscaped}!%20🏡%20Sending%20our%20blessings%20and%20prayers%20for%20your%20beautiful%20new%20home%20${homeEscaped}!%20🙏`;
    }

    // Hide loader
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.style.display = 'none', 600);
    }

    // Initialize Animations & Interactions
    setupDoorInteraction();
    setupScrollObserver();
    setupRSVPModal();
    setupSeeYouButton();
    setupScrollProgress();
    setupEnvironmentalDepth();
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', options);
    } catch (e) {
      return dateStr;
    }
  }

  /* ---- AUDIO (real file) ---- */
  function startMusic() {
    if (state.audio) return;
    var a = document.createElement('audio');
    a.src = state.data.bg_music_url || 'https://norah-housewarming.vercel.app/assets/audio/bg-music.mp4';
    a.loop = true;
    a.volume = 0.35;
    a.setAttribute('playsinline', '');
    state.audio = a;
    var p = a.play();
    if (p && p.catch) p.catch(function () { /* autoplay blocked, ok */ });
    state.audioPlaying = true;
    
    // Toggle class
    document.getElementById('audioToggle').classList.add('audio-toggle--playing');
    document.getElementById('audioToggle').classList.add('audio-toggle--visible');
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

        if (opt.id === 'rsvpAttending') spawnConfettiBurst();
        showToast('Opening WhatsApp...');
        setTimeout(() => closeModal(), 1000);
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

  /* ---- CONFETTI BURST ---- */
  function spawnConfettiBurst() {
    var c = document.getElementById('confettiContainer');
    if (!c) return;
    for (var i = 0; i < 48; i++) {
      var p = document.createElement('div');
      p.className = 'confetti';
      var w = 6 + Math.random() * 8;
      var h = 4 + Math.random() * 6;
      var left = 10 + Math.random() * 80;
      var delay = Math.random() * 0.4;
      var rot = Math.random() * 360;
      var colors = ['#6B2036', '#C4A35A', '#E8DDD0', '#8B3A52', '#D4B978'];
      p.style.cssText = 'width:' + w + 'px;height:' + h + 'px;left:' + left + '%;' +
        'background:' + colors[i % colors.length] + ';--rot:' + rot + 'deg;' +
        'animation:confettiFall 1.8s ease-out ' + delay + 's forwards;';
      c.appendChild(p);
    }
    setTimeout(function () { c.innerHTML = ''; }, 3500);
  }

  /* ---- SEE YOU BUTTON ---- */
  function setupSeeYouButton() {
    var btn = document.getElementById('seeYouBtn');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      spawnConfettiBurst();
      if (navigator.vibrate) navigator.vibrate([20, 50, 20]);
      showToast('We look forward to seeing you! ❤️');
    });
  }

  /* ---- SCROLL PROGRESS ---- */
  function setupScrollProgress() {
    var bar = document.getElementById('scrollProgress');
    if (!bar) return;
    window.addEventListener('scroll', function () {
      var h = document.documentElement;
      var st = h.scrollTop || document.body.scrollTop;
      var sh = h.scrollHeight || document.body.scrollHeight;
      var pct = (st / (sh - h.clientHeight)) * 100;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  /* ---- TOAST ---- */
  function showToast(msg) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('toast--visible');
    setTimeout(function () { t.classList.remove('toast--visible'); }, 3000);
  }

  /* ---- ENVIRONMENTAL DEPTH (parallax) ---- */
  function setupEnvironmentalDepth() {
    window.addEventListener('scroll', function () {
      var scrolled = window.pageYOffset;
      document.querySelectorAll('.screen__bg img').forEach(function (img) {
        var parent = img.closest('.screen');
        if (!parent || parent.classList.contains('screen--hidden')) return;
        var rect = parent.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          var y = (window.innerHeight - rect.top) * 0.08;
          img.style.transform = 'translate3d(0, ' + y + 'px, 0) scale(1.05)';
        }
      });
    }, { passive: true });
  }

  // Audio Toggle interaction
  document.getElementById('audioToggle').addEventListener('click', function () {
    if (!state.audio) return;
    if (state.audioPlaying) {
      state.audio.pause();
      state.audioPlaying = false;
      this.classList.remove('audio-toggle--playing');
      showToast('Music paused');
    } else {
      state.audio.play();
      state.audioPlaying = true;
      this.classList.add('audio-toggle--playing');
      showToast('Music playing');
    }
  });

})();
