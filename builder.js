/* ============================================
   Invite Link — Builder Logic
   ============================================ */

(function () {
  'use strict';

  // Supabase Credentials
  const SUPABASE_URL = "https://azzmxahqrxpfqzwqvqht.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6em14YWhxcnhwZnF6d3F2cWh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyMjAwMjAsImV4cCI6MjA4Mzc5NjAyMH0.x5vi93oBPeCxRKaS5_Js5gUutXhdB2AbNLC3lqzS0to";
  let supabaseClient = null;

  const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
  const MAX_AUDIO_BYTES = 15 * 1024 * 1024;
  const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
  const AUDIO_TYPES = new Set(['audio/mpeg', 'audio/mp4', 'audio/ogg', 'audio/wav', 'audio/x-wav']);
  const FILE_EXTENSIONS = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/avif': 'avif',
    'audio/mpeg': 'mp3',
    'audio/mp4': 'm4a',
    'audio/ogg': 'ogg',
    'audio/wav': 'wav',
    'audio/x-wav': 'wav'
  };

  const ALLOWED_DB_FIELDS = new Set([
    'slug',
    'event_type',
    'home_name',
    'welcome_text',
    'invite_eyebrow',
    'hosts',
    'invite_text',
    'event_date',
    'event_time',
    'detail_time_extra',
    'venue_name',
    'venue_address',
    'venue_maps_url',
    'phone',
    'color_primary',
    'color_accent',
    'bg_image_door',
    'bg_image_invite',
    'bg_image_closing',
    'bg_music_url',
    'show_bible_verse',
    'bible_verse',
    'bible_ref',
    'closing_heading',
    'closing_quote',
    'closing_subtext',
    'hosts_tagline',
    'see_you_btn_text',
    'show_presence_note',
    'presence_note',
    'rsvp_option1_title',
    'rsvp_option1_subtitle',
    'rsvp_option2_title',
    'rsvp_option2_subtitle',
    'rsvp_option3_title',
    'rsvp_option3_subtitle',
    'modal_contact_blessing',
    'gesture',
    'is_published'
  ]);

  function sanitizeDbPayload(raw) {
    const clean = {};
    for (const key of Object.keys(raw)) {
      if (ALLOWED_DB_FIELDS.has(key)) {
        clean[key] = raw[key];
      }
    }
    clean.is_published = true;
    return clean;
  }

  // Theme presets definitions for background assets
  const THEME_PRESETS = {
    housewarming: {
      door: [
        { name: "Welcoming Interior", url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80" },
        { name: "Modern Coffee Corner", url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80" },
        { name: "Cozy Welcoming Door", url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80" }
      ],
      invite: [
        { name: "Modern Home", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80" },
        { name: "Family Dining Area", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80" }
      ],
      closing: [
        { name: "Warm Evening Candle Glow", url: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=800&q=80" },
        { name: "Peaceful Reading Corner", url: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&q=80" }
      ],
      music: [
        { name: "Instrumental Acoustic Guitar", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" }
      ]
    },
    wedding: {
      door: [
        { name: "Elegant Floral Entrance", url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800" },
        { name: "Romantic Floral Setting", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800" },
        { name: "Wedding Detail", url: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800" }
      ],
      invite: [
        { name: "Romantic Rose Petals", url: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800" },
        { name: "Elegant Floral Curtain", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800" }
      ],
      closing: [
        { name: "Celebration Sparkle", url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800" },
        { name: "Elegant Celebration", url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800" }
      ],
      music: [
        { name: "Romantic Wedding Waltz", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" }
      ]
    },
    birthday: {
      door: [
        { name: "Milestone Celebration", url: "/assets/templates/birthday.webp" },
        { name: "Bright Party", url: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=800" },
        { name: "Night Sparklers", url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800" }
      ],
      invite: [
        { name: "Colorful Streamers & Glitter", url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800" },
        { name: "Party Friends Celebration", url: "/assets/templates/birthday.webp" }
      ],
      closing: [
        { name: "Golden Sparklers Night", url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800" },
        { name: "Bright Party Finish", url: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=800" }
      ],
      music: [
        { name: "Upbeat Party Anthem", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" }
      ]
    },
    babyshower: {
      door: [
        { name: "Expecting Parents Celebration", url: "/assets/templates/babyshower.webp" },
        { name: "Pastel Botanical Garden", url: "https://images.unsplash.com/photo-1520121401995-928cd50d4e27?w=800" },
        { name: "Gentle Celebration", url: "/assets/templates/babyshower.webp" }
      ],
      invite: [
        { name: "Eucalyptus Leaves & Flowers", url: "https://images.unsplash.com/photo-1520121401995-928cd50d4e27?w=800" },
        { name: "Gentle Floral Setting", url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800" }
      ],
      closing: [
        { name: "Warm Celebration Glow", url: "/assets/templates/babyshower.webp" },
        { name: "Gentle Floral Aura", url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800" }
      ],
      music: [
        { name: "Lullaby & Soft Harp Music", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
      ]
    }
  };

  // Default values for each theme
  const THEME_DEFAULTS = {
    housewarming: {
      home_name: "A NEW BEGINNING",
      welcome_text: "Welcome to",
      invite_eyebrow: "With Grateful Hearts,",
      invite_text: "invite you and your family to bless our new beginning.",
      rsvp_option1_title: "Gladly attending",
      rsvp_option1_subtitle: "We will be there!",
      rsvp_option2_title: "Will try to come",
      rsvp_option2_subtitle: "Trying our best!",
      rsvp_option3_title: "Sending blessings",
      rsvp_option3_subtitle: "In our prayers always.",
      modal_contact_blessing: "Your blessing means the world to us",
      bible_verse: "Whoever dwells in the shelter of the Most High will rest in the shadow of the Almighty.",
      bible_ref: "Psalm 91:1",
      closing_quote: "A home is made of moments and people.",
      closing_subtext: "Thank you for becoming part of ours.",
      hosts_tagline: "With Love & Gratitude",
      see_you_btn_text: "See You Soon",
      presence_note: "Presents in blessings only",
      color_primary: "#6B2036",
      color_accent: "#C4A35A",
      bg_image_door: "/assets/templates/housewarming.webp",
      bg_image_invite: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      bg_image_closing: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=800&q=80",
      bg_music_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
    },
    wedding: {
      home_name: "FOREVER & ALWAYS",
      welcome_text: "Welcome to the Wedding of",
      invite_eyebrow: "Together with our Families,",
      invite_text: "invite you to celebrate our union and new journey together.",
      rsvp_option1_title: "Joyfully accept",
      rsvp_option1_subtitle: "Can't wait to celebrate!",
      rsvp_option2_title: "Regretfully decline",
      rsvp_option2_subtitle: "Warmest wishes from afar.",
      rsvp_option3_title: "Sending love & prayers",
      rsvp_option3_subtitle: "Celebrating in spirit!",
      modal_contact_blessing: "Your love and presence is the greatest gift",
      bible_verse: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud.",
      bible_ref: "1 Corinthians 13:4",
      closing_quote: "Two lives, two hearts, joined in one love.",
      closing_subtext: "Thank you for sharing our special day.",
      hosts_tagline: "With Eternal Love & Thanks",
      see_you_btn_text: "Celebrate With Us",
      presence_note: "No gifts please, only your blessings",
      color_primary: "#541729",
      color_accent: "#D4B978",
      bg_image_door: "/assets/templates/wedding.webp",
      bg_image_invite: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=800",
      bg_image_closing: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800",
      bg_music_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    birthday: {
      home_name: "BIRTHDAY BASH",
      welcome_text: "You are Invited to",
      invite_eyebrow: "Let's Celebrate!",
      invite_text: "invite you to join us for a fun-filled day of cake, games, and laughter.",
      rsvp_option1_title: "Count me in!",
      rsvp_option1_subtitle: "Ready for the party!",
      rsvp_option2_title: "Maybe next time",
      rsvp_option2_subtitle: "Will let you know.",
      rsvp_option3_title: "Sending sweet wishes",
      rsvp_option3_subtitle: "Hope it's the best day!",
      modal_contact_blessing: "Come celebrate and make memories with us!",
      bible_verse: "Count your life by smiles, not tears. Count your age by friends, not years.",
      bible_ref: "John Lennon",
      closing_quote: "Cheers to another trip around the sun!",
      closing_subtext: "Let the birthday adventures begin.",
      hosts_tagline: "Party Hard & Have Fun",
      see_you_btn_text: "Let's Party!",
      presence_note: "Your presence is our present!",
      color_primary: "#1D4ED8",
      color_accent: "#F59E0B",
      bg_image_door: "/assets/templates/birthday.webp",
      bg_image_invite: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800",
      bg_image_closing: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800",
      bg_music_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    babyshower: {
      home_name: "LITTLE MIRACLE",
      welcome_text: "Welcome to the Baby Shower of",
      invite_eyebrow: "A Little One is on the Way!",
      invite_text: "invite you to shower the parents-to-be with love and blessings.",
      rsvp_option1_title: "Happily attending",
      rsvp_option1_subtitle: "Can't wait to celebrate!",
      rsvp_option2_title: "Warmly declining",
      rsvp_option2_subtitle: "Wishing you the absolute best.",
      rsvp_option3_title: "Sending baby love",
      rsvp_option3_subtitle: "In our thoughts and hearts!",
      modal_contact_blessing: "A grand adventure is about to begin",
      bible_verse: "Every good and perfect gift is from above, coming down from the Father of the heavenly lights.",
      bible_ref: "James 1:17",
      closing_quote: "Ten little fingers, ten little toes, with love and grace, our family grows.",
      closing_subtext: "Thank you for showering us with love.",
      hosts_tagline: "With Warmth & Excitement",
      see_you_btn_text: "Shower with Love",
      presence_note: "Gifts are welcome but not required",
      color_primary: "#EC4899",
      color_accent: "#06B6D4",
      bg_image_door: "/assets/templates/babyshower.webp",
      bg_image_invite: "https://images.unsplash.com/photo-1520121401995-928cd50d4e27?w=800",
      bg_image_closing: "/assets/templates/babyshower.webp",
    }
  };

  function syncLibrary() {
    const sharedLibrary = window.INVITE_TEMPLATE_LIBRARY;
    if (sharedLibrary) {
      if (sharedLibrary.presets) Object.assign(THEME_PRESETS, sharedLibrary.presets);
      if (sharedLibrary.defaults) Object.assign(THEME_DEFAULTS, sharedLibrary.defaults);
    }
  }

  // Initial sync if already loaded
  syncLibrary();

  let currentStep = 1;
  let activePresetScreen = null;
  let previewReady = false;

  function trackEvent(name, params = {}) {
    if (typeof window.inviteLinkTrack === 'function') {
      window.inviteLinkTrack(name, params);
    }
  }

  function getIframe() {
    return document.getElementById('previewIframe');
  }

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    syncLibrary();
    if (typeof supabase !== 'undefined') {
      supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    } else {
      console.error("Supabase script failed to load.");
      alert("Database client error. Please check your internet connection.");
      return;
    }

    setupStepNavigation();
    setupColorPickers();
    setupAssetControls();
    setupToggles();
    setupLivePreview();
    setupSlugGenerator();
    setupPresetModal();
    setupFaqModal();
    setupThemeSelector();
    setupOccasionActions();
    setupDraftPersistence();
    setupAnalyticsTracking();
    setupFormSubmission();
  }

  function setupAnalyticsTracking() {
    const form = document.getElementById('builderForm');
    if (!form) return;
    let hasStarted = false;
    const markStarted = () => {
      if (hasStarted) return;
      hasStarted = true;
      const theme = document.getElementById('templateTheme');
      trackEvent('customize_start', { item_id: theme ? theme.value : 'unknown' });
    };
    form.addEventListener('input', markStarted, { once: true });
    form.addEventListener('change', markStarted, { once: true });
  }

  // --- Step Navigation ---
  function setupStepNavigation() {
    const fieldsets = document.querySelectorAll('.step-fieldset');
    const dots = document.querySelectorAll('.step-dot');

    function showStep(stepNum) {
      fieldsets.forEach((fs, idx) => {
        if (idx + 1 === stepNum) {
          fs.classList.remove('hidden');
        } else {
          fs.classList.add('hidden');
        }
      });

      dots.forEach((dot, idx) => {
        if (idx + 1 === stepNum) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
      currentStep = stepNum;
      updatePreview();

      if (stepNum === 1) {
        changePreviewScreen('door');
      } else if (stepNum === 2) {
        changePreviewScreen('invite');
      } else if (stepNum === 3) {
        changePreviewScreen('door');
      }
    }

    document.querySelectorAll('.next-step').forEach(btn => {
      btn.addEventListener('click', () => {
        const currentFs = document.getElementById(`step-${currentStep}`);
        const inputs = currentFs.querySelectorAll('input[required], textarea[required]');
        let valid = true;
        inputs.forEach(input => {
          if (!input.value.trim()) {
            input.focus();
            valid = false;
          }
        });
        if (valid) {
          showStep(currentStep + 1);
        }
      });
    });

    document.querySelectorAll('.prev-step').forEach(btn => {
      btn.addEventListener('click', () => {
        showStep(currentStep - 1);
      });
    });

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const stepNum = parseInt(dot.dataset.step);
        if (stepNum < currentStep) {
          showStep(stepNum);
        } else if (stepNum > currentStep) {
          let canGo = true;
          for (let s = currentStep; s < stepNum; s++) {
            const fs = document.getElementById(`step-${s}`);
            const inputs = fs.querySelectorAll('input[required], textarea[required]');
            inputs.forEach(input => {
              if (!input.value.trim()) canGo = false;
            });
          }
          if (canGo) showStep(stepNum);
        }
      });
    });
  }

  // --- Color Sync ---
  function setupColorPickers() {
    const primaryInput = document.getElementById('colorPrimary');
    const primaryHex = document.getElementById('colorPrimaryHex');
    const accentInput = document.getElementById('colorAccent');
    const accentHex = document.getElementById('colorAccentHex');

    if (!primaryInput || !primaryHex || !accentInput || !accentHex) return;

    primaryInput.addEventListener('input', () => {
      primaryHex.value = primaryInput.value;
      updatePreview();
    });
    primaryHex.addEventListener('input', () => {
      if (primaryHex.value.match(/^#[0-9A-F]{6}$/i)) {
        primaryInput.value = primaryHex.value;
        updatePreview();
      }
    });

    accentInput.addEventListener('input', () => {
      accentHex.value = accentInput.value;
      updatePreview();
    });
    accentHex.addEventListener('input', () => {
      if (accentHex.value.match(/^#[0-9A-F]{6}$/i)) {
        accentInput.value = accentHex.value;
        updatePreview();
      }
    });
  }

  // --- Asset Selection / File Uploads ---
  function setupAssetControls() {
    document.querySelectorAll('.trigger-file-select').forEach(btn => {
      btn.addEventListener('click', () => {
        const fileInput = btn.closest('.uploader-control').querySelector('.file-input');
        if (fileInput) fileInput.click();
      });
    });

    document.querySelectorAll('.file-input').forEach(input => {
      input.addEventListener('change', () => {
        if (input.files.length > 0) {
          const file = input.files[0];
          const validationError = validateFile(input.id, file);
          if (validationError) {
            input.value = '';
            alert(validationError);
            return;
          }
          const spanLabel = input.closest('.media-field').querySelector('.selected-asset-name');
          if (spanLabel) {
            spanLabel.textContent = `Local File Selected: ${file.name} (will upload on publish)`;
            spanLabel.style.color = '#C4A35A';
          }

          const tempUrl = URL.createObjectURL(file);
          const hiddenInput = input.closest('.uploader-control').querySelector('input[type="hidden"]');
          if (hiddenInput) {
            hiddenInput.dataset.tempUrl = tempUrl;
          }
          updatePreview();
        }
      });
    });
  }

  function validateFile(inputId, file) {
    const isAudio = inputId === 'fileMusic';
    const allowedTypes = isAudio ? AUDIO_TYPES : IMAGE_TYPES;
    const maxBytes = isAudio ? MAX_AUDIO_BYTES : MAX_IMAGE_BYTES;
    const maxLabel = isAudio ? '15 MB' : '8 MB';

    if (!allowedTypes.has(file.type)) {
      return isAudio
        ? 'Choose an MP3, M4A, OGG, or WAV audio file.'
        : 'Choose a JPG, PNG, WebP, or AVIF image.';
    }
    if (file.size > maxBytes) {
      return `This file is too large. The maximum size is ${maxLabel}.`;
    }
    return '';
  }

  // --- Toggles ---
  function setupToggles() {
    const bibleToggle = document.getElementById('showBibleVerse');
    const bibleFields = document.getElementById('bibleVerseFields');
    const presenceToggle = document.getElementById('showPresenceNote');
    const presenceFields = document.getElementById('presenceNoteFields');

    if (bibleToggle && bibleFields) {
      bibleToggle.addEventListener('change', () => {
        bibleFields.classList.toggle('hidden', !bibleToggle.checked);
        updatePreview();
      });
    }

    if (presenceToggle && presenceFields) {
      presenceToggle.addEventListener('change', () => {
        presenceFields.classList.toggle('hidden', !presenceToggle.checked);
        updatePreview();
      });
    }
  }

  // --- Preset Modal Dialog ---
  function setupPresetModal() {
    const modal = document.getElementById('presetModal');
    const closeBtn = document.getElementById('presetModalClose');
    if (!modal) return;

    document.querySelectorAll('.btn-select-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        activePresetScreen = btn.dataset.screen;
        renderPresets(activePresetScreen);
        modal.classList.add('active');
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  function renderPresets(screenType) {
    const grid = document.getElementById('presetGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const currentTheme = document.getElementById('templateTheme').value;
    const presets = (THEME_PRESETS[currentTheme] && THEME_PRESETS[currentTheme][screenType]) || [];

    presets.forEach(preset => {
      const item = document.createElement('div');
      item.className = 'preset-item';
      
      if (screenType === 'music') {
        item.innerHTML = `
          <div class="preset-music-icon">🎵</div>
          <div class="preset-label">${preset.name}</div>
        `;
      } else {
        item.innerHTML = `
          <img src="${preset.url}" alt="${preset.name}" loading="lazy">
          <div class="preset-label">${preset.name}</div>
        `;
      }

      item.addEventListener('click', () => {
        selectPreset(screenType, preset);
        const modal = document.getElementById('presetModal');
        if (modal) modal.classList.remove('active');
      });

      grid.appendChild(item);
    });
  }

  function selectPreset(screenType, preset) {
    let hiddenInputId, labelId, fileInputId;
    if (screenType === 'door') {
      hiddenInputId = 'bgImageDoor';
      labelId = 'labelDoor';
      fileInputId = 'fileDoor';
    } else if (screenType === 'invite') {
      hiddenInputId = 'bgImageInvite';
      labelId = 'labelInvite';
      fileInputId = 'fileInvite';
    } else if (screenType === 'closing') {
      hiddenInputId = 'bgImageClosing';
      labelId = 'labelClosing';
      fileInputId = 'fileClosing';
    } else if (screenType === 'music') {
      hiddenInputId = 'bgMusicUrl';
      labelId = 'labelMusic';
      fileInputId = 'fileMusic';
    }

    const hidden = document.getElementById(hiddenInputId);
    if (hidden) {
      delete hidden.dataset.tempUrl;
      hidden.value = preset.url;
    }

    const fileInput = document.getElementById(fileInputId);
    if (fileInput) fileInput.value = '';

    const label = document.getElementById(labelId);
    if (label) {
      label.textContent = `Preset: ${preset.name}`;
      label.style.color = 'var(--text-muted)';
    }

    updatePreview();
  }

  // --- Quick FAQ Modal ---
  function setupFaqModal() {
    const modal = document.getElementById('builderFaqModal');
    const openBtn = document.getElementById('openFaqModalBtn');
    const closeBtn = document.getElementById('builderFaqClose');
    if (!modal || !openBtn) return;

    openBtn.addEventListener('click', () => {
      modal.classList.add('active');
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });

    const faqItems = modal.querySelectorAll('.builder-faq-item');
    faqItems.forEach(item => {
      const q = item.querySelector('.builder-faq-question');
      if (q) {
        q.addEventListener('click', () => {
          const isOpen = item.classList.contains('is-open');
          faqItems.forEach(other => other.classList.remove('is-open'));
          if (!isOpen) item.classList.add('is-open');
        });
      }
    });
  }

  // --- Theme Template Selector ---
  function applyTheme(themeKey) {
    syncLibrary();
    const defaults = THEME_DEFAULTS[themeKey];
    if (!defaults) return;

    for (const [key, value] of Object.entries(defaults)) {
      if (key.startsWith('bg_')) {
        let hiddenId, labelId;
        if (key === 'bg_image_door') { hiddenId = 'bgImageDoor'; labelId = 'labelDoor'; }
        if (key === 'bg_image_invite') { hiddenId = 'bgImageInvite'; labelId = 'labelInvite'; }
        if (key === 'bg_image_closing') { hiddenId = 'bgImageClosing'; labelId = 'labelClosing'; }
        if (key === 'bg_music_url') { hiddenId = 'bgMusicUrl'; labelId = 'labelMusic'; }

        const hidden = document.getElementById(hiddenId);
        if (hidden) {
          delete hidden.dataset.tempUrl;
          hidden.value = value;
        }
        const label = document.getElementById(labelId);
        if (label) {
          label.textContent = `Default preset`;
          label.style.color = 'var(--text-muted)';
        }
        continue;
      }

      if (key === 'color_primary') {
        const p = document.getElementById('colorPrimary');
        const pHex = document.getElementById('colorPrimaryHex');
        if (p) p.value = value;
        if (pHex) pHex.value = value;
        continue;
      }

      if (key === 'color_accent') {
        const a = document.getElementById('colorAccent');
        const aHex = document.getElementById('colorAccentHex');
        if (a) a.value = value;
        if (aHex) aHex.value = value;
        continue;
      }

      const input = document.getElementsByName(key)[0];
      if (input && input.type !== 'file') {
        input.value = value;
      }
    }

    updatePreview();
  }

  function setupThemeSelector() {
    const themeSelect = document.getElementById('templateTheme');
    if (!themeSelect) return;

    themeSelect.addEventListener('change', () => {
      applyTheme(themeSelect.value);
    });

    const urlParams = new URLSearchParams(window.location.search);
    const initialTemplate = urlParams.get('template');
    if (initialTemplate && THEME_DEFAULTS[initialTemplate]) {
      themeSelect.value = initialTemplate;
      applyTheme(initialTemplate);
    }
  }

  function setupOccasionActions() {
    const themeSelect = document.getElementById('templateTheme');
    const demoLink = document.getElementById('occasionDemoLink');
    if (!themeSelect || !demoLink) return;

    const updateLink = () => {
      demoLink.href = `/invite.html?demo=${encodeURIComponent(themeSelect.value)}`;
    };

    themeSelect.addEventListener('change', updateLink);
    updateLink();
  }

  // --- Custom Slug Generator ---
  function setupSlugGenerator() {
    const homeInput = document.getElementById('homeName');
    const slugInput = document.getElementById('slug');
    if (!slugInput) return;

    slugInput.value = Math.random().toString(36).substring(2, 8);

    const domainPrefix = document.getElementById('domainPrefix');
    if (domainPrefix) {
      domainPrefix.textContent = `${window.location.host}/invite/`;
    }

    if (homeInput) {
      homeInput.addEventListener('input', () => {
        if (slugInput.value.length < 5 || slugInput.value.match(/^[a-z0-9]{6}$/)) {
          const normalized = homeInput.value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
          if (normalized) {
            slugInput.value = `${normalized}-${Math.random().toString(36).substring(2, 5)}`;
          }
        }
      });
    }
  }

  // --- Live Preview Messaging ---
  function changePreviewScreen(screen) {
    const iframe = getIframe();
    if (previewReady && iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: 'show_screen', screen }, window.location.origin);
    }
  }

  function setupLivePreview() {
    window.addEventListener('message', (event) => {
      const iframe = getIframe();
      if (!iframe || event.origin !== window.location.origin || event.source !== iframe.contentWindow) return;
      if (event.data && event.data.type === 'preview_ready') {
        previewReady = true;
        const theme = document.getElementById('templateTheme');
        trackEvent('template_preview', { item_id: theme ? theme.value : 'unknown', preview_surface: 'builder' });
        updatePreview();
      } else if (event.data && event.data.type === 'edit') {
        const { field, value } = event.data;
        const input = document.getElementsByName(field)[0] || document.getElementById(field);
        if (input) {
          input.value = value;
          updatePreview();
        }
      }
    });

    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
      input.addEventListener('input', updatePreview);
      input.addEventListener('change', updatePreview);
    });

    const focusMapping = {
      'welcomeText': 'door',
      'homeName': 'door',
      'inviteEyebrow': 'invite',
      'hosts': 'invite',
      'eventDate': 'invite',
      'eventTime': 'invite',
      'venueName': 'invite',
      'venueAddress': 'invite',
      'phone': 'invite',
      'inviteText': 'invite',
      'rsvpOption1Title': 'invite',
      'rsvpOption1Subtitle': 'invite',
      'rsvpOption2Title': 'invite',
      'rsvpOption2Subtitle': 'invite',
      'rsvpOption3Title': 'invite',
      'rsvpOption3Subtitle': 'invite',
      'modalContactBlessing': 'invite',
      'bibleVerse': 'closing',
      'bibleRef': 'closing',
      'closingQuote': 'closing',
      'closingSubtext': 'closing',
      'hostsTagline': 'closing',
      'seeYouBtnText': 'closing',
      'presenceNote': 'closing'
    };

    for (const [id, screen] of Object.entries(focusMapping)) {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('focus', () => {
          changePreviewScreen(screen);
        });
      }
    }

    document.querySelectorAll('.btn-select-preset, .trigger-file-select').forEach(btn => {
      btn.addEventListener('click', () => {
        const screen = btn.dataset.screen;
        if (screen === 'door' || screen === 'invite' || screen === 'closing') {
          changePreviewScreen(screen);
        }
      });
    });
  }

  function getFormData() {
    const form = document.getElementById('builderForm');
    const data = {};
    if (!form) return data;
    const formData = new FormData(form);

    for (const [key, value] of formData.entries()) {
      if (key.startsWith('bg_') || key === 'bg_music_url') continue;
      data[key] = value;
    }

    const bibleCheck = document.getElementById('showBibleVerse');
    data.show_bible_verse = bibleCheck ? bibleCheck.checked : false;

    const presenceCheck = document.getElementById('showPresenceNote');
    data.show_presence_note = presenceCheck ? presenceCheck.checked : false;

    const doorHidden = document.getElementById('bgImageDoor');
    if (doorHidden) data.bg_image_door = doorHidden.dataset.tempUrl || doorHidden.value;

    const inviteHidden = document.getElementById('bgImageInvite');
    if (inviteHidden) data.bg_image_invite = inviteHidden.dataset.tempUrl || inviteHidden.value;

    const closingHidden = document.getElementById('bgImageClosing');
    if (closingHidden) data.bg_image_closing = closingHidden.dataset.tempUrl || closingHidden.value;

    const musicHidden = document.getElementById('bgMusicUrl');
    if (musicHidden) data.bg_music_url = musicHidden.dataset.tempUrl || musicHidden.value;

    return data;
  }

  function updatePreview() {
    if (!previewReady) return;
    const iframe = getIframe();
    if (!iframe || !iframe.contentWindow) return;
    const payload = getFormData();
    iframe.contentWindow.postMessage({ type: 'preview', payload }, window.location.origin);
  }

  // --- Draft Autosave & Restore ---
  function setupDraftPersistence() {
    const DRAFT_KEY = 'invitelink_draft_v1';
    const form = document.getElementById('builderForm');
    if (!form) return;

    let saveTimeout = null;
    function saveDraft() {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        try {
          const raw = getFormData();
          const clean = {};
          for (const [k, v] of Object.entries(raw)) {
            if (typeof v === 'string' && v.startsWith('blob:')) continue;
            clean[k] = v;
          }
          localStorage.setItem(DRAFT_KEY, JSON.stringify(clean));
        } catch (e) {
          console.warn('Draft save error:', e);
        }
      }, 500);
    }

    form.addEventListener('input', saveDraft);
    form.addEventListener('change', saveDraft);

    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.get('template') && !urlParams.get('demo')) {
      try {
        const stored = localStorage.getItem(DRAFT_KEY);
        if (stored) {
          const draft = JSON.parse(stored);
          for (const [key, val] of Object.entries(draft)) {
            const input = document.getElementsByName(key)[0] || document.getElementById(key);
            if (input && val != null) {
              if (input.type === 'checkbox') {
                input.checked = Boolean(val);
              } else if (input.type !== 'file') {
                input.value = val;
              }
            }
          }
          const bibleToggle = document.getElementById('showBibleVerse');
          const bibleFields = document.getElementById('bibleVerseFields');
          if (bibleToggle && bibleFields) {
            bibleFields.classList.toggle('hidden', !bibleToggle.checked);
          }
          const presenceToggle = document.getElementById('showPresenceNote');
          const presenceFields = document.getElementById('presenceNoteFields');
          if (presenceToggle && presenceFields) {
            presenceFields.classList.toggle('hidden', !presenceToggle.checked);
          }
        }
      } catch (e) {
        console.warn('Draft restore error:', e);
      }
    }
  }

  // --- Submit & Upload Assets ---
  function setupFormSubmission() {
    const form = document.getElementById('builderForm');
    const publishBtn = document.getElementById('publishBtn');
    const progressContainer = document.getElementById('publishProgress');
    const fill = document.getElementById('progressFill');
    const label = document.getElementById('progressLabel');
    const successCard = document.getElementById('successCard');
    let uploadedPaths = [];

    if (!form || !publishBtn) return;

        form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const modal = document.getElementById('emailCaptureModal');
      if (modal && modal.style.display !== 'flex') {
        modal.style.display = 'flex';
        
        const btnSubmit = document.getElementById('btnSubmitEmail');
        const btnSkip = document.getElementById('btnSkipEmail');
        const emailInput = document.getElementById('captureEmail');
        
        const continuePublish = () => {
          if (emailInput && emailInput.value.trim()) {
            trackEvent('sign_up', { method: 'email_capture' });
          }
          modal.style.display = 'none';
          executePublish();
        };
        
        btnSubmit.onclick = continuePublish;
        btnSkip.onclick = continuePublish;
        return;
      }
      
      executePublish();

      async function executePublish() {

      publishBtn.disabled = true;
      publishBtn.textContent = "Publishing...";
      if (progressContainer) progressContainer.classList.remove('hidden');
      uploadedPaths = [];

      try {
        const slugInput = document.getElementById('slug');
        const slug = slugInput ? slugInput.value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '') : '';
        if (!slug) {
          alert("Please enter a valid URL slug.");
          resetPublishButton();
          return;
        }

        if (label) label.textContent = "Checking URL availability...";
        const { data: existing, error: checkError } = await supabaseClient
          .from('invitations')
          .select('id')
          .eq('slug', slug)
          .maybeSingle();

        if (checkError) {
          console.error(checkError);
          throw new Error('Could not verify link availability. Please try again.');
        }

        if (existing) {
          alert(`The link slug "/invite/${slug}" is already taken. Please choose a different one.`);
          resetPublishButton();
          return;
        }

        const rawData = getFormData();
        rawData.slug = slug;

        const filesToUpload = [
          { inputId: 'fileDoor', fieldName: 'bg_image_door', folder: 'doors' },
          { inputId: 'fileInvite', fieldName: 'bg_image_invite', folder: 'invitations' },
          { inputId: 'fileClosing', fieldName: 'bg_image_closing', folder: 'closings' },
          { inputId: 'fileMusic', fieldName: 'bg_music_url', folder: 'music' }
        ];

        for (let i = 0; i < filesToUpload.length; i++) {
          const { inputId, fieldName, folder } = filesToUpload[i];
          const input = document.getElementById(inputId);
          if (input && input.files.length > 0) {
            const file = input.files[0];
            const validationError = validateFile(inputId, file);
            if (validationError) throw new Error(validationError);

            const fileExt = FILE_EXTENSIONS[file.type];
            const uniqueId = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${i}`;
            const filePath = `${folder}/${slug}-${uniqueId}.${fileExt}`;

            if (label) label.textContent = `Uploading ${file.name}...`;

            const { data: uploadData, error: uploadError } = await supabaseClient
              .storage
              .from('invitations')
              .upload(filePath, file, { cacheControl: '3600', upsert: false, contentType: file.type });

            if (uploadError) {
              console.error(uploadError);
              throw new Error(`Failed to upload ${file.name}`);
            }
            uploadedPaths.push(filePath);

            const { data: publicUrlData } = supabaseClient
              .storage
              .from('invitations')
              .getPublicUrl(filePath);

            rawData[fieldName] = publicUrlData.publicUrl;
          }
        }

        // Whitelist and sanitize payload before inserting into DB
        const payload = sanitizeDbPayload(rawData);

        if (label) label.textContent = "Creating web invitation...";
        const { error: insertError } = await supabaseClient
          .from('invitations')
          .insert([payload]);

        if (insertError) {
          console.error(insertError);
          if (insertError.code === '23505') {
            throw new Error(`The link slug "/invite/${slug}" is already taken. Please choose another one.`);
          }
          throw new Error("Database insertion failed. Please try again.");
        }
        uploadedPaths = [];
        trackEvent('invite_created', { item_id: payload.event_type || 'invitation', invite_slug: slug });
        trackEvent('invite_published', { item_id: payload.event_type || 'invitation', invite_slug: slug });

        // Clear local draft on success
        localStorage.removeItem('invitelink_draft_v1');

        // Success Screen
        if (progressContainer) progressContainer.classList.add('hidden');
        if (successCard) successCard.classList.remove('hidden');
        document.querySelectorAll('.success-back-row').forEach(el => el.classList.add('hidden'));

        const finalUrl = `${window.location.protocol}//${window.location.host}/invite/${slug}`;
        const liveInviteLink = document.getElementById('liveInviteLink');
        if (liveInviteLink) liveInviteLink.value = finalUrl;
        
        const viewLiveBtn = document.getElementById('viewLiveBtn');
        if (viewLiveBtn) viewLiveBtn.href = finalUrl;

        const waMsg = encodeURIComponent(`You're invited to ${payload.home_name}. View the invitation here: ${finalUrl}`);
        const shareWhatsAppBtn = document.getElementById('shareWhatsAppBtn');
        if (shareWhatsAppBtn) {
          shareWhatsAppBtn.href = `https://wa.me/?text=${waMsg}`;
          shareWhatsAppBtn.addEventListener('click', () => {
            trackEvent('share_whatsapp', { invite_slug: slug, share_surface: 'publish_success' });
          }, { once: true });
        }

        const copyLinkBtn = document.getElementById('copyLinkBtn');
        if (copyLinkBtn) {
          copyLinkBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(finalUrl);
            copyLinkBtn.textContent = "Copied!";
            setTimeout(() => { copyLinkBtn.textContent = "Copy Link"; }, 2000);
          });
        }

      } catch (err) {
        console.error(err);
        if (uploadedPaths.length > 0) {
          const { error: cleanupError } = await supabaseClient.storage.from('invitations').remove(uploadedPaths);
          if (cleanupError) console.error('Could not clean up uploaded files', cleanupError);
        }
        alert(`An error occurred: ${err.message || 'Unknown error'}`);
        resetPublishButton();
      }
    }
    });

    function resetPublishButton() {
      publishBtn.disabled = false;
      publishBtn.textContent = "Generate Invitation Link";
      if (progressContainer) progressContainer.classList.add('hidden');
    }
  }

})();

