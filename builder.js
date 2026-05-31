/* ============================================
   NORAH Template Platform — Builder Logic
   ============================================ */

(function () {
  'use strict';

  // Supabase Credentials
  const SUPABASE_URL = "https://saxnxzfwufzilnsttnwa.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNheG54emZ3dWZ6aWxuc3R0bndhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyMDU0OTMsImV4cCI6MjA5NTc4MTQ5M30._Kv4_OHLkyiyF3Ck3tmlxDaC8CPPbLV34xfp5N-kctU";
  let supabaseClient = null;

  // Preset assets definition
  const PRESETS = {
    door: [
      { name: "Luxury Archway", url: "https://norah-housewarming.vercel.app/assets/images/door-scene.webp" },
      { name: "Modern Coffee Corner", url: "https://norah-housewarming.vercel.app/morning_coffee_1779640869344.png" },
      { name: "Cozy Welcoming Door", url: "https://norah-housewarming.vercel.app/welcoming_doorway_1779640920173.png" }
    ],
    invite: [
      { name: "Elegant Flowers & Curtains", url: "https://norah-housewarming.vercel.app/assets/images/bg-curtain-flowers.webp" },
      { name: "Family Dining Area", url: "https://norah-housewarming.vercel.app/family_dining_1779640885025.png" }
    ],
    closing: [
      { name: "Warm Evening Candle Glow", url: "https://norah-housewarming.vercel.app/assets/images/bg-evening-warmth.webp" },
      { name: "Peaceful Reading Corner", url: "https://norah-housewarming.vercel.app/reading_corner_1779640903563.png" }
    ],
    music: [
      { name: "Instrumental Acoustic Guitar", url: "https://norah-housewarming.vercel.app/assets/audio/bg-music.mp4" }
    ]
  };

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
      const list = PRESETS[type] || [];
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

  function setupLivePreview() {
    // Listen for iframe readiness
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'preview_ready') {
        previewReady = true;
        updatePreview();
      }
    });

    // Listen to form input changes to sync preview instantly
    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
      input.addEventListener('input', updatePreview);
      input.addEventListener('change', updatePreview);
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
    iframe.contentWindow.postMessage({ type: 'preview', payload }, '*');
  }

  // --- Submit & Upload Assets ---
  function setupFormSubmission() {
    const form = document.getElementById('builderForm');
    const publishBtn = document.getElementById('publishBtn');
    const progressContainer = document.getElementById('publishProgress');
    const fill = document.getElementById('progressFill');
    const label = document.getElementById('progressLabel');
    const successCard = document.getElementById('successCard');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Lock screen / buttons
      publishBtn.disabled = true;
      publishBtn.textContent = "Publishing...";
      progressContainer.classList.remove('hidden');

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
            const fileExt = file.name.split('.').pop();
            const filePath = `${folder}/${slug}-${Date.now()}.${fileExt}`;
            
            label.textContent = `Uploading ${file.name}...`;
            
            const { data: uploadData, error: uploadError } = await supabaseClient
              .storage
              .from('invitations')
              .upload(filePath, file, { cacheControl: '3600', upsert: true });

            if (uploadError) {
              console.error(uploadError);
              throw new Error(`Failed to upload ${file.name}`);
            }

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

        // 4. Success Screen
        progressContainer.classList.add('hidden');
        successCard.classList.remove('hidden');
        document.querySelectorAll('.success-back-row').forEach(el => el.classList.add('hidden'));

        const finalUrl = `${window.location.protocol}//${window.location.host}/invite/${slug}`;
        document.getElementById('liveInviteLink').value = finalUrl;
        document.getElementById('viewLiveBtn').href = finalUrl;
        
        const waMsg = encodeURIComponent(`Hi! We are happy to invite you to our housewarming! View our cinematic invitation card here: ${finalUrl}`);
        document.getElementById('shareWhatsAppBtn').href = `https://wa.me/?text=${waMsg}`;

        // Setup Copy Link
        document.getElementById('copyLinkBtn').addEventListener('click', () => {
          navigator.clipboard.writeText(finalUrl);
          document.getElementById('copyLinkBtn').textContent = "Copied!";
          setTimeout(() => document.getElementById('copyLinkBtn').textContent = "Copy Link", 2000);
        });

      } catch (err) {
        console.error(err);
        alert(`An error occurred: ${err.message || 'Unknown error'}`);
        resetPublishButton();
      }
    });

    function resetPublishButton() {
      publishBtn.disabled = false;
      publishBtn.textContent = "Generate Invitation Link";
      progressContainer.classList.add('hidden');
    }
  }

})();
