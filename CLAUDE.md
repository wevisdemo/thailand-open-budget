@AGENTS.md

# Code Style Guide (based on apps/ballotready)

This document captures the code conventions used in this project. Use this as a reference when writing new code in any Next.js app in this monorepo.

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
├── types/                   # TypeScript interface/type files
```

---

## Components

### Functional Components

- Always use **function declarations** (not arrow functions) for components
- Always use **`default export`**
- Add `'use client'` directive only when needed (interactivity, hooks, browser APIs)
- Server components (pages) have no directive — just a default export function

```tsx
"use client";

interface IndividualCardProps {
  candidate: Candidate;
}

export default function IndividualCard({ candidate }: IndividualCardProps) {
  return <div>{candidate.name}</div>;
}
```

### Props Typing

- Define props as an **`interface`** with a `Props` suffix in the same file
- Destructure props directly in the function signature
- Nullable optional fields: `field: string | null`

---

## TypeScript

### Type vs Interface

- Use `interface` for object shapes
- Use `type` for aliases (e.g., `Record<K, V>`, discriminated unions)

```ts
export interface Candidate {
  name: string;
  age: number | null;
  party: Party;
}

export type ConstituencyMap = Record<string, Candidate[]>;
```

### Type File Organization

- One file per domain in `src/type/`, lowercase filenames
- Example: `candidate.ts`, `party.ts`, `district.ts`

---

## Imports & Exports

### Path Aliases

- Use `@/*` alias for all root-relative imports

```ts
import { Candidate } from "@/src/type/candidate";
```

### JSON Imports

```ts
import data from "./data/file.json" with { type: "json" };
```

### Import Order

1. React and Next.js
2. Third-party packages
3. Local types
4. Local components and utilities

### Exports

- Components: `export default function`
- Types/constants: named exports

---

## Next.js Components

Always prefer Next.js built-in components over native HTML tags:

- `<Image>` from `next/image` instead of `<img>`
- `<Link>` from `next/link` instead of `<a>`

Exception: if the user has explicitly written a native HTML tag (`<img>`, `<a>`, etc.) in the code, do **not** replace it — they chose it intentionally for a reason. Only use Next.js components when writing new code.

---

## Colors

Always select colors from `src/styles/tailwind-config.css`. Use them as Tailwind text/bg/border utilities by dropping the `--color-` prefix:

```tsx
// var --color-support-01 → text-support-01
<p className="text-support-01">example</p>

// var --color-inverse-02 → bg-inverse-02
<div className="bg-inverse-02">example</div>
```

---

## Styling (Tailwind CSS)

- Apply utility classes inline — no custom class names
- Use arbitrary values where needed: `px-[24px]`, `text-[16px]`
- No CSS Modules, no `clsx`/`cn` unless already in project

```tsx
<div className="flex flex-col items-center gap-[16px] bg-[#76EECC] px-[16px] py-[24px] text-center">
```

---

## State Management

Use React's built-in primitives only.

### Context + useReducer Pattern

```ts
// store/feature/FeatureStore.tsx
export type FeatureAction =
  | { type: "OPEN"; payload: OpenPayload }
  | { type: "CLOSE" };

export const featureReducer = (
  state: FeatureState,
  action: FeatureAction,
): FeatureState => {
  switch (action.type) {
    case "OPEN":
      return { isOpen: true, ...action.payload };
    case "CLOSE":
      return { isOpen: false };
    default:
      return state;
  }
};
```

```tsx
// Context provider
export const FeatureStoreProvider = ({ children }: { children: ReactNode }) => {
  const [feature, dispatch] = useReducer(featureReducer, initialState);
  return (
    <FeatureStoreContext.Provider
      value={{ feature: { state: feature, dispatch } }}
    >
      {children}
    </FeatureStoreContext.Provider>
  );
};
```

---

## Data Patterns

### Static JSON + Type Cast

```ts
import raw from "./data/candidates.json" with { type: "json" };
const candidates = (raw as Candidate[]) || [];
```

### Array to Lookup Map

```ts
const districtMap: Record<string, District> = Object.fromEntries(
  districtList.map((d) => [d.subDistrict, d] as const),
);
```

### Static Params (App Router)

```ts
export async function generateStaticParams() {
  return Object.keys(indexToMap).map((index) => ({ slug: index }));
}
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

## React Hooks

### Common Patterns

```tsx
// State with union type
const [voteType, setVoteType] = useState<"individual" | "party">("individual");

// Ref for DOM element
const ref = useRef<HTMLDivElement | null>(null);

// Effect with cleanup
useEffect(() => {
  const handler = (e: MouseEvent) => {
    /* ... */
  };
  document.addEventListener("mousedown", handler);
  return () => document.removeEventListener("mousedown", handler);
}, []);

// Scroll listener (passive for performance)
useEffect(() => {
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}, []);
```

---

## Common Patterns

### Early Return for Empty State

```tsx
if (!data) return null;
if (!isOpen) return null;
```

### Backdrop Click to Close Modal

```tsx
const handleBackdropClick = (e: React.MouseEvent) => {
  if (e.target === e.currentTarget) handleClose();
};
```

### Click Outside to Close

```tsx
useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) onClose();
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [ref]);
```

### Regex Search/Filter

```tsx
const regex = new RegExp(`(${searchText})`, "gi");
const filtered = items.filter((item) => item.name.match(regex));
```

### SVG as Component

```tsx
export default function IconName({
  color,
  className,
}: {
  color?: string;
  className?: string;
}) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* paths */}
    </svg>
  );
}
```

---

## Conventional Commits

All commit messages must follow the Conventional Commits format:

```
<type>: <description>

[optional body]
```

### Types

| Type       | When to use                                                                          |
| ---------- | ------------------------------------------------------------------------------------ |
| `feat`     | Add, adjust, or remove a feature in the API or UI                                    |
| `fix`      | Fix an API or UI bug from a preceding `feat` commit                                  |
| `refactor` | Rewrite or restructure code without altering API or UI behavior                      |
| `perf`     | Special `refactor` that specifically improves performance                            |
| `style`    | Code style changes (whitespace, formatting, missing semicolons) — no behavior change |
| `test`     | Add missing tests or correct existing ones                                           |
| `docs`     | Changes that exclusively affect documentation                                        |
| `build`    | Changes to build tools, dependencies, project version, etc.                          |
| `ops`      | Infrastructure, deployment, CI/CD, monitoring, backup, or recovery changes           |
| `chore`    | Miscellaneous tasks: initial commit, `.gitignore` updates, etc.                      |

### Description rules

- Mandatory — always required
- Use the imperative, present tense: "change" not "changed" or "changes"
- Think: _"This commit will..."_ or _"This commit should..."_
- Do not capitalize the first letter
- Do not end with a period

### Body rules

- Optional
- Use imperative, present tense
- Explain the motivation for the change and contrast with previous behavior

### Examples

```
feat: add budget filter by ministry

fix: correct total amount calculation in summary table

refactor: extract chart logic into separate hook

docs: update README with local development steps
```
