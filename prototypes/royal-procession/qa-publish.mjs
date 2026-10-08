// InviteLink Royal Procession: independent publication QA gate.
// Run: node prototypes/royal-procession/qa-publish.mjs
// This intentionally fails while the canonical no-JS fallback is out of sync.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
const html = readFileSync(fileURLToPath(new URL("./index.html", import.meta.url)), "utf8");
const errors = [];
const requireMatch = (re, message) => {
  const match = html.match(re);
  if (!match) errors.push(message);
  return match;
};
const script = requireMatch(/<script type="application\/json" id="invite-data">\s*([\s\S]*?)\s*<\/script>/, "Canonical invite-data script missing");
if (script) {
  const raw = script[1];
  if (raw.includes("<")) errors.push("Unsafe literal < in embedded JSON: encode as \\u003c before publishing");
  let data;
  try { data = JSON.parse(raw); } catch { errors.push("Invalid embedded JSON"); }
  if (data) {
    const esc = x => String(x ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
    const textOf = re => html.match(re)?.[1] ?? null;
    const dateLabel = d => new Intl.DateTimeFormat("en-IN",{dateStyle:"full"}).format(new Date(d+"T12:00:00+05:30"));
    const eventLabel = d => new Intl.DateTimeFormat("en-IN",{dateStyle:"medium",timeStyle:"short",timeZone:"Asia/Kolkata"}).format(new Date(d));
    if (!data.names?.trim() || !data.location?.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(data.primaryDate || "") || !Array.isArray(data.events) || !data.events.length) errors.push("Missing required core fields");
    else {
      if (textOf(/<h1 id="title" data-names>([\s\S]*?)<\/h1>/) !== esc(data.names)) errors.push("Names not synchronized");
      if (textOf(/<p class="hero__date" data-date>([\s\S]*?)<\/p>/) !== esc(dateLabel(data.primaryDate)+" · "+data.location)) errors.push("Date/location not synchronized");
      if (textOf(/<p class="lead" data-welcome>([\s\S]*?)<\/p>/) !== esc(data.familyWelcome || "Your presence would mean the world to us.")) errors.push("Welcome not synchronized");
    }
    const fallback = textOf(/<div class="route" id="route"><noscript>([\s\S]*?)<\/noscript><\/div>/);
    if (fallback === null) errors.push("No-JS event fallback missing");
    const ids = new Set();
    for (const [i,e] of (data.events || []).entries()) {
      if (!/^[a-z0-9-]+$/.test(e.id || "") || ids.has(e.id)) errors.push("Unsafe/duplicate event ID at "+i);
      ids.add(e.id);
      if (!e.name?.trim() || !e.venue?.trim() || !Number.isFinite(Date.parse(e.start)) || !Number.isFinite(Date.parse(e.end)) || Date.parse(e.end) <= Date.parse(e.start)) {
        errors.push("Invalid event data/time range at "+i);
        continue;
      }
      if (fallback !== null && (!fallback.includes(esc(e.name)) || !fallback.includes(esc(e.venue)) || !fallback.includes(esc(eventLabel(e.start))) || !fallback.includes(esc(eventLabel(e.end))))) errors.push("No-JS event "+e.id+" missing identity/start/end/venue");
    }
    if (fallback !== null && (fallback.match(/<article class="stop">/g) || []).length !== (data.events || []).length) errors.push("No-JS event count differs");
  }
}
if (!/<button[^>]*id="rsvp-submit"[^>]*\bdisabled\b/.test(html)) errors.push("RSVP submit must start disabled without JS");
if (!/<noscript>[\s\S]*?RSVP is unavailable/.test(html)) errors.push("No-JS RSVP disclosure missing");
if (errors.length) {
  for (const e of errors) console.error("FAIL:",e);
  process.exitCode = 1;
} else console.log("PASS: canonical JSON, no-JS parity, event ranges and RSVP safety");
