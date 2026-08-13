# Ganishka Invite - Agent Production Workflow

> **Purpose**: Step-by-step micro-instructions for creating immersive invitation templates.
> Each step has: **OBJECTIVE** → **ACTION** → **SUCCESS CRITERIA**

---

## PHASE 1: DESIGN SPECIFICATION (30 min)

### Step 1.1: Define Template Identity
**OBJECTIVE**: Establish the core identity of the template.

**ACTION**:
1. Choose template category: `Birthday | Wedding | Corporate | Baby Shower | Graduation | Anniversary`
2. Name the template (e.g., "Royal Maroon", "Neon Party", "Golden Unboxing")
3. Define target emotion: `Joy | Romance | Professionalism | Celebration | Achievement`

**SUCCESS CRITERIA**: ✅ Category, name, and target emotion documented.

---

### Step 1.2: Select Color Palette
**OBJECTIVE**: Create a harmonious, premium color scheme.

**ACTION**:
1. Choose primary color (brand/theme)
2. Choose secondary color (accent)
3. Choose background gradient (2-3 colors)
4. Define text colors (dark on light, light on dark)

**SUCCESS CRITERIA**: ✅ 4+ colors defined as CSS variables in `:root`.

```css
:root {
    --primary: #...;
    --secondary: #...;
    --bg-start: #...;
    --bg-end: #...;
    --text: #...;
}
```

---

### Step 1.3: Choose Typography
**OBJECTIVE**: Select fonts that match the template's personality.

**ACTION**:
1. Choose display font (for names/titles) - script or decorative
2. Choose body font (for content) - readable serif/sans
3. Import from Google Fonts

**SUCCESS CRITERIA**: ✅ 2 fonts imported and classes defined.

---

### Step 1.4: Design Reveal Mechanism
**OBJECTIVE**: Create a unique, memorable reveal experience.

**ACTION**: Choose ONE reveal type:
| Category | Reveal Type | Element |
|----------|-------------|---------|
| Birthday | Gift box explosion | `#gift-box` |
| Wedding | Envelope open | `#envelope` |
| Wedding (Indian) | Diya glow | `#diya` |
| Corporate | Logo scale | `#logo-view` |
| Baby Shower | Stork/Rattle | `#stork` |
| Graduation | Cap throw | `#cap` |

**SUCCESS CRITERIA**: ✅ Reveal element identified with unique ID.

---

### Step 1.5: Map 7-Beat Emotional Journey
**OBJECTIVE**: Plan the exact timing and sensory feedback for each beat.

**ACTION**: Fill in this table for the template:

| Beat | Time (ms) | Visual | Sound | Haptic |
|------|-----------|--------|-------|--------|
| 1. MYSTERY | 0 | Tap prompt pulses | `tap()` | `softTap()` |
| 2. ANTICIPATION | 100-500 | Element scales/shakes | `giftShake()` or none | `anticipation()` |
| 3. REVEAL | 500-1000 | Flash + explosion | `giftExplode()` / `magicReveal()` | `giftExplosion()` / `reveal()` |
| 4. DELIGHT | 1000-1500 | Confetti burst | `confettiPop()` | `celebration()` |
| 5. DISCOVERY | 1500-2500 | Main content fades in | `success()` | `success()` |
| 6. CONNECTION | 2500-4000 | Elements stagger in | subtle | `softTap()` each |
| 7. ACTION | 4000+ | CTA visible | `click()` | `softTap()` |

**SUCCESS CRITERIA**: ✅ All 7 beats have timing, visual, sound, and haptic defined.

---

## PHASE 2: BUILD STRUCTURE (1-2 hours)

### Step 2.1: Create File Structure
**OBJECTIVE**: Set up the template file in the correct location.

**ACTION**:
```
templates/
  {category}/
    {template-name}/
      index.html      ← Create this
      preview.png     ← Generate later
```

**SUCCESS CRITERIA**: ✅ `index.html` exists at correct path.

---

### Step 2.2: Build HTML Skeleton
**OBJECTIVE**: Create the two-layer structure (reveal + main).

**ACTION**: Create this structure:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Meta tags -->
    <!-- Fonts -->
    <!-- Scripts: Tailwind, GSAP, Confetti -->
    <!-- Audio/Haptic Engines -->
    <style>/* CSS */</style>
</head>
<body>
    <div id="app">
        <!-- LAYER 1: Reveal Screen (z-index: 100) -->
        <div id="reveal-view">
            <!-- Reveal element (gift, envelope, logo, etc.) -->
            <!-- "Tap to Open" prompt -->
        </div>
        
        <!-- LAYER 2: Main Content (z-index: 50, initially hidden) -->
        <div id="main-view" style="opacity: 0;">
            <!-- Header with names/title -->
            <!-- Countdown -->
            <!-- Event details -->
            <!-- RSVP form -->
            <!-- Footer -->
        </div>
    </div>
    <script>/* JavaScript */</script>
</body>
</html>
```

**SUCCESS CRITERIA**: ✅ Both `#reveal-view` and `#main-view` exist.

---

### Step 2.3: Style Reveal Screen
**OBJECTIVE**: Make the reveal screen visually stunning and interactive.

**ACTION**:
1. Full-screen gradient background
2. Center the reveal element
3. Add glow/pulse animation to reveal element
4. Add "Tap to Open" with pulse animation
5. Add `cursor: pointer` and `onclick` handler

**SUCCESS CRITERIA**: ✅ Reveal screen fills viewport, element is centered, prompt pulses.

---

### Step 2.4: Style Main Content
**OBJECTIVE**: Create a beautiful, scrollable main view.

**ACTION**:
1. Header section with names/title
2. Countdown boxes (Days / Hours / Mins)
3. Event cards with icons
4. RSVP form with styled inputs
5. Footer with branding

**SUCCESS CRITERIA**: ✅ All sections styled, scrollable, mobile-responsive.

---

### Step 2.5: Add Scripts & Dependencies
**OBJECTIVE**: Include all required libraries.

**ACTION**: Add in `<head>`:
```html
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>

<!-- Immersive Experience Engines -->
<script src="../../_base/audio-engine.js"></script>
<script src="../../_base/haptic-engine.js"></script>
```

**SUCCESS CRITERIA**: ✅ All 5 scripts load without 404 errors.

---

## PHASE 3: INTEGRATE EXPERIENCE LAYER (30 min)

### Step 3.1: Initialize Audio/Haptic Accessors
**OBJECTIVE**: Create safe accessors with fallbacks.

**ACTION**: Add at start of `<script>`:
```javascript
const Audio = window.GanishkaAudio || {
    tap: () => {}, click: () => {}, success: () => {},
    magicReveal: () => {}, confettiPop: () => {},
    giftShake: () => {}, giftExplode: () => {},
    slideUp: () => {}, slideDown: () => {}
};
const Haptic = window.GanishkaHaptic || {
    softTap: () => {}, tap: () => {}, success: () => {},
    celebration: () => {}, reveal: () => {}, impact: () => {},
    anticipation: () => {}, giftExplosion: () => {},
    slideUp: () => {}, slideDown: () => {}
};
```

**SUCCESS CRITERIA**: ✅ No "undefined" errors if engines don't load.

---

### Step 3.2: Implement Reveal Function
**OBJECTIVE**: Create the 7-beat reveal animation with sound/haptic.

**ACTION**: Implement `revealApp()` or `openEnvelope()` following this pattern:
```javascript
function revealApp() {
    if (isRevealed) return;
    isRevealed = true;

    // BEAT 1: MYSTERY
    Audio.tap();
    Haptic.softTap();

    // BEAT 2: ANTICIPATION (100-500ms)
    setTimeout(() => {
        Audio.giftShake(); // or skip for subtle reveals
        Haptic.anticipation();
    }, 100);

    // BEAT 3: REVEAL (500-1000ms)
    setTimeout(() => {
        Audio.giftExplode(); // or magicReveal()
        Haptic.giftExplosion(); // or reveal()
    }, 500);

    // BEAT 4: DELIGHT (1000-1500ms)
    setTimeout(() => {
        Audio.confettiPop();
        Haptic.celebration();
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }, 1000);

    // GSAP animation
    gsap.to("#reveal-view", { opacity: 0, scale: 1.1, duration: 0.8 });
    
    // BEAT 5: DISCOVERY (1500-2500ms)
    setTimeout(() => {
        gsap.to("#main-view", { opacity: 1, duration: 0.6 });
        Audio.success();
        Haptic.success();
    }, 1500);

    // BEAT 6: CONNECTION - stagger elements
    // BEAT 7: ACTION - show CTA
}
```

**SUCCESS CRITERIA**: ✅ Reveal plays all 7 beats with correct timing.

---

### Step 3.3: Add Feedback to All Interactions
**OBJECTIVE**: Every tap should provide audio + haptic feedback.

**ACTION**: Add to EACH interactive element:

| Element | Sound | Haptic |
|---------|-------|--------|
| Tap reveal | `Audio.tap()` | `Haptic.softTap()` |
| Tab switch | `Audio.tap()` | `Haptic.softTap()` |
| Button click | `Audio.click()` | `Haptic.tap()` |
| Form submit | `Audio.confettiPop()` | `Haptic.celebration()` |
| Sheet open | `Audio.slideUp()` | `Haptic.slideUp()` |
| Sheet close | `Audio.slideDown()` | `Haptic.slideDown()` |

**SUCCESS CRITERIA**: ✅ Every click/tap produces feedback.

---

## PHASE 4: QC EXPERIENCE (15 min)

### Step 4.1: Visual QC
**OBJECTIVE**: Ensure premium visual quality.

**ACTION**: Check each item:
- [ ] Reveal animation is smooth (60fps)
- [ ] Confetti appears at peak moment
- [ ] Colors are vibrant and harmonious
- [ ] Typography is elegant and readable
- [ ] No elements cut off on mobile (test 375px width)
- [ ] Gradient backgrounds are smooth

**SUCCESS CRITERIA**: ✅ All 6 visual items pass.

---

### Step 4.2: Audio QC
**OBJECTIVE**: Ensure rich audio experience.

**ACTION**: Check each item:
- [ ] Sound plays on first tap (not before)
- [ ] Reveal has 3+ distinct sounds
- [ ] Success chime plays when content appears
- [ ] All buttons have tap sounds
- [ ] No audio pops or glitches
- [ ] Console shows "AudioEngine initialized"

**SUCCESS CRITERIA**: ✅ All 6 audio items pass.

---

### Step 4.3: Haptic QC
**OBJECTIVE**: Ensure tactile feedback on mobile.

**ACTION**: Test on real mobile device:
- [ ] Initial tap has immediate vibration
- [ ] Reveal moment has strong haptic burst
- [ ] Button taps have subtle feedback
- [ ] Celebration moments have pattern

**SUCCESS CRITERIA**: ✅ All 4 haptic items pass on mobile.

---

### Step 4.4: Emotional Journey QC
**OBJECTIVE**: Ensure the experience is memorable and moving.

**ACTION**: Watch reveal with fresh eyes:
- [ ] First 3 seconds create mystery/anticipation
- [ ] Reveal takes 3-5 seconds (not instant)
- [ ] User feels surprised and delighted
- [ ] Music (if any) enhances the mood
- [ ] Elements appear with satisfying timing
- [ ] Overall feels "WOW" not "meh"

**SUCCESS CRITERIA**: ✅ All 6 emotional items pass.

---

### Step 4.5: Technical QC
**OBJECTIVE**: Ensure no errors and smooth performance.

**ACTION**: Check browser console:
- [ ] No JavaScript errors
- [ ] No 404 errors for scripts
- [ ] Audio/Haptic engines loaded
- [ ] Fallbacks work if engines missing
- [ ] Scroll performance is smooth

**SUCCESS CRITERIA**: ✅ All 5 technical items pass.

---

## PHASE 5: FINALIZE & DEPLOY (15 min)

### Step 5.1: Add SEO Meta Tags
**OBJECTIVE**: Optimize for search and social sharing.

**ACTION**: Add to `<head>`:
```html
<title>{Event} Invitation | InviteMagic</title>
<meta name="description" content="...">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="preview.png">
```

**SUCCESS CRITERIA**: ✅ Title, description, and OG tags present.

---

### Step 5.2: Generate Preview Image
**OBJECTIVE**: Create thumbnail for template selection.

**ACTION**:
1. Open template in browser
2. Screenshot the reveal view (before tap)
3. Resize to 400x300px
4. Save as `preview.png` in template folder

**SUCCESS CRITERIA**: ✅ `preview.png` exists and shows reveal state.

---

### Step 5.3: Add to Template Registry
**OBJECTIVE**: Register template for platform selection.

**ACTION**: Add entry to template registry with:
- ID, name, category
- Path to index.html
- Path to preview.png
- Feature flags

**SUCCESS CRITERIA**: ✅ Template appears in template picker.

---

### Step 5.4: Final Test
**OBJECTIVE**: Verify everything works in production.

**ACTION**:
1. Load template from production URL
2. Complete full reveal flow
3. Submit test RSVP
4. Check all tabs/sections

**SUCCESS CRITERIA**: ✅ Full flow works without errors.

---

## AGENT CHECKLIST SUMMARY

```
□ Phase 1: Design (5 steps)
  □ 1.1 Template identity defined
  □ 1.2 Color palette created
  □ 1.3 Typography selected
  □ 1.4 Reveal mechanism designed
  □ 1.5 7-beat journey mapped

□ Phase 2: Build (5 steps)
  □ 2.1 File structure created
  □ 2.2 HTML skeleton built
  □ 2.3 Reveal screen styled
  □ 2.4 Main content styled
  □ 2.5 Scripts added

□ Phase 3: Integrate (3 steps)
  □ 3.1 Accessors initialized
  □ 3.2 Reveal function implemented
  □ 3.3 All interactions have feedback

□ Phase 4: QC (5 steps)
  □ 4.1 Visual QC passed
  □ 4.2 Audio QC passed
  □ 4.3 Haptic QC passed
  □ 4.4 Emotional QC passed
  □ 4.5 Technical QC passed

□ Phase 5: Deploy (4 steps)
  □ 5.1 SEO meta tags added
  □ 5.2 Preview image generated
  □ 5.3 Added to registry
  □ 5.4 Final test passed
```

**TOTAL: 22 micro-steps to production-ready template.**

---

## APPENDIX A: NEURO-PSYCHOLOGICAL EMOTION MAPPING

> **Purpose**: Analyze the guest's emotional journey like a neuroscientist & psychologist.
> Use this framework during QC Phase 4 to ensure maximum emotional impact.

---

### The Science Behind Immersive Invitations

**Key Principles**:
1. **Dopamine Anticipation** - Reward comes from anticipation, not just the reveal
2. **Peak-End Rule** - People remember peak moments and endings most vividly
3. **Multi-Sensory Memory** - Touch + Sound + Visual = 3x stronger memory encoding
4. **Emotional Contagion** - Invitation emotion transfers to event expectation

---

### Guest Emotional Journey Analysis

#### Timeline: First 10 Seconds

| Second | Stage | Neural State | Target Emotion | Sensory Trigger |
|--------|-------|--------------|----------------|-----------------|
| 0-1 | **Landing** | Orienting response | Curiosity | Visual: gradient, glow |
| 1-3 | **Discovery** | Attention capture | Intrigue | Animation: pulse, hint |
| 3-5 | **Anticipation** | Dopamine release begins | Excitement | Sound: tap, shake |
| 5-7 | **Peak Moment** | Maximum dopamine | Surprise + Delight | Explosion, confetti, chord |
| 7-9 | **Resolution** | Oxytocin release | Warmth, Connection | Names appear, music |
| 9-10 | **Memory Encoding** | Hippocampus activation | Satisfaction | Success chime |

---

### Template-Specific Emotion Maps

#### 🎂 BIRTHDAY TEMPLATE

**Target Guest Emotions**:
| Phase | Emotion | Psychological Trigger | Measurement |
|-------|---------|----------------------|-------------|
| Pre-reveal | Wonder | "What's in the gift?" curiosity gap | Eyes widen |
| Tap | Anticipation | Tactile feedback = permission granted | Leaning forward |
| Shake | Suspense | Delayed gratification builds dopamine | Breath held |
| Explosion | Joy + Surprise | Unexpected magnitude exceeds expectations | Smile/laugh |
| Photo reveal | Nostalgia | Personal image triggers episodic memory | Emotional softening |
| Candle blow | Participation | Agency creates ownership of experience | Physical action |
| Heart tap | Affection | Social bonding through love expression | Warmth feeling |

**Neuroscience Notes**:
- Gift-opening mimics childhood reward pathways
- Candle interaction creates "I was there" memory marker
- Music triggers autobiographical memory associations

**QC Emotional Checklist**:
- [ ] Does the gift shake create genuine suspense? (2+ seconds)
- [ ] Does the explosion exceed visual expectations?
- [ ] Does seeing the photo trigger a warm feeling?
- [ ] Does blowing the candle feel satisfying?
- [ ] Would guest want to share this experience?

---

#### 💒 WEDDING TEMPLATE

**Target Guest Emotions**:
| Phase | Emotion | Psychological Trigger | Measurement |
|-------|---------|----------------------|-------------|
| Pre-reveal | Reverence | Sacred envelope = formal importance | Respectful pause |
| Seal break | Privilege | "I am invited" social inclusion | Sense of honor |
| Envelope open | Romance | Slow reveal = romantic anticipation | Emotional warmth |
| Names appear | Celebration | Focus on couple's names = recognition | Joy for couple |
| Details | Excitement | Countdown creates urgency to attend | Planning impulse |
| RSVP submit | Commitment | Public commitment = social bonding | Satisfaction |

**Neuroscience Notes**:
- Envelope metaphor triggers "receiving special communication" schema
- Flower petals activate nature/fertility associations
- Countdown creates time-pressure motivation

**QC Emotional Checklist**:
- [ ] Does opening feel like opening a real wedding invite?
- [ ] Does the couple's name reveal feel like a "moment"?
- [ ] Do flowers/petals create a romantic atmosphere?
- [ ] Does RSVP submission feel celebratory, not transactional?
- [ ] Would guest show this to others with pride?

---

#### 🏢 CORPORATE TEMPLATE

**Target Guest Emotions**:
| Phase | Emotion | Psychological Trigger | Measurement |
|-------|---------|----------------------|-------------|
| Pre-reveal | Professionalism | Clean design = credibility established | Trust |
| Logo reveal | Recognition | Brand familiarity = safety | Acknowledgement |
| Transition | Impressiveness | Smooth animation = competence signal | Respect |
| Details | Interest | Clear value proposition | Engagement |
| RSVP/Calendar | Efficiency | Easy action = respect for their time | Appreciation |

**Neuroscience Notes**:
- Professional context requires subtler emotional triggers
- Competence signals (smooth animations) build trust
- Efficiency reduces cognitive load = positive association

**QC Emotional Checklist**:
- [ ] Does the reveal feel premium but not flashy?
- [ ] Does animation signal "this is a well-run event"?
- [ ] Is information hierarchy clear and scannable?
- [ ] Does adding to calendar feel effortless?
- [ ] Would a busy executive appreciate this format?

---

#### 👶 BABY SHOWER TEMPLATE

**Target Guest Emotions**:
| Phase | Emotion | Psychological Trigger | Measurement |
|-------|---------|----------------------|-------------|
| Pre-reveal | Tenderness | Soft colors = nurturing response | Heart softening |
| Reveal | Joy | New life celebration | Smile |
| Details | Excitement | "I get to celebrate this!" | Planning joy |
| Gender reveal | Surprise | Unknown → Known transition | Gasp/delight |

**Neuroscience Notes**:
- Pastel colors activate nurturing brain regions
- Baby imagery triggers protective instincts
- Gender reveal creates mini-narrative tension

**QC Emotional Checklist**:
- [ ] Do colors feel soft and nurturing?
- [ ] Does imagery trigger "awww" response?
- [ ] If gender reveal, is the surprise moment satisfying?
- [ ] Would guest feel excited to celebrate new life?

---

#### 🎓 GRADUATION TEMPLATE

**Target Guest Emotions**:
| Phase | Emotion | Psychological Trigger | Measurement |
|-------|---------|----------------------|-------------|
| Pre-reveal | Anticipation | Achievement celebration ahead | Excitement |
| Cap throw | Pride | Accomplishment visualization | Chest swelling |
| Confetti | Triumph | Victory celebration | Elation |
| Details | Support | "I witnessed their journey" | Pride in graduate |

**Neuroscience Notes**:
- Achievement imagery activates reward pathways
- Cap throw = universal graduation symbol
- Triumphant music triggers collective celebration response

**QC Emotional Checklist**:
- [ ] Does cap animation feel triumphant?
- [ ] Does confetti feel like a celebration, not just decoration?
- [ ] Would guest feel proud of the graduate?
- [ ] Does the experience honor the achievement appropriately?

---

### Psychological QC Framework

#### A. Immediate Response Test (0-3 seconds)
| Measure | Pass | Fail |
|---------|------|------|
| Attention captured | Guest focuses on reveal | Guest distracted |
| Curiosity triggered | Wants to tap | Hesitates or confused |
| Brand impression | "This is premium" | "This looks cheap" |

#### B. Peak Moment Test (3-7 seconds)
| Measure | Pass | Fail |
|---------|------|------|
| Surprise achieved | Visible reaction | No reaction |
| Delight expressed | Smile or vocalization | Neutral face |
| Sensory engagement | Multi-sense activation | Visual only |

#### C. Memory Formation Test (7-10 seconds)
| Measure | Pass | Fail |
|---------|------|------|
| Emotional peak | Clear high point | Flat experience |
| Personal connection | Meaningful content | Generic content |
| Completion satisfaction | Sense of fulfillment | Abrupt ending |

#### D. Sharing Impulse Test
| Measure | Pass | Fail |
|---------|------|------|
| Would guest screenshot? | Yes, to share | No, not memorable |
| Would guest re-open? | Yes, to re-experience | No, one-time view |
| Would guest tell others? | "You have to see this!" | No mention |

---

### Emotion Optimization Techniques

**If curiosity is LOW**:
- Add mystery to reveal element (glow, pulse, particles)
- Increase hint text urgency ("Tap to discover")
- Add subtle ambient sound

**If surprise is LOW**:
- Increase explosion magnitude
- Add unexpected elements (more confetti, flash)
- Make reveal faster (peak should hit suddenly)

**If warmth is LOW**:
- Ensure personal content (names, photos) appears prominently
- Add romantic/soft music
- Use warmer color palette

**If satisfaction is LOW**:
- Add clear success sound after reveal
- Ensure all content loads smoothly
- Add micro-celebrations at key moments

---

### Research References

1. **Kahneman's Peak-End Rule** - Memory of experience determined by peak + end
2. **Dopamine Prediction Error** - Surprise = expectation exceeded → dopamine surge
3. **Multisensory Integration** - Touch + Sound + Visual = stronger encoding
4. **Embodied Cognition** - Physical interaction → emotional ownership
5. **Emotional Contagion Theory** - Positive invite → positive event expectation

---

## APPENDIX B: MASS PRODUCTION WORKFLOW

> **Purpose**: Efficiently produce 50+ templates while maintaining quality standards.

---

### Batch Production Strategy

#### Recommended Approach: Category Waves

```
WAVE 1: Core Templates (1 per category)     → 6 templates
WAVE 2: Variant Expansion (3 per category)  → 18 templates  
WAVE 3: Cultural/Regional (5 per category)  → 30 templates
WAVE 4: Niche/Premium (custom)              → 20+ templates
```

---

### Wave 1: Core Template Creation (Week 1)

**OBJECTIVE**: Create 1 "gold standard" template per category.

| Day | Category | Template Name | Status |
|-----|----------|---------------|--------|
| 1 | Birthday | Golden Unboxing | ✅ Done |
| 2 | Wedding | Royal Envelope | ✅ Done |
| 3 | Corporate | The Summit | ✅ Done |
| 4 | Baby Shower | Stork Delivery | □ Pending |
| 5 | Graduation | Cap Toss | □ Pending |
| 6 | Anniversary | Heart Bloom | □ Pending |

**Process**:
1. Full 22-step workflow per template
2. Complete neuro-psych QC
3. Document learnings for variants

---

### Wave 2: Variant Expansion (Week 2-3)

**OBJECTIVE**: Create 3 color/style variants per core template.

**Variant Types**:
| Type | Description | Changes Required |
|------|-------------|------------------|
| **Color Variant** | Different palette | CSS variables only |
| **Style Variant** | Different fonts/layout | CSS + minor HTML |
| **Cultural Variant** | Regional customization | HTML + content |

**Batch Processing**:
```
FOR each core_template:
    1. Duplicate folder
    2. Update CSS variables (5 min)
    3. Update fonts if needed (5 min)
    4. Quick QC (10 min)
    5. Generate preview (2 min)
    TOTAL: ~25 min per variant
```

---

### Wave 3: Cultural/Regional Templates (Week 4-5)

**OBJECTIVE**: Create culturally-specific templates.

| Category | Cultural Variants |
|----------|------------------|
| Wedding | Bengali, Marathi, Punjabi, Tamil, Nikah, Christian |
| Birthday | Kids Cartoon, Teen Neon, Adult Elegant, Senior Classic |
| Corporate | Tech Startup, Finance, Healthcare, Education |

**Batch Processing for Cultural**:
1. Research cultural elements (colors, symbols, music)
2. Adapt reveal mechanism (diya, mandap, cross, etc.)
3. Localize text/fonts
4. Cultural QC with native reviewer

---

### Agent Batch Commands

**For Color Variants (Fastest)**:
```bash
# Clone template
cp -r templates/wedding/royal-maroon templates/wedding/peacock-blue

# Update colors in CSS (agent task)
AGENT: "Update CSS variables in peacock-blue to use blue-green palette"

# Generate preview
AGENT: "Screenshot reveal view and save as preview.png"
```

**For Full Templates (Standard)**:
```bash
AGENT: "Create new baby-shower template called 'stork-delivery' following the 22-step production workflow"
```

---

### Mass QC Protocol

**Batch QC Sessions** (Every 5 templates):
1. Load all 5 templates in browser tabs
2. Run through each reveal sequentially
3. Compare emotional impact
4. Flag any that feel "flat"
5. Document fixes needed

**QC Metrics Dashboard**:
| Template | Visual | Audio | Haptic | Emotion | SEO | Total |
|----------|--------|-------|--------|---------|-----|-------|
| golden-unboxing | ✅ | ✅ | ✅ | ✅ | ✅ | 5/5 |
| royal-maroon | ✅ | ✅ | ✅ | ✅ | ✅ | 5/5 |
| peacock-blue | ✅ | ✅ | ✅ | □ | □ | 3/5 |

---

### Production Timeline

| Week | Focus | Templates | Cumulative |
|------|-------|-----------|------------|
| 1 | Core templates | 6 | 6 |
| 2 | Wedding variants | 8 | 14 |
| 3 | Birthday variants | 8 | 22 |
| 4 | Other variants | 12 | 34 |
| 5 | Cultural expansion | 16 | 50 |
| 6 | QC & Polish | - | 50 |

---

## APPENDIX C: SEO & AI SEARCH OPTIMIZATION

> **Purpose**: Ensure templates are discoverable by search engines and AI assistants.

---

### SEO Checklist (Add to Phase 5)

#### Step 5.1a: Meta Tags (Required)
```html
<head>
    <!-- Primary Meta -->
    <title>{Person}'s {Event} Invitation | InviteMagic</title>
    <meta name="description" content="You're invited to {Person}'s {Event} on {Date} at {Venue}. RSVP now!">
    <meta name="keywords" content="{event type}, invitation, {location}, digital invite">
    <meta name="author" content="InviteMagic">
    <meta name="robots" content="index, follow">
    
    <!-- Open Graph (Facebook/LinkedIn) -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="🎉 You're Invited! {Person}'s {Event}">
    <meta property="og:description" content="Join us on {Date} at {Venue}">
    <meta property="og:image" content="{absolute-url}/preview.png">
    <meta property="og:url" content="{absolute-url}">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{Person}'s {Event} Invitation">
    <meta name="twitter:description" content="You're invited!">
    <meta name="twitter:image" content="{absolute-url}/preview.png">
</head>
```

**SUCCESS CRITERIA**: ✅ All 12 meta tags present with dynamic content.

---

#### Step 5.1b: Structured Data (Schema.org)
```html
<script type="application/ld+json">
{
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "{Person}'s {Event}",
    "description": "{Event description}",
    "startDate": "{ISO-8601 date}",
    "endDate": "{ISO-8601 date}",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
        "@type": "Place",
        "name": "{Venue Name}",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "{Address}",
            "addressLocality": "{City}",
            "addressRegion": "{State}",
            "postalCode": "{PIN}",
            "addressCountry": "IN"
        }
    },
    "organizer": {
        "@type": "Person",
        "name": "{Host Name}"
    },
    "offers": {
        "@type": "Offer",
        "url": "#rsvp",
        "price": "0",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock"
    },
    "image": "{absolute-url}/preview.png"
}
</script>
```

**SUCCESS CRITERIA**: ✅ Valid JSON-LD schema that passes Google Rich Results Test.

---

### AI Search Optimization (LLMs/ChatGPT/Perplexity)

#### Step 5.1c: AI-Friendly Content Structure
```html
<!-- Clear semantic structure for AI parsing -->
<main>
    <article itemscope itemtype="https://schema.org/Event">
        <header>
            <h1 itemprop="name">{Event Title}</h1>
            <time itemprop="startDate" datetime="{ISO-date}">{Human Date}</time>
        </header>
        
        <section aria-label="Event Details">
            <address itemprop="location" itemscope itemtype="https://schema.org/Place">
                <span itemprop="name">{Venue}</span>
                <span itemprop="address">{Full Address}</span>
            </address>
        </section>
        
        <section aria-label="RSVP">
            <form id="rsvp-form" action="#" method="POST">
                <!-- Form fields -->
            </form>
        </section>
    </article>
</main>
```

**SUCCESS CRITERIA**: ✅ Semantic HTML with aria-labels and microdata.

---

### Crawler Configuration

#### robots.txt (Project Root)
```txt
# Ganishka Invite - Crawler Configuration
User-agent: *
Allow: /
Allow: /templates/
Allow: /u/

# Disallow admin/system paths
Disallow: /api/
Disallow: /.netlify/
Disallow: /admin/

# Sitemap
Sitemap: https://invitemagic.in/sitemap.xml

# AI Crawlers (Explicitly Allow)
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

# Rate limiting hint
Crawl-delay: 1
```

**SUCCESS CRITERIA**: ✅ robots.txt in project root with AI crawlers allowed.

---

#### sitemap.xml (Auto-Generated)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://invitemagic.in/</loc>
        <lastmod>2026-01-03</lastmod>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://invitemagic.in/templates/wedding/</loc>
        <priority>0.8</priority>
    </url>
    <!-- Dynamic template entries -->
</urlset>
```

---

### SEO QC Checklist (Add to Phase 4.5)

#### Step 4.5a: SEO Validation
- [ ] Title tag is unique and < 60 characters
- [ ] Meta description is compelling and < 160 characters
- [ ] OG image is 1200x630px and shows reveal state
- [ ] Schema.org JSON-LD is valid (test at search.google.com/test/rich-results)
- [ ] Canonical URL is set if template has variants
- [ ] No duplicate H1 tags (only 1 per page)

#### Step 4.5b: AI Discoverability
- [ ] Semantic HTML structure (article, section, header, etc.)
- [ ] aria-labels on major sections
- [ ] Content is in HTML, not just JavaScript-rendered
- [ ] Key info (date, venue, names) is in visible text, not just images

#### Step 4.5c: Crawler Access
- [ ] Template URL is not blocked in robots.txt
- [ ] Template returns 200 status code
- [ ] No noindex meta tag present
- [ ] Page loads in < 3 seconds (Core Web Vitals)

---

### Production Build Commands

```bash
# Validate robots.txt
npx robots-parser-check robots.txt

# Generate sitemap
npx sitemap-generator https://invitemagic.in -o sitemap.xml

# Test structured data
npx structured-data-testing-tool templates/wedding/index.html

# Check Core Web Vitals
npx lighthouse https://invitemagic.in/u/demo --only-categories=performance,seo
```

---

### Quick Reference: SEO Tags Template

```html
<!-- Copy-paste SEO block for new templates -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="{primary-color}">

<title>{Name}'s {Event} | InviteMagic</title>
<meta name="description" content="You're invited to {Name}'s {Event} on {Date}. RSVP online now!">
<meta name="robots" content="index, follow">

<meta property="og:type" content="website">
<meta property="og:title" content="🎉 {Name}'s {Event} Invitation">
<meta property="og:description" content="Join us for this special celebration">
<meta property="og:image" content="preview.png">

<meta name="twitter:card" content="summary_large_image">
```

