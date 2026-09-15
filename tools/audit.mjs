#!/usr/bin/env node
/**
 * Integrity checks for the Mesa de Cotejo, outside the browser.
 *
 * The page audits itself on every render, but that only helps if somebody opens
 * it. This script runs the same checks against the HTML and exits with code 1
 * when an invariant is broken, so it can run in CI or at the end of the daily
 * mailbox sweep.
 *
 *   node tools/audit.mjs             full report
 *   node tools/audit.mjs --strict    also fail on prices with no source
 *
 * It reimplements nothing: it extracts both the data and the functions from the
 * HTML itself, so it cannot drift out of sync with what the user sees.
 *
 * Note on language: identifiers below are Spanish because they mirror the
 * application's own field names (mensajes = messages, cuerpo = body,
 * ultimaRespuesta = their last reply, hilo.buzon = the mailbox the thread lives
 * in, precioFuente = price backing). Renaming them would mean rewriting the
 * application; the reports this script prints are in English.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(join(root, "mesa-de-cotejo.html"), "utf8");

/* ---------- pull DOMAINS and the functions out of the HTML ---------- */
function sliceArray(marker) {
  const i = html.indexOf(marker);
  if (i === -1) throw new Error(`cannot find ${marker} in the HTML`);
  let j = html.indexOf("[", i), depth = 0;
  for (; j < html.length; j++) {
    if (html[j] === "[") depth++;
    else if (html[j] === "]" && --depth === 0) break;
  }
  return html.slice(i, j + 1);
}

function fn(name) {
  const m = new RegExp(`\\nfunction ${name}\\(.*?\\n\\}\\n`, "s").exec(html);
  if (!m) throw new Error(`cannot find function ${name}()`);
  return m[0];
}

const FUNCTIONS = ["numeros", "isoDeEtiqueta", "construirMensajes", "normalizar"];
const source = [sliceArray("const DOMAINS = [") + ";", ...FUNCTIONS.map(fn)].join("\n");
const DOMAINS = new Function(`${source}\nnormalizar();\nreturn DOMAINS;`)();

/* ---------- the invariants ---------- */
const found = { broken: [], unsourced: [], blind: [] };

const unsourcedPrices = (d) =>
  Object.keys(d.precioFuente || {})
    .filter((c) => d.precioFuente[c].tipo === null)
    .map((c) => `${c}=${(d.row[c] || [])[0]}`);

for (const d of DOMAINS) {
  // 1. the sender must be the mailbox where the thread actually lives
  const mailbox = d.hilo && d.hilo.buzon;
  if (mailbox && d.sender && mailbox !== d.sender) {
    found.broken.push(`${d.id}: sender is ${d.sender}@ but the thread lives in ${mailbox}@`);
  }

  // 2. the displayed body must be the last thing they said
  if (d.cuerpoAlDia === false || d.faltaTexto) {
    const line =
      `${d.id}: body ${String(d.cuerpoSemilla?.when).slice(0, 10)}` +
      ` / reply ${String(d.ultimaRespuesta).slice(0, 10)}`;
    if (d.comprobable) found.broken.push(`${line} (refreshable — it should have been refreshed)`);
    else found.blind.push(`${line} (lives in mauro@, no access)`);
  }

  // 3. no price may read as confirmed without a message behind it
  if (d.precioDegradado) {
    found.broken.push(`${d.id}: prices were marked confirmed with no backing (downgraded at load)`);
  }
  const missing = unsourcedPrices(d);
  if (missing.length) {
    const line = `${d.id}: ${missing.join(", ")} — no email behind the figure`;
    (d.comprobable ? found.unsourced : found.blind).push(line);
  }
}

/* ---------- report ---------- */
const messages = DOMAINS.reduce((a, d) => a + (d.mensajes?.length || 0), 0);
const blindRecords = DOMAINS.filter((d) => !d.comprobable).length;

console.log(
  `Mesa de Cotejo — ${DOMAINS.length} records, ${messages} messages, ` +
    `${blindRecords} unverifiable (thread in mauro@)\n`
);

const block = (title, list) => {
  if (!list.length) return;
  console.log(`${title} (${list.length})`);
  list.forEach((x) => console.log(`  · ${x}`));
  console.log("");
};

block("BROKEN — must be fixed", found.broken);
block("UNSOURCED — checkable, nobody has checked it", found.unsourced);
block("BLIND — blocked on access to mauro@", found.blind);

if (!found.broken.length && !found.unsourced.length) {
  console.log("Every invariant holds across the readable half of the table.");
}

const strict = process.argv.includes("--strict");
if (found.broken.length || (strict && found.unsourced.length)) {
  console.error(
    `\nFAIL: ${found.broken.length} broken` +
      (strict ? `, ${found.unsourced.length} unsourced` : "")
  );
  process.exit(1);
}
