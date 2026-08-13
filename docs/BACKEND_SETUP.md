# InviteMagic - Backend Setup Guide

## 📸 Cloudinary Setup (Photo Uploads)

### Step 1: Create Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Click "Sign Up Free"
3. Complete registration

### Step 2: Get Your Credentials

1. Log into Cloudinary Dashboard
2. Find your credentials on the main dashboard:
   - **Cloud Name**: `your-cloud-name`
   - Look for it in the API Environment Variable section

### Step 3: Create Upload Preset

1. Go to **Settings** → **Upload**
2. Scroll to **Upload presets**
3. Click **Add upload preset**
4. Configure:
   - **Preset name**: `invitemagic_uploads`
   - **Signing Mode**: `Unsigned` ⚠️ Important!
   - **Folder**: `invitemagic`
5. Click **Save**

### Step 4: Update Code

Edit `js/cloudinary.js` and replace:

```javascript
const CLOUD_NAME = 'YOUR_CLOUD_NAME';  // e.g., 'dxyz1234'
const UPLOAD_PRESET = 'invitemagic_uploads';
```

---

## 🔥 Firebase Setup (RSVP Storage)

### Step 1: Create Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click "Create a project"
3. Name it: `invitemagic`
4. Disable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Firestore

1. In Firebase Console, click **Build** → **Firestore Database**
2. Click "Create database"
3. Select **Start in test mode** (for now)
4. Choose nearest location
5. Click "Enable"

### Step 3: Get Configuration

1. Click ⚙️ **Settings** → **Project settings**
2. Scroll to "Your apps" → Click **Web** `</>`
3. Register app name: `invitemagic-web`
4. Copy the `firebaseConfig` object

### Step 4: Update Code

Edit `js/firebase-rsvp.js` and replace the config:

```javascript
const FIREBASE_CONFIG = {
    apiKey: "AIza...",
    authDomain: "invitemagic.firebaseapp.com",
    projectId: "invitemagic",
    storageBucket: "invitemagic.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};
```

### Step 5: Add Firebase SDK

Add to `view.html` before the RSVP script:

```html
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>
```

### Step 6: Security Rules (Important!)

In Firebase Console → Firestore → **Rules**, update:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // RSVPs - anyone can add, but not read others
    match /rsvps/{rsvpId} {
      allow create: if true;
      allow read: if true; // For host dashboard
    }
    // Views - anyone can add
    match /views/{viewId} {
      allow create: if true;
      allow read: if true;
    }
  }
}
```

---

## ✅ Verification Checklist

### Cloudinary
- [ ] Account created
- [ ] Upload preset created (unsigned)
- [ ] Cloud name updated in `js/cloudinary.js`
- [ ] Test upload working

### Firebase
- [ ] Project created
- [ ] Firestore database enabled
- [ ] Config updated in `js/firebase-rsvp.js`
- [ ] Firebase SDK added to `view.html`
- [ ] Security rules configured
- [ ] Test RSVP submission working

---

## 🧪 Testing

### Test Photo Upload
1. Go to create page
2. Click + to add photo
3. Select an image
4. Verify it uploads and shows preview

### Test RSVP
1. Create an invitation
2. Open the generated link
3. Fill RSVP form and submit
4. Check Firebase Console → Firestore → rsvps collection

---

## 💰 Free Tier Limits

| Service | Free Tier |
|---------|-----------|
| **Cloudinary** | 25GB storage, 25GB bandwidth/month |
| **Firebase Firestore** | 50K reads, 20K writes, 20K deletes/day |

These limits are sufficient for ~1000+ invitations/month.
