// Scrive ogni pagina in italiano (cartella principale) e in inglese (cartella en/).
// La versione inglese si ottiene sostituendo i pezzi di testo con il dizionario build/en-dict.mjs.
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { EN } from "./en-dict.mjs";

const SITE = "https://www.cremeriascirocco.it/";
EN["Lingua"] = "Language";

export const missing = new Set();
const norm = (s) => s.replace(/\s+/g, " ").trim();

function tr(text) {
  const key = norm(text);
  if (!key || !/[A-Za-zÀ-ú]/.test(key)) return text;
  if (Object.prototype.hasOwnProperty.call(EN, key)) {
    const lead = text.match(/^\s*/)[0], trail = text.match(/\s*$/)[0];
    return lead + EN[key] + trail;
  }
  missing.add(key);
  return text;
}

function hreflang(file) {
  const it = SITE + (file === "index.html" ? "" : file);
  const en = SITE + "en/" + (file === "index.html" ? "" : file);
  return `<link rel="alternate" hreflang="it" href="${it}">\n<link rel="alternate" hreflang="en" href="${en}">\n<link rel="alternate" hreflang="x-default" href="${it}">`;
}

function translateTag(tag) {
  // attributi testuali
  tag = tag.replace(/\s(alt|aria-label|placeholder|title|content|data-caption)="([^"]*)"/g, (m, a, v) => {
    if (a === "content" && /^(https?:|width=|#|summary|website|it_IT|en_GB)/.test(v)) return m;
    const t = tr(v);
    return ` ${a}="${t.replace(/"/g, "&quot;")}"`;
  });
  // percorsi delle risorse: dalla cartella en/ si risale di un livello
  tag = tag.replace(/\s(src|href|srcset|data-lightbox)="(img|css|js)\//g, ' $1="../$2/');
  return tag;
}

function toEnglish(html, file) {
  const parts = html.split(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>)/);
  let out = "";
  for (const p of parts) {
    if (!p) continue;
    if (p.startsWith("<script")) {
      // solo i percorsi degli script esterni
      out += p.replace(/^<script([^>]*)>/, (m) => translateTag(m));
    } else if (p.startsWith("<style")) out += p;
    else if (p.startsWith("<")) out += translateTag(p);
    else out += tr(p);
  }
  return out
    .replace('<html lang="it">', '<html lang="en">')
    .replace('content="it_IT"', 'content="en_GB"')
    .replace(/<link rel="canonical" href="https:\/\/www\.cremeriascirocco\.it\/([^"]*)">/, `<link rel="canonical" href="${SITE}en/$1">`)
    .replace("__HREF_IT__", "../" + file).replace("__HREF_EN__", file)
    .replace("__CUR_IT__", "").replace("__CUR_EN__", ' aria-current="true"');
}

export function emit(root, file, html) {
  html = html.replace("__HREFLANG__", hreflang(file));
  const it = html.replace("__HREF_IT__", file).replace("__HREF_EN__", "en/" + file)
    .replace("__CUR_IT__", ' aria-current="true"').replace("__CUR_EN__", "");
  writeFileSync(join(root, file), it);
  mkdirSync(join(root, "en"), { recursive: true });
  writeFileSync(join(root, "en", file), toEnglish(html, file));
  console.log("✓", file, "+ en/" + file);
}

process.on("exit", () => { if (missing.size) { console.log("\nTesti non tradotti (" + missing.size + "):"); for (const k of missing) console.log(" - " + k); } });
