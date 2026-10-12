// InviteLink Royal Procession: deterministic publication fallback generator.
// Usage: node prototypes/royal-procession/build.mjs [--check]
// The embedded invite-data JSON is the only editable guest-data source.
// No competitor assets, designs or source are used.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
const file = fileURLToPath(new URL("./index.html", import.meta.url));
const source = readFileSync(file, "utf8");
const match = source.match(/<script type="application\/json" id="invite-data">\s*([\s\S]*?)\s*<\/script>/);
if (!match) throw new Error("Missing canonical invite-data");
// Embedded JSON must never contain literal '<': </script> would terminate the script.
if (match[1].includes("<")) throw new Error("Unsafe embedded JSON: encode literal < as \\u003c before publishing");
const isGregorianDate = value => {
  if (typeof value !== "string" || !/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  if (year < 1) return false;
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  return day <= [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
};
const isStrictEventTimestamp = value => {
  if (typeof value !== "string") return false;
  const m = /^(\d{4}-\d{2}-\d{2})T([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(?:\.\d{1,3})?(Z|[+-](?:0\d|1[0-4]):[0-5]\d)$/.exec(value);
  if (!m || !isGregorianDate(m[1])) return false;
  if (m[5] !== "Z" && Number(m[5].slice(1,3)) === 14 && m[5].slice(4) !== "00") return false;
  return Number.isFinite(Date.parse(value));
};
const data = JSON.parse(match[1]);
if (typeof data.names !== "string" || !data.names.trim() ||
    !isGregorianDate(data.primaryDate) ||
    typeof data.location !== "string" || !data.location.trim() ||
    !Array.isArray(data.events) || !data.events.length)
  throw new Error("Required names/date/location/events missing or invalid");
const seenIds = new Set();
for (const [i,event] of data.events.entries()) {
  if (typeof event.id !== "string" || !/^[a-z0-9-]+$/.test(event.id) || seenIds.has(event.id))
    throw new Error("Unsafe or duplicate event ID at index "+i);
  seenIds.add(event.id);
  if (typeof event.name !== "string" || !event.name.trim() ||
      typeof event.venue !== "string" || !event.venue.trim() ||
      !isStrictEventTimestamp(event.start) ||
      !isStrictEventTimestamp(event.end) ||
      Date.parse(event.end) <= Date.parse(event.start))
    throw new Error("Missing event details or invalid start/end chronology at index "+i);
}
const esc = value => String(value ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
const dateLabel = date => new Intl.DateTimeFormat("en-IN",{dateStyle:"full"}).format(new Date(date+"T12:00:00+05:30"));
const eventLabel = date => new Intl.DateTimeFormat("en-IN",{dateStyle:"medium",timeStyle:"short",timeZone:"Asia/Kolkata"}).format(new Date(date));
const cards = data.events.map(e => {
  const address = e.address && String(e.address).trim()
    ? "<p>Directions: "+esc(e.address)+"</p>"
    : "<p>Venue directions pending a confirmed address.</p>";
  return '<article class="stop"><h3>'+esc(e.name)+'</h3><p>'+esc(eventLabel(e.start))+' – '+esc(eventLabel(e.end))+' · '+esc(e.venue)+'</p>'+address+'</article>';
}).join("");
const replacements = [
  [/(<h1 id="title" data-names>)[\s\S]*?(<\/h1>)/, "$1"+esc(data.names)+"$2"],
  [/(<p class="hero__date" data-date>)[\s\S]*?(<\/p>)/, "$1"+esc(dateLabel(data.primaryDate)+" · "+data.location)+"$2"],
  [/(<p class="lead" data-welcome>)[\s\S]*?(<\/p>)/, "$1"+esc(data.familyWelcome || "Your presence would mean the world to us.")+"$2"],
  [/(<div class="route" id="route">)(?:<noscript>[\s\S]*?<\/noscript>)?(<\/div>)/, "$1<noscript>"+cards+"</noscript>$2"]
];
let output = source;
for (const [pattern, replacement] of replacements) {
  if (!pattern.test(output)) throw new Error("Missing fallback anchor: "+pattern);
  output = output.replace(pattern, (_,start,end)=>replacement.replace("$1",()=>start).replace("$2",()=>end));
}
if (process.argv.includes("--check")) {
  if (output !== source) { console.error("FAIL: static no-JS fallback differs from invite-data; run build.mjs before publishing"); process.exitCode=1; }
  else console.log("PASS: static fallback synchronized");
} else {
  writeFileSync(file, output, "utf8");
  console.log("Updated Royal Procession static fallback from canonical invite-data");
}
