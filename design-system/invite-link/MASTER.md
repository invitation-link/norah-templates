# Invite Link Design System

This file is the visual source of truth for the Invite Link product. The supplied logo is authoritative; product UI must use its palette and proportions without recoloring or distortion.

## Visual thesis

Warm editorial restraint meets a cinematic invitation experience: deep navy creates trust, gold marks moments of delight, and generous cream space lets template imagery carry the emotion.

## Product boundary

Invite Link is an experience gallery and controlled invitation customizer—not a drag-and-drop site builder. The core journey is always **Choose → Personalize → Share**.

## Brand palette

| Role | Token | Value |
|---|---|---|
| Primary ink | `--navy-950` | `#071A38` |
| Primary action | `--navy-900` | `#0A2A54` |
| Hover / secondary navy | `--navy-800` | `#123A69` |
| Accessible gold text | `--gold-600` | `#A96F00` |
| Brand gold | `--gold-500` | `#E6A719` |
| Soft gold | `--gold-300` | `#F2CC69` |
| Canvas | `--cream` | `#FBF8F1` |
| Secondary canvas | `--cream-deep` | `#F3EDE0` |
| Surface | `--white` | `#FFFFFF` |
| Secondary text | `--ink-muted` | `#5A6677` |

Do not add product-level accent colors. Individual invitation artwork can retain its own occasion-specific palette inside preview imagery and invitation routes.

## Typography

- Brand and interface: Inter
- Editorial headlines: Playfair Display
- Invitation-specific script typography stays inside invitation templates only.
- Body text is at least 16px on mobile with 1.5–1.7 line height.

## Composition

- Treat the homepage hero as a poster: one promise, one primary CTA, one strong invitation image.
- Use full-bleed navy sections to create rhythm; avoid generic card mosaics.
- Template tiles are media-first and may use a card boundary because the image is the interaction.
- Section spacing follows an 8px rhythm and ranges from 80–150px on desktop.

## Interaction

- Hero content enters in a restrained stagger.
- Hero imagery uses subtle scroll depth.
- Template filters use shared layout transitions; previews open in an interruptible modal.
- Micro-interactions use 150–300ms. Complex entrances stay under 450ms.
- All animation respects `prefers-reduced-motion`.

## Accessibility

- Minimum 44px touch targets.
- Visible gold focus ring against both cream and navy.
- Body-copy contrast meets WCAG AA.
- No emoji as structural icons; use Lucide icons consistently.
- Do not rely on hover to expose the only path to a live preview.

## Brand usage

- `public/brand/invite-link-logo.png` is the supplied original.
- `invite-link-lockup.png` and `invite-link-mark.png` are crop-only optimized derivatives.
- Preserve clear space and aspect ratio. Never recolor the mark.
