/**
 * Fetches "Mi historia" from grupoayudabodegueros.org via WP REST API
 * and writes src/data/perroStories.wp.ts
 *
 * Run: node scripts/sync-perro-from-wp.mjs
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../src/data/perroStories.wp.ts");

const SLUGS = [
  "rodolfo",
  "piula",
  "atenea",
  "amapola",
  "toni",
  "aretha",
  "lucho",
  "atila",
  "huno",
  "hache",
  "grecia",
  "juliet",
  "amaia",
  "leia",
  "gordi",
  "lala",
  "waha",
];

const DEFAULT_CHECKLIST = [
  "Con cartilla",
  "Desparasitado",
  "Esterilizado",
  "Con microchip",
  "Vacunado",
];

function decodeEntities(s) {
  return s
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, "\u201c")
    .replace(/&#8221;/g, "\u201d")
    .replace(/&#8230;/g, "…");
}

function stripParagraphs(html) {
  const paras = [];
  const re = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let m;
  while ((m = re.exec(html))) {
    let t = m[1]
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "");
    t = decodeEntities(t).replace(/\s+/g, " ").trim();
    if (!t) continue;
    t = normalizeContactParagraph(t);
    paras.push(t);
  }
  return paras;
}

/** Plain ASCII email so in-app bolding works; keep leading emoji if any */
function normalizeContactParagraph(p) {
  const t = p.trim();
  if (t.startsWith("💌") && /contacto|@|org/i.test(t)) return "💌 Contacto: info@grupoayudabodegueros.org";
  if (t.startsWith("📬")) return "📬 info@grupoayudabodegueros.org";
  if (t.startsWith("📩")) return "📩 info@grupoayudabodegueros.org";
  return p;
}

function splitIndex(paras) {
  const n = paras.length;
  if (n <= 1) return 1;
  for (let i = 1; i < n; i++) {
    if (/^🐶/.test(paras[i]) && i <= n - 2) return i;
  }
  return Math.max(1, Math.ceil(n / 2));
}

function joinParas(paras) {
  return paras.join("\n\n");
}

async function fetchPerro(slug) {
  const url = `https://grupoayudabodegueros.org/wp-json/wp/v2/perro?slug=${encodeURIComponent(slug)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${slug}: HTTP ${res.status}`);
  const data = await res.json();
  if (!data?.length) throw new Error(`${slug}: empty response`);
  const html = data[0].content?.rendered ?? "";
  const paras = stripParagraphs(html);
  if (!paras.length) throw new Error(`${slug}: no paragraphs`);
  const cut = splitIndex(paras);
  return {
    storyLeft: joinParas(paras.slice(0, cut)),
    storyRight: joinParas(paras.slice(cut)),
  };
}

const header = `/**
 * Auto-generated — WordPress "perro" REST content (Mi historia).
 * Regenerate: node scripts/sync-perro-from-wp.mjs
 */
`;

async function main() {
  const entries = {};
  for (const slug of SLUGS) {
    process.stderr.write(`${slug}… `);
    entries[slug] = await fetchPerro(slug);
    process.stderr.write("ok\n");
  }

  let body = "export const perroStoriesFromWp = {\n";
  for (const slug of SLUGS) {
    const { storyLeft, storyRight } = entries[slug];
    body += `  ${JSON.stringify(slug)}: {\n`;
    body += `    storyLeft: ${JSON.stringify(storyLeft)},\n`;
    body += `    storyRight: ${JSON.stringify(storyRight)},\n`;
    body += `    deliveryChecklist: ${JSON.stringify(DEFAULT_CHECKLIST)},\n`;
    body += `  },\n`;
  }
  body += "} as const;\n";

  writeFileSync(OUT, header + body, "utf8");
  console.log("Wrote", OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
