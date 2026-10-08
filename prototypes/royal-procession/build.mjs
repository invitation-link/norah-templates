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
const data = JSON.parse(match[1]);
if (typeof data.names !== "string" || !data.names.trim() ||
    !/^\d{4}-\d{2}-\d{2}$/.test(data.primaryDate) ||
    typeof data.location !== "string" || !data.location.trim() ||
    !Array.isArray(data.events) || !data.events.length)
  throw new Error("Required names/date/location/events missing");
const esc = value => String(value ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
const dateLabel = date => new Intl.DateTimeFormat("en-IN",{dateStyle:"full"}).format(new Date(date+"T12:00:00+05:30"));
const eventLabel = date => new Intl.DateTimeFormat("en-IN",{dateStyle:"medium",timeStyle:"short",timeZone:"Asia/Kolkata"}).format(new Date(date));
for (const event of data.events) {
  if (!event.id || !event.name || !event.start || !event.end || !event.venue ||
      Number.isNaN(new Date(event.start).getTime()) || Number.isNaN(new Date(event.end).getTime()))
    throw new Error("Event missing id/name/start/end/venue or invalid dates");
}
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
