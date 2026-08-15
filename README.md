# Invite Link

Invite Link is a mobile-first digital invitation builder for assisted pilots with printing shops and event planners.

The cross-functional business backlog and operating cadence are maintained in `CEO_EXECUTION_PLAN.md`.

## Canonical product

The files in the repository root are the only production source of truth:

- `index.html`, `builder.css`, `builder.js`: invitation builder
- `templates.html`, `templates.css`, `templates.js`, `templates-data.js`: occasion gallery, shared template library, and live demos
- `invite.html`, `invite.css`, `invite.js`: published invitation renderer
- `vercel.json`: production routing and caching
- `scripts/verify.mjs`: release verification

The `/templates` portal uses React 19, Motion for React 12, and HTM through fixed ESM imports. Its shared-element preview interaction is adapted to Invite Link from 21st.dev gallery and morphing-dialog patterns; the builder and invitation renderer remain framework-free.

`old_vercel_website/`, `downloaded_vercel_project/`, `paperclip/`, and `temp_norah_templates/` are reference or migration material. Do not deploy or copy changes from them without an explicit migration decision.

## Operating decision

For the current pilot, this is an assisted-service product. A trained operator creates and publishes invitations for partner shops. It is not yet an unrestricted public self-service SaaS.

Production target: `https://norah-templates.vercel.app`

## Run locally

Serve the repository root with any static server. For example:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4173/`.

## Release gate

Run this before every deployment:

```powershell
node scripts/verify.mjs
```

To include the hosted image and music presets in the check:

```powershell
node scripts/verify.mjs --external
```

The release is blocked if JavaScript is invalid, a script references a missing DOM element, a required application file is absent, or a local asset reference cannot be resolved.

## Deployment rule

Deploy only from a clean `main` branch after the release gate and a manual create-to-preview smoke test pass. Production must never be edited independently from this repository.

The workspace contains large local reference directories. Stage only the canonical production bundle before running Vercel so those files are never scanned or uploaded:

```powershell
$stage = node scripts/stage-vercel.mjs
vercel link --cwd $stage --yes --scope invitation-links-projects --project norah-templates
vercel deploy --cwd $stage --yes --scope invitation-links-projects
```

## Current architecture risk

Publishing still uses the public Supabase client. Before opening self-service access, move publishing behind an authenticated server endpoint and enforce ownership, rate limits, storage quotas, and Row Level Security.
