# Budget data loading: options for the ministry and unit pages

**Decision needed:** how the ministry and unit (budgetary) pages get their budget items. Today they download the whole country's budget file to show one organization's rows.

**Recommendation:** split the budget files per ministry, generated at build time rather than committed (option B). Add per-unit files later only if the unit pages of the largest ministry need them (option C).

## Background

Every page reads static JSON from `public/data/`. The site is a static export, so there is no server to query.

- **Budget files.** `budget_<year>_drafted.json` holds every budget item in the country for one year, about 47,000–50,000 rows and 64–67 MB each.
- **Organization files.** `organization_<year>_drafted.json` holds one total per budgetary unit, about 1.2 MB each.

The ministry page (`/organizations/[ministry_id]`) and the unit page (`/organizations/[ministry_id]/[budgetary_id]`) use only their own organization's items. For example, ministry 22 has 267 of 47,688 items in 2570, about 0.5% of the file, but both pages still download the full 64 MB budget file.

The next feature makes this more pressing. The เปรียบเทียบสัดส่วนงบตาม treemap's tooltip shows each group's change from the previous year, and that needs the previous year's items too. As things stand, that would be a second 64 MB download.

## Options

- **A. As now.** Every page fetches whole-country files. For the treemap's change badge, we would add a small precomputed breakdown file (about 100 KB per ministry) instead of downloading last year's 64 MB budget file.
- **B. Split per ministry.** A build step writes `public/data/budget_by_ministry/<year>/<ministry_id>.json`, holding the same rows as the budget files, one file per ministry per year. Unit pages load their ministry's file and keep their own rows. The treemap computes its groups, including last year's, from this year's and last year's files, so no breakdown file is needed.
- **C. Split per ministry and per unit.** Same as B, plus `budget_by_budgetary/<year>/<budgetary_id>.json` for unit pages.

The country-wide budget files stay in all three options, because Home and Search need the whole country.

## What each page downloads

Sizes are uncompressed. GitHub Pages gzips files in transit, which shrinks all of them a lot. "×2" means the selected year plus the previous year, which the treemap needs for its change badge.

| Page          | A. As now                                                                                                | B. Per ministry                                                 | C. Per ministry and unit                                |
| ------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------- |
| Home          | selected year's budget file (64 MB) + its organization file (1.2 MB) ≈ **65 MB**                         | **65 MB** (unchanged)                                           | **65 MB** (unchanged)                                   |
| Search        | the 2568, 2569 and 2570 budget files, for its trend chart ≈ **195 MB**                                   | **195 MB** (unchanged)                                          | **195 MB** (unchanged)                                  |
| Organizations | selected year's organization file ≈ **1.2 MB**                                                           | **1.2 MB** (unchanged)                                          | **1.2 MB** (unchanged)                                  |
| Ministry      | budget file (64 MB) + 3 organization files (3.7 MB) ≈ **68 MB**                                          | ministry file ×2 + 3.7 MB ≈ **5 MB typical, 35 MB worst**       | same as B                                               |
| Ministry unit | budget file (64 MB) + 3 organization files (3.7 MB) + `budgetary_core_content.json` (0.8 MB) ≈ **69 MB** | its ministry's file ×2 + 4.5 MB ≈ **6 MB typical, 36 MB worst** | unit file ×2 + 4.5 MB ≈ **4.6 MB typical, 11 MB worst** |

### Split file sizes (measured on 2568–2570 data)

|                   | Median     | 95th percentile | Largest                            |
| ----------------- | ---------- | --------------- | ---------------------------------- |
| Per-ministry file | 0.6–0.7 MB | n/a             | 16.9 MB (ministry 13, 13,166 rows) |
| Per-unit file     | 5–6 KB     | 64–73 KB        | 3.5 MB                             |

Ministry 13 holds 2,852 local-government units. Under B, each of their unit pages downloads its 17 MB ministry file to show at most 58 rows. That is the main reason C exists.

## Cost of each option

|                          | A. As now                          | B. Per ministry                                                    | C. Per ministry and unit                                      |
| ------------------------ | ---------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------- |
| Published site size      | ~665 MB (measured)                 | ~845 MB (measured; +180 MB generated)                              | ~1.02 GB (estimated; +360 MB generated)                       |
| Generated files per year | 0                                  | 33                                                                 | 33 + ~3,300                                                   |
| Repository size          | unchanged                          | unchanged, if generated (see below)                                | unchanged, if generated                                       |
| Code changes             | a breakdown script for the treemap | a split script; the ministry and unit pages fetch a different file | the same as B, plus a unit-level file choice in the data hook |

Measured from a full `pnpm build` (`out/`). Of today's ~665 MB, about 420 MB is the ~3,400 pre-rendered ministry and unit pages: each page's HTML plus the per-route files Next writes beside it, about 125 KB per page. The other ~245 MB is `public/data`.

GitHub Pages limits a published site to 1 GB. A and B fit; **C would exceed it**, unless per-unit files were limited to ministry 13 or the pre-rendered page output were trimmed. Each deploy uploads the full site.

## Generated, not committed

The split files are copies of `budget_*.json`, which is already in git. Committing them would add about 180 MB of duplicated JSON (B) or about 360 MB (C) to the repository, and every data refresh would rewrite all of it.

Proposal:

- A script (`scripts/split-budget-by-ministry.mjs`) writes the split files from the country-wide budget files.
- It runs as `predev` and `prebuild` in `package.json`, and in `pnpm data:import`.
- `public/data/budget_by_ministry/` (and `budget_by_budgetary/` for C) goes in `.gitignore`.

Both deploy workflows, `.github/workflows/deploy.yml` and `production.yml`, run `pnpm build`, so CI generates the files without workflow changes.

## Recommendation

1. **Adopt B now.** Ministry and unit pages drop from about 68 MB to about 5 MB in the typical case. The work is one script and a change to one data hook.
2. **Defer C.** Add per-unit files only if ministry 13's unit pages prove slow, and then for ministry 13 alone: full per-unit files would push the published site past GitHub Pages' 1 GB limit. The pages would not change; only the data hook's choice of file would.
3. **Look at Search separately.** At about 195 MB, it becomes the heaviest page. It downloads three full years only to draw a three-point trend. Precomputing per-year totals for each keyword isn't possible, since keywords are free text. Options include a server-side search or a slimmer per-year file holding only the matched fields. That is outside this decision.

## Questions for review

1. Is generating the split files at build time (gitignored) acceptable, or should data files always be committed?
2. Is an ~845 MB published site (B) acceptable, given GitHub Pages' 1 GB limit? The ~420 MB of pre-rendered unit pages may be worth trimming separately.
3. Should ministry 13's unit pages get per-unit files now, or wait until they're measured as slow?
