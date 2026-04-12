@AGENTS.md

# Code Style Guide

---

## Project Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 — no CSS Modules, no styled-components
- **State**: React Context + `useReducer` — no Redux, Zustand, or Jotai
- **Data**: Static JSON imports — no REST/GraphQL API client libraries

---

## Folder Structure

```
src/
├── app/
│   ├── components/
│   │   ├── FeatureName/    # PascalCase — feature-specific components
│   │   └── shared/         # reusable cross-feature components
│   ├── data/               # static JSON files
│   ├── store/              # Context providers and reducers
│   └── [route]/            # Next.js App Router pages
├── constants/              # derived data maps and constants
├── types/                  # TypeScript interface/type files
```

---

## Components

- Use **function declarations** (not arrow functions)
- Always use **`default export`**
- Add `'use client'` only when needed (interactivity, hooks, browser APIs)
- Define props as an **`interface`** with a `Props` suffix in the same file
- Destructure props directly in the function signature
- Nullable optional fields: `field: string | null`

---

## TypeScript

- `interface` for object shapes; `type` for aliases (unions, `Record<K,V>`)
- One file per domain in `src/types/`, lowercase filenames (e.g. `candidate.ts`)

---

## Imports & Exports

- Path alias: `@/*` for all root-relative imports
- JSON: `import data from "./data/file.json" with { type: "json" }`
- Import order: React/Next.js → third-party → local types → local components
- Components: `export default function`; types/constants: named exports

---

## Next.js Components

Prefer Next.js built-ins for new code:

- `<Image>` from `next/image` instead of `<img>`
- `<Link>` from `next/link` instead of `<a>`

Do **not** replace native tags the user has written intentionally.

---

## Colors

Select colors from `src/styles/tailwind-config.css`. Drop the `--color-` prefix to use as a Tailwind utility:

```tsx
// --color-support-01 → text-support-01
// --color-inverse-02 → bg-inverse-02
```

---

## Styling (Tailwind CSS)

- Inline utility classes only — no custom class names
- Arbitrary values are fine: `px-[24px]`, `text-[16px]`
- No CSS Modules, no `clsx`/`cn` unless already in project

---

## State Management

Use React Context + `useReducer`. No external state libraries.

---

## Data Patterns

```ts
// Static JSON with type cast
import raw from "./data/candidates.json" with { type: "json" };
const candidates = (raw as Candidate[]) || [];

// Array to lookup map
const districtMap: Record<string, District> = Object.fromEntries(
  districtList.map((d) => [d.subDistrict, d] as const),
);
```

---

## Naming Conventions

| Thing                   | Convention                     | Example                          |
| ----------------------- | ------------------------------ | -------------------------------- |
| Component files         | PascalCase                     | `IndividualCard.tsx`             |
| Page section components | PascalCase in lowercase folder | `home/SearchSection.tsx`         |
| Props interface         | `ComponentNameProps`           | `IndividualCardProps`            |
| Event handlers          | `onX` or `handleX` prefix      | `onClickViewList`, `handleClose` |
| State setters           | `setX`                         | `setExpanded`, `setVoteType`     |
| Type files              | lowercase                      | `candidate.ts`                   |
| Constant files          | lowercase                      | `electorate.ts`                  |
| JSON data files         | lowercase_with_underscores     | `district_province_list.json`    |

---

## Conventional Commits

Format: `<type>: <description>` with an optional body.

### Types

| Type       | When to use                                                               |
| ---------- | ------------------------------------------------------------------------- |
| `feat`     | Add, adjust, or remove a feature in the API or UI                         |
| `fix`      | Fix an API or UI bug from a preceding `feat` commit                       |
| `refactor` | Rewrite or restructure code without altering API or UI behavior           |
| `perf`     | Special `refactor` that specifically improves performance                 |
| `style`    | Code style only (whitespace, formatting, semicolons) — no behavior change |
| `test`     | Add missing tests or correct existing ones                                |
| `docs`     | Changes that exclusively affect documentation                             |
| `build`    | Build tools, dependencies, project version                                |
| `ops`      | Infrastructure, CI/CD, deployment, monitoring                             |
| `chore`    | Miscellaneous tasks: initial commit, `.gitignore`, etc.                   |

### Description rules

- Imperative, present tense: "change" not "changed"
- Do not capitalize the first letter
- Do not end with a period

### Body (optional)

Explain the motivation and contrast with previous behavior, imperative tense.
