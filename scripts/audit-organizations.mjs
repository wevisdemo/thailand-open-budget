#!/usr/bin/env node
/**
 * Audits every ministry and budgetary unit across the downloaded budget
 * documents and reports the names that cannot serve as a stable URL id:
 * spelling edited in place, municipalities reclassified, units that vanish
 * for a year and return, merges, and dissolutions.
 *
 * Reads public/data/budget_*.json — run `pnpm data:import` first.
 *
 * Usage:
 *   node scripts/audit-organizations.mjs            # summary to stdout
 *   node scripts/audit-organizations.mjs --md       # full markdown report
 *
 * Regenerate the checked-in report with:
 *   node scripts/audit-organizations.mjs --md > docs/organization-id-risks.md
 *
 * The interpretive notes in the markdown (which pairing is a merge, which is
 * TCELS) are written for the 2568-2570 documents. Re-read them when a new
 * document lands.
 */

import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "public", "data");

// U+0E4D (nikhahit) + U+0E32 (sara aa) renders identically to U+0E33 (sara am)
// but is a different byte sequence, and Unicode NFC does not compose it.
const SARA_AM_DECOMPOSED = /ํา/g;
const SARA_AM = "ำ";

// Municipality classes, smallest first. A move up this list is a legal
// reclassification of the same body, not a new organization.
const MUNICIPALITY_TIERS = ["เทศบาลตำบล", "เทศบาลเมือง", "เทศบาลนคร"];

// Loose on purpose: a missed rename is a broken URL, a false positive is one
// line of review.
const RENAME_SIMILARITY = 0.55;

const LONG_NAME_CHARS = 80;

function normalize(name) {
  return name
    .normalize("NFC")
    .replace(SARA_AM_DECOMPOSED, SARA_AM)
    .replace(/\s+/g, " ")
    .trim();
}

// Collapses the differences that are invisible to a reader: the sara am
// encodings, spacing, and the ฏ/ฎ pair that the source sheet mixes up.
function foldKey(name) {
  return normalize(name).replace(/\s/g, "").replace(/ฏ/g, "ฎ");
}

function levenshtein(a, b) {
  if (Math.abs(a.length - b.length) > 20) return Infinity;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(
        prev[j] + 1,
        cur[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    prev = cur;
  }
  return prev[b.length];
}

function similarity(a, b) {
  return 1 - levenshtein(a, b) / Math.max(a.length, b.length);
}

function tierOf(name) {
  return MUNICIPALITY_TIERS.findIndex((prefix) => name.startsWith(prefix));
}

// Buddhist-era year of each downloaded document, oldest first.
function loadDocuments() {
  const files = readdirSync(DATA_DIR)
    .filter((f) => /^budget_\d{4}_.*\.json$/.test(f))
    .sort();

  return files.map((file) => {
    const year = file.slice(7, 11);
    const rows = JSON.parse(readFileSync(join(DATA_DIR, file)));
    const ministries = new Set();
    const budgetary = new Map();
    for (const row of rows) {
      if (row.ministry) ministries.add(row.ministry);
      if (row.budgetary) budgetary.set(row.budgetary, row.ministry || "");
    }
    return { year, file, ministries, budgetary };
  });
}

function audit(docs) {
  const namesIn = (doc) =>
    new Set([...doc.ministries, ...doc.budgetary.keys()]);

  // Presence pattern across every document, e.g. "101".
  const allNames = new Set(docs.flatMap((d) => [...namesIn(d)]));
  const pattern = new Map(
    [...allNames].map((name) => [
      name,
      docs.map((d) => (namesIn(d).has(name) ? "1" : "0")).join(""),
    ]),
  );

  // A document that contradicts itself — two spellings of one name in the
  // same file. Currently none; the check is here to catch a future import.
  const collisions = [];
  for (const doc of docs) {
    const groups = new Map();
    for (const name of namesIn(doc)) {
      const key = foldKey(name);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(name);
    }
    for (const names of groups.values()) {
      if (names.length > 1) collisions.push({ year: doc.year, names });
    }
  }

  const spellings = [];
  const upgrades = [];
  const renames = [];
  const disappeared = [];
  const ministryChanges = [];
  const parentChanges = [];

  for (let i = 1; i < docs.length; i++) {
    const before = docs[i - 1];
    const after = docs[i];
    const span = `${before.year} → ${after.year}`;

    for (const name of after.ministries) {
      if (!before.ministries.has(name)) {
        ministryChanges.push({ span, change: "added", name });
      }
    }
    for (const name of before.ministries) {
      if (!after.ministries.has(name)) {
        ministryChanges.push({ span, change: "removed", name });
      }
    }

    for (const [unit, ministry] of before.budgetary) {
      const now = after.budgetary.get(unit);
      if (now !== undefined && now !== ministry) {
        parentChanges.push({ span, unit, from: ministry, to: now });
      }
    }

    const gone = [...namesIn(before)].filter((n) => !namesIn(after).has(n));
    const came = [...namesIn(after)].filter((n) => !namesIn(before).has(n));

    // Same folded key on both sides: the organization stayed, the spelling
    // moved. These are the dangerous ones — nothing on screen changed.
    const cameByKey = new Map();
    for (const name of came) {
      const key = foldKey(name);
      if (!cameByKey.has(key)) cameByKey.set(key, []);
      cameByKey.get(key).push(name);
    }

    const claimed = new Set();
    const unresolved = [];
    for (const old of gone) {
      const matches = cameByKey.get(foldKey(old)) || [];
      if (matches.length === 0) {
        unresolved.push(old);
        continue;
      }
      for (const next of matches) {
        spellings.push({ span, old, next, cause: describeSpelling(old, next) });
        claimed.add(next);
      }
    }

    const available = came.filter((n) => !claimed.has(n));
    for (const old of unresolved) {
      let best = null;
      for (const candidate of available) {
        const score = similarity(normalize(old), normalize(candidate));
        if (score >= RENAME_SIMILARITY && (!best || score > best.score)) {
          best = { name: candidate, score };
        }
      }
      if (!best) {
        disappeared.push({ span, name: old, pattern: pattern.get(old) });
        continue;
      }
      const entry = { span, old, next: best.name, score: best.score };
      const step = tierOf(best.name) - tierOf(old);
      if (tierOf(old) >= 0 && step === 1) upgrades.push(entry);
      else renames.push(entry);
    }
  }

  // Both names alive in the final document means they are two bodies, not one
  // renamed — the gap year was simply a year without an allocation.
  const last = namesIn(docs[docs.length - 1]);
  const ambiguous = [...upgrades, ...renames].filter(
    (e) => last.has(e.old) && last.has(e.next),
  );
  const ambiguousSet = new Set(ambiguous);

  // One successor claimed by several predecessors is a merge, the one case a
  // single id per organization cannot express.
  const bySuccessor = new Map();
  for (const entry of [...upgrades, ...renames]) {
    if (ambiguousSet.has(entry)) continue;
    if (!bySuccessor.has(entry.next)) bySuccessor.set(entry.next, []);
    bySuccessor.get(entry.next).push(entry);
  }
  const merges = [...bySuccessor.values()].filter((g) => g.length > 1);
  const mergedSet = new Set(merges.flat());
  const excluded = (e) => ambiguousSet.has(e) || mergedSet.has(e);

  return {
    merges,
    docs,
    pattern,
    collisions,
    ministryChanges,
    parentChanges,
    spellings,
    upgrades: upgrades.filter((e) => !excluded(e)),
    renames: renames.filter((e) => !excluded(e)),
    ambiguous,
    disappeared,
    dualLevel: docs.flatMap((d) =>
      [...d.budgetary.keys()].filter((n) => d.ministries.has(n)),
    ),
    returning: [...allNames].filter((n) => /1 *0+1/.test(pattern.get(n))),
    longNames: [...allNames]
      .filter((n) => n.length > LONG_NAME_CHARS)
      .sort((a, b) => b.length - a.length),
  };
}

function describeSpelling(old, next) {
  if (SARA_AM_DECOMPOSED.test(old) || SARA_AM_DECOMPOSED.test(next)) {
    SARA_AM_DECOMPOSED.lastIndex = 0;
    return "`ํา` (U+0E4D U+0E32) vs `ำ` (U+0E33) — identical on screen, different bytes";
  }
  if (old.replace(/\s/g, "") === next.replace(/\s/g, "")) return "whitespace";
  return "ฏ / ฎ consonant swap";
}

function printSummary(result) {
  const line = (label, n) => console.log(String(n).padStart(5), label);
  console.log(`Documents: ${result.docs.map((d) => d.year).join(", ")}\n`);
  line("within-document spelling collisions", result.collisions.length);
  line("ministry additions/removals", result.ministryChanges.length);
  line("units that changed parent ministry", result.parentChanges.length);
  line("spelling edited in place", result.spellings.length);
  line("municipality status upgrades", result.upgrades.length);
  line("other renames", result.renames.length);
  line("merges", result.merges.length);
  line("ambiguous, need review", result.ambiguous.length);
  line("disappeared with no successor", result.disappeared.length);
  line("disappeared and returned", result.returning.length);
  line("names at both levels", new Set(result.dualLevel).size);
  line(`names over ${LONG_NAME_CHARS} chars`, result.longNames.length);
}

function renderMarkdown(result) {
  const {
    docs,
    pattern,
    ministryChanges,
    parentChanges,
    spellings,
    upgrades,
    renames,
    merges,
    ambiguous,
    disappeared,
    dualLevel,
    returning,
    longNames,
  } = result;
  const years = docs.map((d) => d.year);
  const out = [];
  const w = (s = "") => out.push(s);
  const pat = (name) => pattern.get(name) || "0".repeat(years.length);
  const unitCount = (d) => d.budgetary.size;
  const byThai = (a, b) => a.old.localeCompare(b.old, "th");

  w("# Organization ids: names that will break");
  w();
  w(
    "Audit of every ministry and budgetary unit across the budget documents in `public/data/`, run while choosing an id scheme for `/organizations/{ministry_id}/{budgetary_id}`.",
  );
  w();
  w(
    "**The conclusion in one line:** an organization's name is not a stable key. Names are edited in place between documents, municipalities are reclassified, one pair merged, and three units vanished for a year and came back. Any id derived from the name — Thai slug, romanised slug, or hash — silently orphans the URL in every case below.",
  );
  w();
  w(
    "Regenerate with `node scripts/audit-organizations.mjs --md > docs/organization-id-risks.md`.",
  );
  w();
  w("## Scope");
  w();
  w(`| | ${years.join(" | ")} | union |`);
  w(`|---|${years.map(() => "---:").join("|")}|---:|`);
  w(
    `| Ministries | ${docs.map((d) => d.ministries.size).join(" | ")} | ${new Set(docs.flatMap((d) => [...d.ministries])).size} |`,
  );
  w(
    `| Budgetary units | ${docs.map(unitCount).join(" | ")} | ${new Set(docs.flatMap((d) => [...d.budgetary.keys()])).size} |`,
  );
  w();
  w(
    `Pattern columns below read \`${years.join(" ")}\`, where \`1\` means the name appears in that document.`,
  );
  w();

  w("## 1. Ministry level — low risk");
  w();
  w(
    `Ministries are stable. Across all ${docs.length} documents: no renames, no spelling edits, and ${ministryChanges.length} membership change${ministryChanges.length === 1 ? "" : "s"}.`,
  );
  w();
  w("| Change | Name |");
  w("|---|---|");
  for (const c of ministryChanges)
    w(`| ${c.change} in ${c.span.split(" → ")[1]} | ${c.name} |`);
  w();
  w(
    `No budgetary unit changed its parent ministry in any transition (${parentChanges.length} found), so nesting a unit under its ministry in the URL is safe.`,
  );
  w();

  w("## 2. Names used at BOTH levels");
  w();
  w(
    "These names are a ministry *and* a budgetary unit — single-unit ministries. A flat name-keyed id cannot tell the two apart; the nested route makes them `/organizations/{id}/{same id}`.",
  );
  w();
  w("| Name | Pattern |");
  w("|---|:---:|");
  for (const n of [...new Set(dualLevel)].sort((a, b) =>
    a.localeCompare(b, "th"),
  ))
    w(`| ${n} | ${pat(n)} |`);
  w();
  w(
    "Decide whether a single-unit ministry renders the unit page directly instead of a ministry page with one child.",
  );
  w();

  w("## 3. Same organization, spelling changed in place — HIGHEST RISK");
  w();
  w(
    `${spellings.length} names were edited between documents while remaining the same organization. Four of these are invisible on screen.`,
  );
  w();
  w("| From → To | Old spelling | New spelling | Cause |");
  w("|---|---|---|---|");
  for (const c of spellings)
    w(`| ${c.span} | ${c.old} | ${c.next} | ${c.cause} |`);
  w();
  w("Notes:");
  w();
  w(
    "- **`ํา` vs `ำ`** — the `เทศบาลตําบล` entries use U+0E4D (nikhahit) + U+0E32 (sara aa) where the others use U+0E33 (sara am). These render identically and Unicode NFC does **not** normalise one to the other, so they compare unequal and hash differently. Any import must normalise this pair explicitly.",
  );
  w(
    "- **`สุราษฎร์ธานี` → `สุราษฏร์ธานี`** (2569 → 2570) introduces an error rather than fixing one — spelling drift is not one-directional, so you cannot assume the newest document is canonical.",
  );
  w();

  w("## 4. Municipality status upgrades — same body, new legal class");
  w();
  w(
    `${upgrades.length} municipalities were reclassified (${MUNICIPALITY_TIERS.join(" → ")}). The name changes; the organization does not. Every one of these is a URL that must survive.`,
  );
  w();
  w("| From → To | Old name | New name |");
  w("|---|---|---|");
  for (const c of [...upgrades].sort(byThai))
    w(`| ${c.span} | ${c.old} | ${c.next} |`);
  w();

  w("## 5. Merges — several ids must resolve to one page");
  w();
  w("A successor claimed by more than one predecessor:");
  w();
  for (const group of merges) {
    w("| Pattern | Name |");
    w("|:---:|---|");
    for (const e of group) w(`| ${pat(e.old)} | ${e.old} |`);
    w(`| ${pat(group[0].next)} | **${group[0].next}** |`);
    w();
  }
  w(
    "A merge is the one case a single `id` field cannot express: every predecessor id has to keep working and point at the successor, while the successor still has to show earlier figures filed under the old names. Needs an explicit decision.",
  );
  w();

  w("## 6. Genuine renames");
  w();
  w("| From → To | Old name | New name | Similarity |");
  w("|---|---|---|---:|");
  for (const c of renames)
    w(`| ${c.span} | ${c.old} | ${c.next} | ${c.score.toFixed(2)} |`);
  w();
  w(
    "This is TCELS. Nothing in the data links the two names — only domain knowledge does, which is why the import script has to surface the candidate for a human rather than decide.",
  );
  w();

  w("## 7. Disappear and return");
  w();
  w(
    "Present, absent, present. Fatal under any per-document index — the unit is renumbered on its return — and free under a persistent registry.",
  );
  w();
  w("| Pattern | Name | Ministry |");
  w("|:---:|---|---|");
  for (const n of returning.sort((a, b) => a.localeCompare(b, "th"))) {
    const ministry = docs.map((d) => d.budgetary.get(n)).find(Boolean) || "";
    w(`| ${pat(n)} | ${n} | ${ministry} |`);
  }
  w();

  w("## 8. Needs human review — ambiguous");
  w();
  w(
    "The matcher paired these, but both names are alive in the final document, so they are probably two distinct bodies and the gap year is just a year with no allocation. Confirm before treating either as a rename.",
  );
  w();
  w("| Candidate old | Pattern | Candidate new | Pattern | Similarity |");
  w("|---|:---:|---|:---:|---:|");
  for (const c of ambiguous)
    w(
      `| ${c.old} | ${pat(c.old)} | ${c.next} | ${pat(c.next)} | ${c.score.toFixed(2)} |`,
    );
  w();

  w("## 9. Gone for good");
  w();
  w(
    "Dissolved, absorbed, or simply no longer receiving an allocation. Their pages must keep working — earlier fiscal years still reference them.",
  );
  w();
  w("| Last seen | Name |");
  w("|---|---|");
  for (const c of disappeared) w(`| ${c.span.split(" → ")[0]} | ${c.name} |`);
  w();

  w("## 10. Structural hazards for any name-derived slug");
  w();
  w(
    `**Length.** ${longNames.length} names exceed ${LONG_NAME_CHARS} characters. Percent-encoded Thai costs 9 bytes per character, so these blow past any sane path-segment budget:`,
  );
  w();
  w("| Chars | Encoded | Name |");
  w("|---:|---:|---|");
  for (const n of longNames.slice(0, 5))
    w(`| ${n.length} | ${encodeURIComponent(n).length} | ${n} |`);
  w();
  const chars = {};
  for (const n of pattern.keys()) {
    for (const ch of n.match(/[^฀-๿\s]/g) || [])
      chars[ch] = (chars[ch] || 0) + 1;
  }
  w(
    `**Non-Thai characters in names.** Present across the union: ${Object.entries(
      chars,
    )
      .sort((a, b) => b[1] - a[1])
      .map(([c, n]) => "`" + c + "` ×" + n)
      .join(
        ", ",
      )}. All are legal in a path segment but need care in generated filenames for the static export.`,
  );
  w();

  w("## Method");
  w();
  w(
    "1. Load every `public/data/budget_*.json`, collecting the distinct `ministry` and `budgetary` values per document.",
  );
  w(
    "2. **Within-document collisions:** group by a folded key (NFC, `ํา`→`ำ`, `ฏ`→`ฎ`, spaces stripped). Result: 0 — no document contradicts itself.",
  );
  w(
    "3. **Across documents:** diff the name sets. A disappearance whose folded key matches an appearance is a *spelling change* (§3). Otherwise pair disappearances to appearances by Levenshtein similarity ≥ " +
      RENAME_SIMILARITY +
      " and classify by municipality tier (§4–6).",
  );
  w(
    "4. **Presence pattern** per name across the documents catches return-after-absence (§7); a successor with several predecessors is a merge (§5); a pair both alive at the end is ambiguous (§8).",
  );
  w();
  w(
    "The similarity threshold is deliberately loose; it produced two false positives (§8), which is the right trade — a missed rename is a broken URL, a false positive is one line of review.",
  );
  w();

  w("## What this means for the id scheme");
  w();
  w(
    "| Scheme | Survives §3 spelling | Survives §4 upgrades | Survives §7 return | Handles §5 merge |",
  );
  w("|---|:---:|:---:|:---:|:---:|");
  w("| Thai name in path | no | no | yes | no |");
  w("| Romanised / hashed name | no | no | yes | no |");
  w("| Index recomputed per build | no | no | **no** | no |");
  w("| Append-only registry | yes\\* | yes\\* | yes | yes\\* |");
  w();
  w(
    "\\* with a human confirming the pairing the import script proposes. The registry does not detect these on its own — it makes intervention *possible*, which the other three schemes do not.",
  );
  w();
  w(
    "Concretely, the import step should fail loudly whenever a name disappears and an unclaimed name appears in the same run, printing the candidate pairs from §3–§6 for a human to accept or reject before ids are written.",
  );

  return out.join("\n") + "\n";
}

const result = audit(loadDocuments());

if (process.argv.includes("--md")) {
  process.stdout.write(renderMarkdown(result));
} else {
  printSummary(result);
}
