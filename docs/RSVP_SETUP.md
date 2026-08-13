# RSVP Backend Setup Guide

## Quick Start (No Backend Required)

By default, RSVPs are saved to **localStorage** on the user's device. This works great for:
- Personal invitations
- Small events (< 100 guests)
- Offline capable events

---

## Option 1: Google Sheets (Recommended for Easy Setup)

### Step 1: Create Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com)
2. Create new spreadsheet named "Wedding RSVPs"
3. Add headers: `Name | Email | Phone | Guests | Response | Message | Timestamp`

### Step 2: Create Apps Script
1. Extensions → Apps Script
2. Paste this code:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    data.name,
    data.email, 
    data.phone,
    data.guests,
    data.response,
    data.message,
    new Date().toISOString()
  ]);
  
  return ContentService.createTextOutput('OK');
}
```

3. Deploy → New Deployment → Web App
4. Set access to "Anyone"
5. Copy the web app URL

### Step 3: Configure Templates

```javascript
// In your template's <script> section
const rsvp = new RSVPHandler({
    backend: 'sheets',
    sheetsUrl: 'YOUR_APPS_SCRIPT_URL'
});

document.getElementById('rsvp-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await rsvp.submit(new FormData(e.target));
    alert('Thank you!');
});
```

---

## Option 2: Firebase (Best for Scale)

### Step 1: Create Firebase Project
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create new project
3. Enable Firestore Database
4. Set rules to allow writes:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /rsvps/{rsvp} {
      allow write: if true;
      allow read: if request.auth != null;
    }
  }
}
```

### Step 2: Get Config
1. Project Settings → General → Web App
2. Copy the `firebaseConfig` object

### Step 3: Configure Templates

```javascript
const rsvp = new RSVPHandler({
    backend: 'firebase',
    firebaseConfig: {
        apiKey: "YOUR_API_KEY",
        authDomain: "your-project.firebaseapp.com",
        projectId: "your-project"
    }
});
```

---

## Viewing RSVP Data

### Console Command (Any Template)
```javascript
// Get all RSVPs
console.table(rsvpHandler.getAll());

// Get stats
console.log(rsvpHandler.getStats());

// Export CSV
rsvpHandler.downloadCSV('wedding-rsvps.csv');
```

### Dashboard Integration
Add this to see live stats:
```javascript
const stats = rsvpHandler.getStats();
document.getElementById('guest-count').textContent = stats.totalGuests;
document.getElementById('rsvp-count').textContent = stats.attending;
```

---

## Stats Tracking

The RSVP handler automatically tracks:
- Total submissions
- Attending count
- Guest total
- Response timestamps

Access via: `rsvpHandler.getStats()`
