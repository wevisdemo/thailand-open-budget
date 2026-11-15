# Budget data loading: three approaches compared

**Decision needed:** how the site loads its budget data, now that it holds five budget documents and `main`'s published site is over GitHub Pages' 1 GB limit.

**Recommendation:** prerender the organization pages and pack the country-wide data files (approach 3). It is the only one of the three that fits under 1 GB, with room for about two or three more documents.

Last updated 2026-11-15. Earlier versions of this doc, comparing the options that led here, are in git history.

## Result: approach 3 as built

Built on branch `refactor/prerender-and-optimise-size`, from `main` at `80acb01`, in six commits. Measured from `out/` after `pnpm build` (38 s):

| Part of `out/`                             | `main` (measured) | Approach 3 as built |
| ------------------------------------------ | ----------------- | ------------------- |
| `data/budget_<doc>.json` (raw)             | 341.0 MB          | not published       |
| `data/budget/<doc>.json` (packed)          | —                 | 66.5 MB             |
| `data/budget_by_ministry/` (item files)    | 361.3 MB          | 65.1 MB             |
| `data/organization_<doc>.json`             | 6.5 MB            | not published       |
| `data/category_levels/`, ids, core content | 4.3 MB            | not published       |
| `organizations/` (ministry and unit pages) | 410.0 MB          | 663.0 MB            |
| `_next/` and everything else               | 5.7 MB            | ~6 MB               |
| **Total**                                  | **1,128.9 MB**    | **805.3 MB**        |

The estimate was ~790 MB. The organization pages came out 8 MB larger than estimated, and there are 170 data files rather than 169: the item files include an empty one for the ministry with no 2568 items.

Checks run against the built output:

- Every unit's totals match `organization_<doc>.json` on `main`, and Home's highlight cards match, for all five documents.
- Every item file (165) unpacks to the source rows of its ministry, and every packed country-wide file unpacks to its `budget_<doc>.json`: 242,483 rows each time.
- The same 3,445 ministry and unit pages are built as on `main`. Their HTML holds the totals, unit count, item count and vision text.
- The raw budget files, organization files and id registry return 404 from the built site.

Not built yet: prerendering Home's and Search's first view (see "Prerendering Home and Search"). Home's highlight cards are computed at build time, but both pages still render in the browser. The pages were not clicked through in a browser.

## Background

- The site is a static export on GitHub Pages: no server, every file is made at build time. GitHub Pages limits a published site to 1 GB. Deploys of `main` still succeed above it, so the limit does not seem strictly enforced yet, but GitHub can enforce it.
- There are five budget documents: `2568_drafted`, `2569_drafted`, `2569_bill`, `2570_drafted` and `2570_bill`. Each `budget_<doc>.json` holds every budget item in the country for that document: 47,000–50,000 rows and 66–70 MB.
- `pnpm data:import` downloads them from the Google Sheet and they are committed to git, so every data change is reviewed before it goes live.
- Each new document adds to every approach's size, so the room left under 1 GB matters as much as today's size.

## The three approaches

1. **`main` now.** Ministry and unit pages are empty HTML. In the browser, they fetch their ministry's split file (`budget_by_ministry/<doc>/<ministry>.json`, written by `split-budget-by-ministry.mjs` before `next build`) and the organization files (`organization_<doc>.json`). Home and Search fetch the raw country-wide `budget_<doc>.json`.
2. **Prerender, readable JSON kept.** `next build` reads the budget files and puts each page's first view in its HTML. `budget_<doc>.json` stays in `public/data/` and is published exactly as it is now, readable, for what can't be known at build time. The other source files (`category_levels/`, `organizations.json`) move out of `public/`, since only the build reads them.
   - **Organization pages** (done on branch `feat/prerender-organization-pages`): totals, unit list, item count, treemap groups and vision text. Only the item table fetches rows, from per-ministry files that `next build` writes itself, packed. The organization files and the split script are gone.
   - **Home** (not built yet): hero totals, summary cards and highlight cards for the latest document. Another year from the dropdown, and the search box's suggestions, load the readable `budget_<doc>.json` as now.
   - **Search** (not built yet): the view without a keyword, meaning the total per year, the trend chart and the first page of the item list. A keyword (`?q=…`) loads the readable `budget_<doc>.json` and filters in the browser as now, since keywords are only known when someone types them.
3. **Prerender + packed country-wide files.** Approach 2, plus: the raw `budget_<doc>.json` move out of `public/` so they are only read at build time, and `next build` writes one packed file per document, which Home and Search load instead.

## Site size

The published site is everything `pnpm build` writes to `out/`, which the deploy workflow uploads to GitHub Pages. Sizes are in decimal MB (1,000,000 bytes).

`main` is measured from a build of `80acb01` on 2026-11-15. Approaches 2 and 3 are estimated for five documents from measured parts:

- **Packed country-wide file:** 12.9 MB for `budget_2570_drafted.json`, measured.
- **Packed item files:** 13 MB per document, measured on the branch's three-document build.
- **Summaries in the organization pages:** about 49 MB per document. That's the branch's three-document pages (547 MB) minus pages without data (about 400 MB then), divided by three.

| Part of `out/`                                            | What it is                                      | 1. `main` now (measured) | 2. Prerender (estimated)                                          | 3. Prerender + packed (estimated) |
| --------------------------------------------------------- | ----------------------------------------------- | ------------------------ | ----------------------------------------------------------------- | --------------------------------- |
| `data/budget_<doc>.json`                                  | 5 country-wide files                            | 341.0 MB, readable       | 341 MB, readable                                                  | —                                 |
| Packed country-wide files                                 | 5, written by `next build`                      | —                        | —                                                                 | ~65 MB                            |
| `data/budget_by_ministry/`                                | 164 per-ministry item files                     | 361.3 MB, readable       | ~65 MB, packed                                                    | ~65 MB, packed                    |
| `data/organization_<doc>.json`                            | 5 organization files                            | 6.5 MB                   | —                                                                 | —                                 |
| `data/category_levels/`                                   | 5 files, read only by the build                 | 1.6 MB                   | —                                                                 | —                                 |
| `data/organizations.json` + `budgetary_core_content.json` | ids, vision and mission text                    | 2.7 MB                   | — (ids read only by the build; core content moves into the pages) | —                                 |
| `organizations/`                                          | 3,445 ministry and unit pages, `.html` + `.txt` | 410.0 MB, shell only     | ~655 MB, with summaries                                           | ~655 MB, with summaries           |
| `_next/`                                                  | JavaScript, CSS, fonts                          | 3.0 MB                   | ~3 MB                                                             | ~3 MB                             |
| Everything else                                           | Home, Search, Download, About, images, icons    | 2.7 MB                   | ~3 MB                                                             | ~3 MB                             |
| **Total**                                                 |                                                 | **1,128.9 MB**           | **~1,070 MB**                                                     | **~790 MB**                       |
| Under 1 GB                                                |                                                 | no                       | no                                                                | yes                               |
| Added per new document                                    |                                                 | ~140 MB                  | ~130 MB                                                           | ~75 MB                            |

- **`main`:** about 63% of the site is data files (713 MB), mostly two copies of the same budget rows: the country-wide files and the split files. The other 36% is the organization pages, at about 120 KB each with no budget data in them.
- **Approach 2:** the split files shrink from 361 MB to ~65 MB, but the organization pages grow by ~245 MB. Each page carries every document's summary, and Next writes a page's data into four files (`.html`, `.txt`, `__next._full.txt`, `__PAGE__.txt`).
- **Approach 3:** the same as approach 2, but the 341 MB of readable country-wide files become ~65 MB packed.

Prerendering Home and Search adds well under 1 MB in approaches 2 and 3: two pages, each holding a few summary numbers and one page of rows.

The repository is about the same in all three, about 350 MB of tracked files, almost all of it the five raw budget files. Packing happens only in `out/`.

## What readers download

"Parsed" is what the browser has to read after decompressing; "transferred" is what goes over the network, since GitHub Pages gzips JSON. One document's country-wide file is 67 MB parsed and 2.3 MB transferred raw, or 13 MB and 1.5 MB packed (measured on `budget_2570_drafted.json`).

| Page                                 | 1. `main` now                                               | 2. Prerender                    | 3. Prerender + packed              |
| ------------------------------------ | ----------------------------------------------------------- | ------------------------------- | ---------------------------------- |
| Home, first view                     | one country-wide file: 67 MB parsed, 2.3 MB transferred     | in the HTML, no fetch           | same as 2                          |
| Home, another year or the search box | one country-wide file: 67 MB parsed, 2.3 MB transferred     | same as `main`                  | 13 MB parsed, 1.5 MB transferred   |
| Search, no keyword                   | three country-wide files: ~200 MB parsed, ~7 MB transferred | in the HTML, no fetch           | same as 2                          |
| Search, with keyword                 | three country-wide files: ~200 MB parsed, ~7 MB transferred | same as `main`                  | ~40 MB parsed, ~4.5 MB transferred |
| Organizations list                   | an organization file per document, with a skeleton          | in the page, no fetch           | same as 2                          |
| Ministry 22                          | 88 KB HTML + ~6 MB fetched, spinners                        | ~250 KB HTML + ~70 KB item file | same as 2                          |
| Ministry 13 (largest)                | ~80 KB HTML + ~40 MB fetched, spinners                      | ~5.5 MB HTML + ~2 MB item file  | same as 2                          |
| Changing the year                    | new downloads                                               | instant, except the item table  | same as 2                          |

Ministry figures for approaches 2 and 3 are estimated from the three-document build (149 KB and 3.3 MB HTML). `main`'s ministry figures include the five organization files.

## Data before and after build

"Before build" is what is committed to git, which CI checks out. "After build" is what `next build` writes to `out/`, which is published. Counts for `main` are measured; approaches 2 and 3 assume the rebase onto `main`'s five documents.

### Before build: data in git

| File                          | Format                                                         | 1. `main` now   | 2. Prerender                                                                    | 3. Prerender + packed               |
| ----------------------------- | -------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------- | ----------------------------------- |
| `budget_<doc>.json`           | JSON array of row objects, indented, readable                  | 5, 341 MB       | 5, 341 MB                                                                       | 5, 341 MB                           |
| `category_levels/<doc>.json`  | JSON: each level path once, then one path index per budget row | 5, 1.6 MB       | 5                                                                               | 5                                   |
| `organizations.json`          | JSON array: the stable ministry and unit ids used in URLs      | 1, 1.8 MB       | 1                                                                               | 1                                   |
| `organization_<doc>.json`     | JSON array: one total per unit                                 | 5, 7 MB         | —                                                                               | —                                   |
| `budgetary_core_content.json` | JSON object keyed by unit id: vision, mission, objectives      | 1, 0.9 MB       | 1                                                                               | 1                                   |
| `ministry_core_content.json`  | the same, keyed by ministry id                                 | 1               | 1                                                                               | 1                                   |
| `budget_index.json`           | JSON array: document list for the Download page                | 1               | 1                                                                               | 1                                   |
| **Total**                     |                                                                | **19, ~352 MB** | **14, ~345 MB**                                                                 | **14, ~345 MB**                     |
| Where the source data lives   |                                                                | `public/data/`  | `budget_<doc>.json` in `public/data/`; the rest outside `public/`, e.g. `data/` | all outside `public/`, e.g. `data/` |

All of them are written by `pnpm data:import` from the Google Sheets, except `organizations.json`, which `build-organizations.mjs` keeps stable across imports. In approaches 2 and 3, `budgetary_core_content.json` moves to `src/app/data/` beside the other two content files, so it is bundled into the pages instead of fetched.

### After build: data published in `out/`

| File                                                                 | Format                                                            | 1. `main` now                                                    | 2. Prerender                                 | 3. Prerender + packed |
| -------------------------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------- | --------------------- |
| Country-wide data, one per document                                  | 1, 2: copy of `budget_<doc>.json`; 3: packed JSON                 | 5 readable, 341 MB                                               | 5 readable, 341 MB                           | 5 packed, ~65 MB      |
| Per-ministry item files (`budget_by_ministry/<doc>/<ministry>.json`) | 1: minified row objects with `category_levels`; 2, 3: packed JSON | 164 readable, 361 MB (written by `split-budget-by-ministry.mjs`) | 164 packed, ~65 MB (written by `next build`) | same as 2             |
| `organization_<doc>.json`                                            | copy                                                              | 5                                                                | —                                            | —                     |
| `category_levels/<doc>.json`                                         | copy; no page loads it                                            | 5                                                                | —                                            | —                     |
| `organizations.json`                                                 | copy; no page loads it                                            | 1                                                                | —                                            | —                     |
| `budgetary_core_content.json`                                        | copy                                                              | 1                                                                | — (bundled)                                  | — (bundled)           |
| **JSON files in `out/data/`**                                        |                                                                   | **181, ~715 MB**                                                 | **169, ~406 MB**                             | **169, ~130 MB**      |

Approaches 2 and 3 publish only files the browser loads: the item files and the country-wide data. `category_levels/` and `organizations.json` are read only by the build, so they move out of `public/` in both. The two approaches differ only in the format of the country-wide data.

### After build: data inside the pages

Next also writes each page's data into the page files themselves, in its own React Server Components format (`.txt`), not JSON. On `main` that's 3,452 `.html` and 31,013 `.txt` files, of which 3,445 and 30,978 are organization pages: each has an `.html`, a `.txt` and a folder of segment files such as `__next._full.txt` and `__PAGE__.txt`. A page's data is repeated in four of them.

| Page data                      | 1. `main` now                  | 2. Prerender                                                                         | 3. Prerender + packed |
| ------------------------------ | ------------------------------ | ------------------------------------------------------------------------------------ | --------------------- |
| Organization pages             | no budget data, only the shell | every document's summary: totals, unit list, item count, treemap groups, vision text | same as 2             |
| Organizations list             | no budget data                 | every unit's totals for every document, packed                                       | same as 2             |
| Home                           | no budget data                 | the latest document's first view                                                     | same as 2             |
| Search                         | no budget data                 | the no-keyword view: total per year, trend, first page of items                      | same as 2             |
| Size of `organizations/` pages | 410 MB                         | ~655 MB                                                                              | ~655 MB               |

The page and file counts are the same in all three approaches; only what the files hold changes.

## Other differences

|                                          | 1. `main` now                                           | 2. Prerender                                                                                      | 3. Prerender + packed |
| ---------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | --------------------- |
| Content in the HTML (SEO, link previews) | "-" and skeletons on every page with data               | organization pages: totals, unit list, item count, vision text; Home and Search: their first view | same as 2             |
| Build steps of our own                   | `split-budget-by-ministry.mjs` before `dev` and `build` | none: plain `next dev` and `next build`                                                           | same as 2             |
| Organization totals                      | written by a script to `organization_*.json`            | summed from the budget rows at build time, so they can't drift                                    | same as 2             |
| Published files readable                 | yes                                                     | country-wide yes, item files no                                                                   | no                    |
| `pnpm build`                             | ~1 min                                                  | ~1–1.5 min, 1.3 GB peak memory (3 documents)                                                      | similar to 2          |

In approaches 2 and 3 the HTML still doesn't hold the item descriptions on organization pages, which the table fetches, or the treemap tiles, which are laid out from the section's width (0 at build time). Only the latest document is in the HTML; others load through `?budget_source=`.

### Prerendering Home and Search

Today both pages wrap everything in `<Suspense>` because they read the address bar (`src/app/page.tsx`, `src/app/search/page.tsx`), so Next leaves the whole page to the browser. To prerender them:

1. Compute the first view's numbers at build time in the page file, from the budget files, and pass them to the template.
2. Render the first view from those numbers right away.
3. Read the address bar after loading. If it asks for another year or a keyword, load the data as now.

A link with a keyword, such as `/search?q=ถนน`, would otherwise show the no-keyword view before its results. Search should show a loading state when the URL has a keyword.

Home gains the most, since it is the front page: search engines and link previews see real numbers, and the first view no longer waits for a 67 MB file. Search gains less, because its useful content comes from what the reader types.

## What packing is

Packing keeps JSON, with the same data in a different layout. Today a row repeats all 17 key names and every text:

```json
{
  "ministry": "กระทรวงกลาโหม",
  "ministry_id": 7,
  "budgetary": "กองทัพเรือ",
  "budgetary_id": 25,
  "plan": "แผนงานบุคลากรภาครัฐ",
  "description": "เงินเดือน",
  "amount": 18695235000,
  "page_url": "https://bbstore.bb.go.th/cms/1781947212_4506.pdf?#page=803",
  …
}
```

Packed (`src/lib/packed-budget-items.ts`), each text is written once in `strings`. A row becomes an array where each field's position gives its meaning and each text is an index into `strings`. The PDF link is split into its shared part and the page number:

```json
{
  "strings": ["กระทรวงกลาโหม", "กองทัพเรือ", "แผนงานบุคลากรภาครัฐ", …],
  "items": [[0, 7, 1, 25, 2, 2, 3, 3, 3, 4, 3, 5, 18695235000, 6, 7, 8, 803, 18695235000, 6], …]
}
```

The browser unpacks it into the same `BudgetItem` objects, so components don't change. On the branch, all 145,394 rows of the three drafts unpack to their source rows exactly.

Measured on `budget_2570_drafted.json` (47,688 rows):

|                    | Raw     | Packed  |
| ------------------ | ------- | ------- |
| Stored on the site | 67.3 MB | 12.9 MB |
| Transferred (gzip) | 2.3 MB  | 1.5 MB  |

Packing barely changes the transfer size, because GitHub Pages already gzips JSON. What it changes is the stored size, which is what the 1 GB limit counts, and how much the browser has to parse, which matters on phones.

CSV isn't used for the site's files: it still repeats every name and link on every row, turns numbers into text, and needs a parser for quotes and commas inside the Thai text.

## What packing costs: readability

- **Source files stay readable.** `budget_<doc>.json` in git is unchanged; only what the site publishes is packed, during `next build`.
- **Downloads stay readable.** The Download page links each document to its Google Sheet (`csv_url` in `src/app/data/budget_index.json`), not to the JSON. Changing those links from `/edit?gid=…` to `/export?format=csv&gid=…` would download a CSV directly. The sheet is live, so it can differ from the site until the next import and deploy. The CSV buttons on tables are made in the browser from the data the page has loaded.
- **Debugging is harder.** The DevTools Network tab shows arrays of numbers. Rows have to be inspected after unpacking, or in the source file.
- **Field order is the format.** Adding or reordering a field means changing `packBudgetItems` and `unpackBudgetItems` together. A mistake shows up as wrong data, not as a type error, so the round-trip check (every row unpacks to its source row) should run as a test.
- **The raw JSON URLs stop existing.** Nothing on the site links to `/data/budget_<doc>.json`, but anyone outside the team fetching those URLs directly would break.

### Shrinking while staying readable

Measured on `budget_2570_drafted.json`:

| Readable variant                                                                 | Size    | Saving |
| -------------------------------------------------------------------------------- | ------- | ------ |
| As committed (indented)                                                          | 67.3 MB | —      |
| Minified: same fields, one line                                                  | 62.1 MB | −8%    |
| Minified, without `plan` (always `plan_prefix` + `plan_suffix`) and empty fields | 53.2 MB | −21%   |
| Packed, not readable, for comparison                                             | 12.9 MB | −81%   |

Readable files can't shrink much, because most of the size is the Thai text itself (descriptions, plan, PDF and unit names), at 3 bytes per character. Key names are a small part. Applied to approach 2, the slimmest readable variant saves about 70 MB, to roughly 1,000 MB.

The bigger saving that keeps the files readable is in the organization pages: each carries all five documents' summaries, four times over. Keeping only the latest document's summary in the page, and fetching other years as small readable files, would save an estimated 195 MB, putting approach 2 at about 875 MB, with room for about one more document. The cost is a short loading state when changing year. SEO is unaffected, since only the latest document is in the HTML anyway.

## Recommendation

Adopt approach 3. Approach 1 is over the limit today, and approach 2 brings better pages but doesn't shrink the site enough. Only approach 3 fits with room to grow, because the raw country-wide files are now the largest thing the site publishes.

If published readable JSON is a requirement, take approach 2 with only the latest document's summary in each organization page (about 875 MB, see "Shrinking while staying readable"). It fits, but with room for about one more document instead of three.

Steps (approach 3; for approach 2, skip 4 and 5 and trim the page summaries instead):

1. Rebase the branch onto `main` and add the two bill documents to the build-time data.
2. Port `main`'s newer highlight logic (`src/constants/organization.ts`) into the build-time highlights.
3. Prerender Home's and Search's first view.
4. Move `budget_<doc>.json` out of `public/`, so `next build` reads it but doesn't publish it.
5. Have `next build` write one packed country-wide file per document for Home and Search, with the same format and Route Handler approach as the item files.
6. Add the round-trip check as a test, measure `out/`, verify the totals and click through Home, Search, Organizations, ministry 13 and a unit page.

Even approach 3 adds about 75 MB per document, so it holds about two or three more documents. After that, the options are a host without a 1 GB limit, or keeping only the latest documents in the page summaries.

## Questions for review

1. Is it acceptable that the site no longer publishes readable JSON, given that the source files and the Google Sheets stay readable?
2. Should the Download page's Sheets links download a CSV directly?
3. Should we plan now for a host without a 1 GB limit, or wait until approach 3 runs out of room?
