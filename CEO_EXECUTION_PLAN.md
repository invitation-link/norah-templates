# Invite Link CEO Execution Plan

**Plan date:** 17 July 2026  
**Operating window:** Immediate through 90 days  
**Primary market:** Printing shops in Hyderabad  
**Operating model:** Assisted B2B service first; self-service only after repeat paid demand

## 1. CEO directives

These decisions remain fixed until the 30-day review:

1. **One product:** the static application in the repository root is the pilot product.
2. **One customer:** printing shops are the primary ICP; event planners are secondary.
3. **One city:** Hyderabad is the first sales territory.
4. **One promise:** a premium invitation link, created and quality-checked the same business day, ready to share on WhatsApp.
5. **One revenue motion:** wholesale pay-per-invite before subscriptions.
6. **One north-star metric:** paid invitations published per week.
7. **No paid advertising:** until at least two partners have purchased repeatedly.
8. **No public self-service:** until publishing, ownership, editing, security, and support are production-ready.

## 2. Current reality

### Completed foundation

- Canonical static product documented.
- Housewarming, wedding, birthday, and baby-shower modes added.
- Broken presets and preview failures repaired.
- Personal customer defaults removed.
- Basic upload validation, text safety, security headers, and cleanup added.
- Automated repository and asset verification added.

### Product capabilities that can be sold honestly today

- Mobile invitation link.
- Four celebration categories.
- Custom names, event details, colors, text, photographs, and music.
- Google Maps directions.
- WhatsApp-based RSVP responses.
- WhatsApp sharing.
- Hosted public invitation URL.

### Capabilities that must not be promised yet

- Live RSVP dashboard.
- Guest database or headcount analytics.
- Multi-event guest assignment.
- Automatic WhatsApp reminders.
- Owner login and self-service editing.
- Payment checkout.
- Partner dashboard or vendor referral portal.
- Guaranteed live updates after publishing.
- Custom domain automation.

## 3. Market baseline validated on 17 July 2026

- Bulawa advertises a template-assisted wedding invitation website for ₹1,499, delivered in 24 hours, including photographs, countdown, maps, and hosting until the wedding: https://bulawa.in/
- Aamantran advertises self-service wedding invitations from ₹999 with live RSVP, multiple events, music, galleries, maps, and editing: https://www.aamantran.online/
- MyAamantran advertises an all-feature ₹2,499 wedding product and a vendor program paying 20% referral commission: https://myaamantran.in/
- Razorpay requires account onboarding and KYC before live payment acceptance; test mode can be used before activation: https://razorpay.com/docs/payments/quickstart/

### Strategic implication

Invite Link should not position itself as the most feature-rich wedding platform. The initial advantage is:

> A printer can add a premium digital invitation to an existing card order, earn a strong margin, and have Invite Link deliver it without learning software.

## 4. Initial commercial offer

Pricing below is a hypothesis to validate, not a permanent price sheet.

### Pilot partner offer

- One free branded demonstration using sample data.
- First three real invitations at **₹399 wholesale each**.
- Suggested partner resale price: **₹999–₹1,499**.
- Same-business-day delivery after complete details and assets are received.
- One correction round included.
- Hosting through the event date plus 30 days.
- Additional correction rounds: ₹199 each.

### Standard offer after the pilot

- Standard invitation: **₹499 wholesale**.
- Suggested resale: **₹1,499**.
- Ten-invite prepaid pack: **₹3,999**, valid for 60 days.
- Designer-assisted premium invitation: **from ₹1,499 wholesale**.
- Suggested premium resale: **₹2,999–₹4,999**.

### Commercial rules

- Collect payment before publishing a live customer invite.
- Do not offer unlimited revisions.
- Do not offer monthly subscriptions until a partner has purchased at least five invites.
- Do not discount below the pilot rate; add value instead.
- Record the partner resale price to measure channel economics.

## 5. Immediate critical path: next 72 hours

| ID | Task | Owner | Deadline | Definition of done | Dependency |
|---|---|---|---|---|---|
| CEO-01 | Approve the B2B-assisted Hyderabad strategy | CEO | Day 0 | Written decision accepted; no competing D2C launch work | None |
| CEO-02 | Freeze brand naming as “Invite Link” for the pilot | CEO | Day 0 | Builder, sales material, demos, invoices, and profiles use one name | None |
| CEO-03 | Shortlist an available, defensible domain | CEO | Day 1 | Three candidates checked for domain and trademark conflicts | CEO-02 |
| ENG-01 | Review and commit the current stabilization work | Engineering | Day 0 | Clean reviewed commit; `node scripts/verify.mjs --external` passes | None |
| ENG-02 | Create a Vercel preview deployment | Engineering | Day 1 | Preview URL tested on phone and desktop; no production change | ENG-01 |
| ENG-03 | Verify Supabase schema, RLS, storage policies, unique slug constraint, and backups | Engineering | Day 1 | Written policy matrix; anonymous users cannot enumerate or mutate unauthorized data | None |
| ENG-04 | Protect builder publishing behind operator authentication | Engineering | Day 2 | Only approved operators can publish or upload files | ENG-03 |
| ENG-05 | Add an operator edit flow for published invitations | Engineering | Day 3 | Operator can load, modify, preview, and republish an invite | ENG-04 |
| ENG-06 | Add dynamic WhatsApp/Open Graph previews | Engineering | Day 3 | Shared links show the event title, image, and correct description | ENG-02 |
| OPS-01 | Create the customer intake checklist | Operations | Day 1 | Required names, date, time, venue, map, phone, copy, images, music, and consent captured | CEO-01 |
| OPS-02 | Create pre-publish and post-publish QA checklists | Operations | Day 1 | Every invite checked on mobile, maps, phone, WhatsApp, copy, assets, and expiry | None |
| GTM-01 | Rewrite all outreach copy to match current capabilities | Marketing | Day 1 | No claims about live RSVP dashboards, live updates, or features not shipped | CEO-01 |
| GTM-02 | Finalize pilot pricing and terms | CEO/Sales | Day 1 | One-page internal price sheet approved | CEO-01 |
| LEG-01 | Draft basic privacy, terms, refund, and content-rights policies | Professional/CEO | Day 3 | Publishable drafts reviewed for the assisted pilot | CEO-02 |
| FIN-01 | Set up a business collection method and invoice template | Finance/CEO | Day 2 | Payment link or UPI process, receipt, invoice numbering, and ledger ready | CEO-02 |

## 6. Product and engineering backlog

### P0 — required before any real customer publishing

- [ ] Validate Supabase Row Level Security with explicit allow/deny tests.
- [ ] Stop direct anonymous database inserts from the public builder.
- [ ] Add operator authentication and session expiry.
- [ ] Add partner/customer ownership fields to invitation records.
- [ ] Enforce unique slugs in the database, not only the browser.
- [ ] Add server-side payload validation and maximum text lengths.
- [ ] Enforce server-side upload type, size, and quota rules.
- [ ] Add malware/content handling policy for uploaded assets.
- [ ] Add an operator-only list of invitations with status and event date.
- [ ] Add edit, archive, duplicate, and extend-hosting operations.
- [ ] Add soft deletion and a documented permanent deletion process.
- [ ] Add daily database export or verified Supabase backup process.
- [ ] Add runtime error monitoring and publish-failure alerts.
- [ ] Add structured logs without personal data or secrets.
- [ ] Add dynamic Open Graph and WhatsApp preview metadata.
- [ ] Add a generated QR code for each published invitation.
- [ ] Add invitation status: draft, awaiting approval, paid, live, expired, archived.
- [ ] Add event-date-based expiration and extension controls.
- [ ] Add an asset-license/source field for every uploaded image and song.
- [ ] Run accessibility checks for keyboard use, contrast, motion reduction, and labels.
- [ ] Test current Android Chrome, iPhone Safari, WhatsApp in-app browser, and low-bandwidth loading.

### P1 — build only while pilots are running

- [ ] Add an explicit customer approval screen before publishing.
- [ ] Add one-click invitation duplication for repeat partners.
- [ ] Add downloadable QR files in PNG and SVG.
- [ ] Add per-invite view, RSVP-click, map-click, and share-click events.
- [ ] Add a lightweight operator analytics page.
- [ ] Add a proper RSVP form only if at least three pilot customers request tracking.
- [ ] Add CSV export for RSVP responses.
- [ ] Add calendar-file generation based on the actual event data.
- [ ] Add a photo gallery only after demand is confirmed.
- [ ] Add countdown only after demand is confirmed.
- [ ] Add multiple events for weddings only after five paid wedding invites.
- [ ] Add regional-language support based on the first requested language.
- [ ] Add partner co-branding after one partner purchases five invites.

### P2 — after 20–50 paid invitations

- [ ] Move from assisted operator flow to creator accounts.
- [ ] Add Razorpay test integration, webhook verification, refunds, and reconciliation.
- [ ] Complete Razorpay KYC before enabling live mode.
- [ ] Add a customer dashboard and self-service editing.
- [ ] Add a partner dashboard, credits, commissions, and usage history.
- [ ] Add template browsing and purchase flow.
- [ ] Add multi-user team roles for agencies.
- [ ] Add automated reminders only with explicit guest consent.
- [ ] Evaluate a Next.js migration based on actual feature needs, not aesthetics.

## 7. Customer delivery operations

### Intake

- [ ] Create one standard intake form.
- [ ] Capture partner name, customer name, event type, event date, promised delivery time, and payment status.
- [ ] Capture hosts, venue, complete address, map URL, phone, copy, photos, and music.
- [ ] Obtain permission to use customer photographs, logos, and music.
- [ ] Reject incomplete orders rather than guessing missing details.
- [ ] Give each order a unique internal ID.

### Production

- [ ] Confirm complete intake before starting the SLA clock.
- [ ] Select the closest template and prepare the first draft.
- [ ] Verify text spelling against the intake form.
- [ ] Compress and crop assets for mobile performance.
- [ ] Preview at 390 px and desktop widths.
- [ ] Verify phone number, WhatsApp message, map, event date, and time.
- [ ] Verify that no sample or previous-customer data remains.
- [ ] Send a private approval link or recording.
- [ ] Record the correction request and approval timestamp.
- [ ] Publish only after payment and approval.

### Handoff and support

- [ ] Send the live link, WhatsApp sharing text, QR code, hosting expiry, and support contact.
- [ ] Promise one correction round only for the standard plan.
- [ ] Respond to active-event incidents within two business hours.
- [ ] Maintain an incident log for broken links, assets, or incorrect details.
- [ ] Contact the partner after the event for feedback and the next order.
- [ ] Archive or delete expired customer data according to the retention policy.

### Service-level targets

- Standard first draft: within six business hours of complete intake.
- Correction round: within four business hours.
- Publish success: at least 98%.
- Operator production time: under 30 minutes initially; under 20 minutes by invite 20.
- Active-event support response: under two business hours.

## 8. Marketing plan

### Positioning

- [ ] Use one headline: “Add a premium digital invitation to every card order.”
- [ ] Use one supporting promise: “You sell it. We create and host it the same business day.”
- [ ] Lead with partner margin and zero technical work.
- [ ] Show the invitation experience before explaining features.
- [ ] Avoid generic “AI,” “all-in-one,” and “revolutionary” claims.

### Required sales assets

- [ ] Housewarming demo with sample data.
- [ ] Wedding demo with sample data.
- [ ] Birthday demo with sample data.
- [ ] Baby-shower demo with sample data.
- [ ] Partner landing page at `/partners`.
- [ ] Simple planner landing page at `/planners` after the printer page.
- [ ] One-page partner pricing PDF.
- [ ] One printed invitation/box sample with QR code.
- [ ] 30–45 second silent product walkthrough suitable for WhatsApp.
- [ ] Five phone screenshots showing opening, details, maps, RSVP, and closing.
- [ ] One before/after comparison: static PDF versus interactive link.
- [ ] FAQ covering price, turnaround, changes, hosting, customer data, and support.
- [ ] Case-study template for partner name, event, turnaround, resale price, and result.

### Content execution

- [ ] Publish two product demonstrations per week.
- [ ] Publish one printer-partner education post per week.
- [ ] Publish one real delivery/case study per week after pilots begin.
- [ ] Reuse each demo as Reel, Story, WhatsApp Status, and sales attachment.
- [ ] Do not invest in daily social content before the direct sales cadence is met.

### Brand tasks

- [ ] Confirm brand name and spelling.
- [ ] Select primary domain and redirect every old deployment.
- [ ] Create final logo lockup, favicon, colors, and typography rules.
- [ ] Remove NORAH as a platform identity; keep it only as a demo title if needed.
- [ ] Standardize support email, WhatsApp number, and social handles.
- [ ] Search for trademark conflicts and obtain professional advice before registration.

## 9. Sales plan

### ICP and territory

- Printing shops selling wedding and celebration cards.
- Five or more customer orders per week preferred.
- Active WhatsApp number and visible recent customer work.
- Hyderabad first; expand only after a repeatable close-and-delivery process.

### Lead preparation

- [ ] Reverify every lead in `leads.md`; the list is not a live CRM.
- [ ] Expand the list from 20 to 50 verified shops.
- [ ] Record area, contact, WhatsApp availability, Instagram, website, review count, premium-card evidence, and last contact.
- [ ] Score each lead A/B/C by likely order volume and premium fit.
- [ ] Start with the top ten A leads.

### CRM stages

1. Unverified
2. Verified
3. Contacted
4. Replied
5. Demo booked
6. Pilot accepted
7. First invite paid
8. Repeat partner
9. Lost or nurture

### Outreach cadence

- Day 1: personalized WhatsApp introduction with one demo.
- Day 2: short follow-up question.
- Day 4: margin example and QR sample.
- Day 7: final follow-up or offer a five-minute demo.
- Day 21: one useful case study for non-responsive qualified leads.

### Daily sales activity

- [ ] Verify five new shops.
- [ ] Send ten personalized first contacts or follow-ups.
- [ ] Make two calls or shop visits.
- [ ] Book at least one demo every two working days.
- [ ] Update every interaction in the CRM before the day ends.

### Discovery questions

- How many invitation orders do you complete in a normal week?
- Do customers ask for digital images, videos, QR codes, or links?
- What do you currently charge for digital add-ons?
- Who prepares those digital files today?
- How quickly do customers expect delivery?
- Which event categories are most common?
- What would prevent you from selling this at ₹999–₹1,499?

### Pilot close

- Show one relevant demo, not the whole product.
- Explain partner resale price and exact margin.
- Offer one free sample using non-customer data.
- Ask for the next suitable customer order.
- Set a date for the first real invite.
- Collect payment before publishing the real invite.

### Objection tasks

- [ ] Prepare response for “customers only want WhatsApp images.”
- [ ] Prepare response for “₹999 is expensive.”
- [ ] Prepare response for “we can make this ourselves.”
- [ ] Prepare response for “customers change details repeatedly.”
- [ ] Prepare response for “what if the link stops working?”
- [ ] Prepare response for “who owns customer data?”

## 10. Finance and business administration

- [ ] Decide the pilot business entity and obtain CA advice.
- [ ] Confirm invoicing and applicable GST obligations with a CA.
- [ ] Separate business and personal transaction records.
- [ ] Create invoice, credit note, and refund numbering.
- [ ] Record revenue by partner and invitation.
- [ ] Record Vercel, Supabase, domain, payment, contractor, and communication costs.
- [ ] Calculate operator labor cost per invitation.
- [ ] Calculate gross margin per standard and premium invitation.
- [ ] Set a monthly software and marketing budget cap.
- [ ] Review cash collected, receivables, refunds, and expenses weekly.
- [ ] Use payment links or UPI during the pilot; avoid building checkout prematurely.
- [ ] Begin Razorpay KYC preparation before self-service payment work.

### Unit-economics targets

- Standard wholesale revenue: at least ₹399 during pilot and ₹499 after pilot.
- Direct variable cost: below 15% of revenue.
- Gross margin before founder salary: above 70%.
- Operator time: under 30 minutes per standard invite.
- Revision rate: fewer than two rounds per invite.
- Refund rate: below 3%.

## 11. Legal, privacy, and risk

- [ ] Obtain professional review of privacy policy, terms, refund policy, and partner terms.
- [ ] State who is responsible for customer-supplied copy, photos, music, and permissions.
- [ ] Obtain consent before processing guest or customer personal data.
- [ ] Collect only data required to deliver the invitation.
- [ ] Define retention and deletion periods for invitations and uploaded assets.
- [ ] Provide a contact for correction and deletion requests.
- [ ] Do not expose private guest lists publicly.
- [ ] Do not use customer photographs in marketing without explicit permission.
- [ ] Do not supply unlicensed music as a commercial preset.
- [ ] Maintain an incident-response checklist for data exposure or account compromise.
- [ ] Store secrets only in deployment environment variables.
- [ ] Review Supabase, Vercel, Google Fonts, WhatsApp, and payment-provider privacy implications.

## 12. Analytics and management scoreboard

### North-star metric

**Paid invitations published per week**

### Daily leading indicators

- Verified leads added.
- First contacts sent.
- Follow-ups sent.
- Replies received.
- Demos booked.
- Invitations in production.
- Invitations published.
- Cash collected.

### Weekly funnel metrics

- Contact-to-reply rate.
- Reply-to-demo rate.
- Demo-to-pilot rate.
- Pilot-to-first-paid rate.
- First-paid-to-repeat rate.
- Average wholesale price.
- Average partner resale price.
- Production time per invite.
- Revision rounds per invite.
- Publish failure and support incident rate.

### 30-day validation target

- 50 verified shop leads.
- 40 shops contacted.
- 12 meaningful replies.
- 8 product demonstrations.
- 3 pilot partners.
- 2 repeat partners.
- 10 paid invitations.
- At least ₹5,000 wholesale revenue.
- At least one written partner testimonial.

## 13. Founder operating cadence

### Daily

- 30 minutes: metrics and blocker review.
- 90 minutes: product or delivery work on the single highest blocker.
- 120 minutes: outbound sales and follow-up.
- 60 minutes: demos or partner/customer calls.
- 30 minutes: CRM, cash ledger, and next-day planning.

### Weekly

- Monday: choose the one product bottleneck and one sales experiment.
- Wednesday: review pipeline and partner objections.
- Friday: review revenue, funnel conversion, delivery quality, and incidents.
- Saturday: produce one demo/case study and clean operational debt.

### Decision log

Every strategic decision must record:

- Decision made.
- Evidence.
- Owner.
- Review date.
- Reversal condition.

## 14. Stage gates

### Gate 1 — production ready

Proceed to real customer invites only when authentication, RLS, editing, backup, truthful sales copy, intake, QA, payment, and legal drafts are complete.

### Gate 2 — channel validated

Proceed to broader Hyderabad outreach only after two partners have paid and one has repeated.

### Gate 3 — product expansion

Build RSVP tracking, galleries, multi-event flows, or regional languages only when pilot evidence ranks them among the top three lost-sale reasons.

### Gate 4 — self-service

Build public accounts, checkout, and partner dashboards only after 20–50 paid assisted invitations and stable unit economics.

### Gate 5 — geographic expansion

Expand beyond Hyderabad only after the sales-to-delivery process can be operated from a documented playbook with at least two repeat partners.

## 15. Explicit “not now” list

- Paid Meta or Google advertising.
- A native mobile app.
- A broad marketplace for every event vendor.
- AI-generated invitations as the core promise.
- Unlimited templates.
- White-label enterprise plans.
- Automated WhatsApp bulk messaging.
- Complex subscription billing.
- Rebuilding the product in a new framework without a measured need.
- Expansion to multiple cities before repeat Hyderabad sales.

## 16. Exact execution queue

Work in this order; do not start the next item when the previous dependency is unresolved:

1. Approve positioning, brand, Hyderabad ICP, and pilot pricing.
2. Review and commit the current product stabilization work.
3. Create and test a Vercel preview deployment.
4. Audit Supabase schema, RLS, storage, uniqueness, and backups.
5. Add operator authentication and secure server-side publishing.
6. Add operator editing, invitation status, archive, and expiry.
7. Add dynamic WhatsApp metadata and QR generation.
8. Create intake, QA, approval, payment, and support procedures.
9. Rewrite outreach copy so every claim is currently true.
10. Build four polished demo invitations.
11. Build `/partners` and the one-page pricing PDF.
12. Reverify 20 existing leads and expand to 50.
13. Contact the first ten high-fit shops and book demos.
14. Deliver the first pilot customer invite and measure production time.
15. Reach ten paid invites, review objections, and choose the next product investment.
