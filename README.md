# Invite Link

Invite Link turns an occasion into an interactive invitation guests can open and share on WhatsApp.

Live: https://invite-link-rosy.vercel.app

## Product

- Interactive birthday, wedding, celebration and corporate templates
- Controlled seven-step customization with an exact live guest preview
- Local draft saving, personalized links and WhatsApp sharing
- Free invitations with tasteful opening and closing Invite Link promotion
- One-time Premium plan with promotional branding removed
- Invitation dashboard and organic-distribution analytics

## Stack

- Next.js 16 and React 19
- Framer Motion and GSAP
- Supabase authentication, PostgreSQL and media storage
- Vercel hosting
- Razorpay-ready payment APIs

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Environment

Use `.env.example` as the reference. Never commit `.env.local`, `.env.local.txt`, Supabase service-role keys or payment secrets.

Apply [supabase/schema.sql](supabase/schema.sql) to the connected Supabase project before enabling persistent invitation publishing and RSVP storage.

## Validation

```bash
npm run build
npm run lint
```
