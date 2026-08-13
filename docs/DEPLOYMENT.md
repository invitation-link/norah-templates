# Ganishka Invite - Deployment Guide

## Quick Deploy to Vercel

### Option 1: CLI Deployment
```bash
npm i -g vercel
cd "Ganishka Invite"
vercel
```

Follow prompts to:
1. Login/signup
2. Confirm project settings
3. Get your live URL

### Option 2: GitHub Integration
1. Push to GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Auto-deploy on every push

---

## Live URLs

After deployment, access templates at:
```
https://your-project.vercel.app/templates/wedding/
https://your-project.vercel.app/templates/birthday/neon-party/
https://your-project.vercel.app/templates/corporate/tech-summit/
```

---

## Custom Domain

1. Vercel Dashboard → Project → Settings → Domains
2. Add your domain (e.g., `invites.yourcompany.com`)
3. Update DNS as instructed

---

## Environment Variables (Optional)

For RSVP backend, add in Vercel Dashboard:
```
FIREBASE_API_KEY=xxx
FIREBASE_PROJECT_ID=xxx
GOOGLE_SHEETS_URL=xxx
```

---

## Production Checklist

- [ ] Test all templates on mobile
- [ ] Verify audio/haptic works on iOS Safari
- [ ] Check QR codes work for each template
- [ ] Test RSVP form submissions
- [ ] Configure custom domain
- [ ] Set up RSVP backend (Sheets/Firebase)
