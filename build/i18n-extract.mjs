// Estrae tutti i testi visibili e gli attributi testuali dalle pagine italiane generate,
// per preparare il dizionario di traduzione (build/en.json).
// Uso: node build/i18n-extract.mjs
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const pages = readdirSync(ROOT).filter((f) => f.endsWith(".html"));
const seen = new Map();
const norm = (s) => s.replace(/\s+/g, " ").trim();
for (const p of pages) {
  let h = readFileSync(join(ROOT, p), "utf8");
  h = h.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "").replace(/<svg[\s\S]*?<\/svg>/g, "<i></i>");
  for (const m of h.matchAll(/>([^<>]+)</g)) {
    const t = norm(m[1]);
    if (t && /[A-Za-zÀ-ú]/.test(t)) seen.set(t, (seen.get(t) || 0) + 1);
  }
  for (const m of h.matchAll(/\s(?:alt|aria-label|placeholder|title|content|data-caption)="([^"]+)"/g)) {
    const t = norm(m[1]);
    if (t && /[A-Za-zÀ-ú]{2}/.test(t) && !/^(https?:|width=|#|summary|website|it_IT)/.test(t)) seen.set(t, (seen.get(t) || 0) + 1);
  }
}
const file = join(ROOT, "build", "en.json");
const old = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : {};
const out = {};
for (const k of [...seen.keys()].sort()) out[k] = old[k] ?? "";
writeFileSync(file, JSON.stringify(out, null, 1));
const missing = Object.values(out).filter((v) => !v).length;
console.log("testi:", Object.keys(out).length, "da tradurre:", missing);
