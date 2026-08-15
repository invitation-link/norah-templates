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

  // Preset assets definition
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
        { name: "Colorful Celebration", url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800" },
        { name: "Bright Party", url: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=800" },
        { name: "Night Sparklers", url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800" }
      ],
      invite: [
        { name: "Colorful Streamers & Glitter", url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800" },
        { name: "Bright Party Background", url: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=800" }
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
        { name: "Soft Pastel Clouds", url: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800" },
        { name: "Soft Nursery", url: "https://images.unsplash.com/photo-1520121401995-928cd50d4e27?w=800" },
        { name: "Gentle Celebration", url: "https://images.unsplash.com/photo-1559251606-c623743a6d76?w=800" }
      ],
      invite: [
        { name: "Eucalyptus Leaves & Flowers", url: "https://images.unsplash.com/photo-1520121401995-928cd50d4e27?w=800" },
        { name: "Gentle Floral Celebration", url: "https://images.unsplash.com/photo-1559251606-c623743a6d76?w=800" }
      ],
      closing: [
        { name: "Warm Nursery Glow", url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800" },
        { name: "Cute Baby Teddy Bear", url: "https://images.unsplash.com/photo-1559251606-c623743a6d76?w=800" }
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
      bg_image_door: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80",
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
      bg_image_door: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
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
      bg_image_door: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800",
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
      rsvp_option1_subtitle: "Can't wait to cuddle!",
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
      see_you_btn_text: "Welcome Baby!",
      presence_note: "Gifts are welcome but not required",
      color_primary: "#EC4899",
      color_accent: "#06B6D4",
      bg_image_door: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800",
      bg_image_invite: "https://images.unsplash.com/photo-1520121401995-928cd50d4e27?w=800",
      bg_image_closing: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
      bg_music_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    }
  };

  // The shared library powers the gallery, live demos, and builder from one source.
  const sharedLibrary = window.INVITE_TEMPLATE_LIBRARY;
  if (sharedLibrary) {
    Object.assign(THEME_PRESETS, sharedLibrary.presets);
    Object.assign(THEME_DEFAULTS, sharedLibrary.defaults);
  }

  let currentStep = 1;
  let activePresetScreen = null; // tracking which field the preset modal is open for

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    // 1. Initialize Supabase Client
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
    setupFormSubmission();
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

      // Auto-navigate preview based on step
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
        // Simple form validation before moving to next step
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
          // Allow going forward only if current fields are valid
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
        fileInput.click();
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
          spanLabel.textContent = `Local File Selected: ${file.name} (will upload on publish)`;
          spanLabel.style.color = '#C4A35A'; // gold tint to show pending
          
          // Generate a temp local object URL for instant live preview inside iframe!
          const tempUrl = URL.createObjectURL(file);
          const hiddenInput = input.closest('.uploader-control').querySelector('input[type="hidden"]');
          hiddenInput.dataset.tempUrl = tempUrl; // Store temporary preview url
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

    bibleToggle.addEventListener('change', () => {
      bibleFields.classList.toggle('hidden', !bibleToggle.checked);
      updatePreview();
    });

    presenceToggle.addEventListener('change', () => {
      presenceFields.classList.toggle('hidden', !presenceToggle.checked);
      updatePreview();
    });
  }

  // --- Preset Modal Dialog ---
  function setupPresetModal() {
    const modal = document.getElementById('presetModal');
    const closeBtn = document.getElementById('presetModalClose');
    const grid = document.getElementById('presetGrid');

    document.querySelectorAll('.btn-select-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        activePresetScreen = btn.dataset.screen;
        renderPresets(activePresetScreen);
        modal.classList.add('active');
      });
    });

    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });

    function renderPresets(type) {
      grid.innerHTML = '';
      const themeSelect = document.getElementById('templateTheme');
      const selectedTheme = themeSelect ? themeSelect.value : 'housewarming';
      const list = (THEME_PRESETS[selectedTheme] && THEME_PRESETS[selectedTheme][type]) || [];
      list.forEach(preset => {
        const card = document.createElement('div');
        card.className = `preset-card ${type === 'music' ? 'audio-preset-card' : ''}`;
        
        if (type === 'music') {
          card.innerHTML = `
            <div style="font-size:20px;">🎵</div>
            <div>
              <div style="font-size:12px; font-weight:600;">${preset.name}</div>
              <div style="font-size:10px; color:var(--text-muted);">Preset Track</div>
            </div>
          `;
        } else {
          card.innerHTML = `
            <img src="${preset.url}" alt="${preset.name}">
            <div class="preset-card__label">${preset.name}</div>
          `;
        }

        card.addEventListener('click', () => {
          // Select preset
          const hiddenInput = document.getElementById(`bg${type.charAt(0).toUpperCase() + type.slice(1)}`) || document.getElementById('bgMusicUrl');
          hiddenInput.value = preset.url;
          delete hiddenInput.dataset.tempUrl; // remove any temp file preview URL
          
          const label = document.getElementById(`label${type.charAt(0).toUpperCase() + type.slice(1)}`) || document.getElementById('labelMusic');
          label.textContent = `Preset Selected: ${preset.name}`;
          label.style.color = '';

          // Reset the file input value so we don't upload a redundant file
          const fileInput = hiddenInput.closest('.uploader-control').querySelector('.file-input');
          fileInput.value = '';

          modal.classList.remove('active');
          updatePreview();
        });

        grid.appendChild(card);
      });
    }
  }

  // --- Quick FAQ Modal ---
  function setupFaqModal() {
    const openBtn = document.getElementById('openFaqModalBtn');
    const modal = document.getElementById('builderFaqModal');
    const closeBtn = document.getElementById('builderFaqClose');
    if (!modal) return;

    if (openBtn) {
      openBtn.addEventListener('click', () => modal.classList.add('active'));
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    }
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });

    const faqItems = modal.querySelectorAll('.builder-faq-item');
    faqItems.forEach(item => {
      const q = item.querySelector('.builder-faq-question');
      if (q) {
        q.addEventListener('click', () => {
          item.classList.toggle('is-open');
        });
      }
    });
  }

  // --- Theme / Category switching logic ---
  function applyTheme(theme) {
    const defaults = THEME_DEFAULTS[theme];
    if (!defaults) return;

    // Apply values to inputs
    document.getElementById('homeName').value = defaults.home_name;
    document.getElementById('welcomeText').value = defaults.welcome_text;
    document.getElementById('inviteEyebrow').value = defaults.invite_eyebrow;
    document.getElementById('inviteText').value = defaults.invite_text;
    document.getElementById('rsvpOption1Title').value = defaults.rsvp_option1_title;
    document.getElementById('rsvpOption1Subtitle').value = defaults.rsvp_option1_subtitle;
    document.getElementById('rsvpOption2Title').value = defaults.rsvp_option2_title;
    document.getElementById('rsvpOption2Subtitle').value = defaults.rsvp_option2_subtitle;
    document.getElementById('rsvpOption3Title').value = defaults.rsvp_option3_title;
    document.getElementById('rsvpOption3Subtitle').value = defaults.rsvp_option3_subtitle;
    document.getElementById('modalContactBlessing').value = defaults.modal_contact_blessing;
    document.getElementById('bibleVerse').value = defaults.bible_verse;
    document.getElementById('bibleRef').value = defaults.bible_ref;
    document.getElementById('closingQuote').value = defaults.closing_quote;
    document.getElementById('closingSubtext').value = defaults.closing_subtext;
    document.getElementById('hostsTagline').value = defaults.hosts_tagline;
    document.getElementById('seeYouBtnText').value = defaults.see_you_btn_text;
    document.getElementById('presenceNote').value = defaults.presence_note;

    // Color Pickers
    document.getElementById('colorPrimary').value = defaults.color_primary;
    document.getElementById('colorPrimaryHex').value = defaults.color_primary;
    document.getElementById('colorAccent').value = defaults.color_accent;
    document.getElementById('colorAccentHex').value = defaults.color_accent;

    // Image/Audio hidden fields
    document.getElementById('bgImageDoor').value = defaults.bg_image_door;
    delete document.getElementById('bgImageDoor').dataset.tempUrl;
    document.getElementById('labelDoor').textContent = `Default Preset (${defaults.bg_image_door.split('/').pop().split('?')[0]})`;

    document.getElementById('bgImageInvite').value = defaults.bg_image_invite;
    delete document.getElementById('bgImageInvite').dataset.tempUrl;
    document.getElementById('labelInvite').textContent = `Default Preset (${defaults.bg_image_invite.split('/').pop().split('?')[0]})`;

    document.getElementById('bgImageClosing').value = defaults.bg_image_closing;
    delete document.getElementById('bgImageClosing').dataset.tempUrl;
    document.getElementById('labelClosing').textContent = `Default Preset (${defaults.bg_image_closing.split('/').pop().split('?')[0]})`;

    document.getElementById('bgMusicUrl').value = defaults.bg_music_url;
    delete document.getElementById('bgMusicUrl').dataset.tempUrl;
    document.getElementById('labelMusic').textContent = `Default Preset (${defaults.bg_music_url.split('/').pop().split('?')[0]})`;

    // Clear file inputs
    document.getElementById('fileDoor').value = '';
    document.getElementById('fileInvite').value = '';
    document.getElementById('fileClosing').value = '';
    document.getElementById('fileMusic').value = '';

    updatePreview();
  }

  function setupThemeSelector() {
    const themeSelect = document.getElementById('templateTheme');
    if (themeSelect) {
      themeSelect.addEventListener('change', () => {
        applyTheme(themeSelect.value);
      });

      // Parse query parameter to set template on load
      const urlParams = new URLSearchParams(window.location.search);
      const initialTemplate = urlParams.get('template');
      if (initialTemplate && THEME_DEFAULTS[initialTemplate]) {
        themeSelect.value = initialTemplate;
        applyTheme(initialTemplate);
      }
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

    // Generate random slug suggestion on load
    slugInput.value = Math.random().toString(36).substring(2, 8);

    // Auto-update subdomain prefix
    document.getElementById('domainPrefix').textContent = `${window.location.host}/invite/`;

    // Help suggest slug from home title
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

  // --- Live Preview Messaging ---
  const iframe = document.getElementById('previewIframe');
  let previewReady = false;

  function changePreviewScreen(screen) {
    if (previewReady && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: 'show_screen', screen }, window.location.origin);
    }
  }

  function setupLivePreview() {
    // Listen for iframe messages
    window.addEventListener('message', (event) => {
      if (event.origin !== window.location.origin || event.source !== iframe.contentWindow) return;
      if (event.data && event.data.type === 'preview_ready') {
        previewReady = true;
        updatePreview();
      } else if (event.data && event.data.type === 'edit') {
        const { field, value } = event.data;
        const input = document.getElementsByName(field)[0] || document.getElementById(field);
        if (input) {
          input.value = value;
          // Refresh other places in preview using the updated dataset
          updatePreview();
        }
      }
    });

    // Listen to form input changes to sync preview instantly
    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
      input.addEventListener('input', updatePreview);
      input.addEventListener('change', updatePreview);
    });

    // Setup focus listeners to switch preview screens automatically
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

    // Also trigger when selecting files or presets
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
    const formData = new FormData(form);
    
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('bg_') || key === 'bg_music_url') continue;
      data[key] = value;
    }

    // Handles toggles
    data.show_bible_verse = document.getElementById('showBibleVerse').checked;
    data.show_presence_note = document.getElementById('showPresenceNote').checked;

    // Handles image paths (prioritize local temporary object URL for preview)
    const doorHidden = document.getElementById('bgImageDoor');
    data.bg_image_door = doorHidden.dataset.tempUrl || doorHidden.value;

    const inviteHidden = document.getElementById('bgImageInvite');
    data.bg_image_invite = inviteHidden.dataset.tempUrl || inviteHidden.value;

    const closingHidden = document.getElementById('bgImageClosing');
    data.bg_image_closing = closingHidden.dataset.tempUrl || closingHidden.value;

    const musicHidden = document.getElementById('bgMusicUrl');
    data.bg_music_url = musicHidden.dataset.tempUrl || musicHidden.value;

    return data;
  }

  function updatePreview() {
    if (!previewReady) return;
    const payload = getFormData();
    iframe.contentWindow.postMessage({ type: 'preview', payload }, window.location.origin);
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

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Lock screen / buttons
      publishBtn.disabled = true;
      publishBtn.textContent = "Publishing...";
      progressContainer.classList.remove('hidden');
      uploadedPaths = [];

      try {
        // 1. Verify slug uniqueness
        const slug = document.getElementById('slug').value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
        if (!slug) {
          alert("Please enter a valid slug.");
          resetPublishButton();
          return;
        }

        label.textContent = "Checking URL availability...";
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

        // 2. Upload files if any selected
        const payload = getFormData();
        payload.slug = slug;

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
            
            label.textContent = `Uploading ${file.name}...`;
            
            const { data: uploadData, error: uploadError } = await supabaseClient
              .storage
              .from('invitations')
              .upload(filePath, file, { cacheControl: '3600', upsert: false, contentType: file.type });

            if (uploadError) {
              console.error(uploadError);
              throw new Error(`Failed to upload ${file.name}`);
            }
            uploadedPaths.push(filePath);

            // Get Public URL
            const { data: publicUrlData } = supabaseClient
              .storage
              .from('invitations')
              .getPublicUrl(filePath);

            payload[fieldName] = publicUrlData.publicUrl;
          }
        }

        // 3. Save to database
        label.textContent = "Creating web invitation...";
        const { error: insertError } = await supabaseClient
          .from('invitations')
          .insert([payload]);

        if (insertError) {
          console.error(insertError);
          throw new Error("Database insertion failed");
        }
        uploadedPaths = [];

        // 4. Success Screen
        progressContainer.classList.add('hidden');
        successCard.classList.remove('hidden');
        document.querySelectorAll('.success-back-row').forEach(el => el.classList.add('hidden'));

        const finalUrl = `${window.location.protocol}//${window.location.host}/invite/${slug}`;
        document.getElementById('liveInviteLink').value = finalUrl;
        document.getElementById('viewLiveBtn').href = finalUrl;
        
        const waMsg = encodeURIComponent(`You're invited to ${payload.home_name}. View the invitation here: ${finalUrl}`);
        document.getElementById('shareWhatsAppBtn').href = `https://wa.me/?text=${waMsg}`;

        // Setup Copy Link
        document.getElementById('copyLinkBtn').addEventListener('click', () => {
          navigator.clipboard.writeText(finalUrl);
          document.getElementById('copyLinkBtn').textContent = "Copied!";
          setTimeout(() => document.getElementById('copyLinkBtn').textContent = "Copy Link", 2000);
        });

      } catch (err) {
        console.error(err);
        if (uploadedPaths.length > 0) {
          const { error: cleanupError } = await supabaseClient.storage.from('invitations').remove(uploadedPaths);
          if (cleanupError) console.error('Could not clean up uploaded files', cleanupError);
        }
        alert(`An error occurred: ${err.message || 'Unknown error'}`);
        resetPublishButton();
      }
    });

    function resetPublishButton() {
      publishBtn.disabled = false;
      publishBtn.textContent = "Generate Invite Link";
      progressContainer.classList.add('hidden');
    }
  }

})();
