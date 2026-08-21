# Invite Link acquisition launch checklist

The on-site foundation is implemented. These account-level steps require the site owner's credentials and should be completed after deployment.

## Search visibility

1. Add `invitelink.shop` as a Domain property in Google Search Console and publish Google's TXT verification record in DNS.
2. Submit `https://www.invitelink.shop/sitemap.xml` in Search Console.
3. Inspect the homepage and one URL from each of `sitemap-templates.xml` and `sitemap-guides.xml`.
4. Import the verified property into Bing Webmaster Tools.
5. After a deployment, run `npm run indexnow` so Bing and other participating engines receive the current canonical URL list.

## Measurement

The site now emits these data-layer events:

- `template_view`
- `template_preview`
- `customize_start`
- `sign_up`
- `invite_created`
- `invite_published`
- `share_whatsapp`
- `begin_checkout`, `purchase`, and `upgrade_paid` are reserved for the payment integration.

Analytics and session measurement load only after a visitor allows analytics. Until a GTM container is available, the existing GA4 and Clarity properties load through the shared consent-aware measurement file.

To move fully to Google Tag Manager:

1. Create and publish the web container.
2. Set `GTM_ID` once in `acquisition.js`.
3. Configure GA4, Meta Pixel, Reddit Pixel and future ad tags inside GTM.
4. Require consent for every non-essential tag.
5. Map Meta and Reddit conversion names to the data-layer events above.

## Platform actions

- Connect Meta Pixel first, then add server-side Conversions API with matching event IDs when a server endpoint is available.
- Add Reddit Pixel only after the core Google/Instagram/Pinterest workflow is operating.
- Do not publish Meta or Reddit credentials in this static repository.
- Test the consent states, funnel events and final purchase event in each platform's diagnostics before optimizing paid campaigns.
