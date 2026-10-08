# Royal Procession — original InviteLink prototype

This branch is an internal experience prototype, **not a published guest invitation**.

## Canonical personalization and safe publishing

Edit only the JSON in `index.html` under `<script type="application/json" id="invite-data">`. Required: `names`, `primaryDate`, `location`, and one or more events with `id`, `name`, `start`, `end`, and `venue`. Optional story, photo and audio may be blank; unused modules must disappear.

After editing, run:

```bash
node prototypes/royal-procession/build.mjs
node prototypes/royal-procession/build.mjs --check
```

The build helper synchronizes the static HTML names/date/welcome and the `<noscript>` event cards from the canonical JSON. **Do not publish if the check fails.** The existing branch must remain NEEDS_REWORK until synchronized HTML is committed and two distinct personalization variants pass both JavaScript-enabled and disabled browser QA. For user-supplied strings, encode literal `<` as `\\u003c` inside embedded JSON to prevent a literal closing script tag; validate all fields before publication.

RSVP is only a nonpersistent demonstration; do not collect actual guest information through it. Do not claim live RSVP. Directions remain disabled until an exact, verified venue address is supplied. Sound is off by default. This prototype uses independent abstract light-path art; competitor artwork, code and motion are not licensed for reuse.

## Release gates

Test at 320px, 768px and 1440px; keyboard focus and screen readers; reduced motion; no-JS guest details; optional module omission; per-event calendar, map, share, privacy and broken links; network first-content performance; and timed required-core personalization <=2 minutes. Do not mark catalog-ready or LIVE until all gates pass and the actual published destination is verified.
