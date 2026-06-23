# Thailand Open Budget

Thailand open budget data visualization

## Deployments

| Name       | URL                                              | Host/Pipeline          |
| ---------- | ------------------------------------------------ | ---------------------- |
| Production | -                                                | -                      |
| Staging    | https://wevisdemo.github.io/thailand-open-budget | Github Actions + Pages |

## Tech Stack

- [Next.js 16](https://nextjs.org) — React framework (static export)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)

## Design System

This project adopts the design system from [WeVis Parliament Watch](https://github.com/wevisdemo/parliament-watch), which is built on top of [IBM Carbon Design System v10](https://carbondesignsystem.com).

## Environment Variables (if used)

- NEXT_PUBLIC_BASE_PATH = Base path for the app (needed for Github Pages)

## Usages

Requirements: Node.js 18+, pnpm

### Local dev server

Install packages

```sh
pnpm i
```

Run dev server

```sh
pnpm run dev
```

### Data

Fetch a single budget sheet (defaults to `2568_drafted`):

```sh
pnpm data:fetch [sheet_name]
```

Import all budget sheets (`2568_drafted`, `2569_drafted`) and save them to `public/data/`:

```sh
pnpm data:import
```

Run data import before starting the dev server or building if `public/data/` is empty.

### Adding a new dataset

1. **Register the sheet** — add the sheet name and its GID to `SHEET_GID_MAP` in `scripts/constants.mjs`:

   ```js
   export const SHEET_GID_MAP = {
     "2568_drafted": "321838122",
     "2569_drafted": "2114899200",
     "2570_drafted": "<new_gid>", // add here
   };
   ```

2. **Add the source value** — extend `DocSourceValue` and `DOC_SOURCE_DATA_FILE` in `src/constants/budget.ts`:

   ```ts
   export type DocSourceValue =
     | "2568-draft-1"
     | "2569-draft-1"
     | "2570-draft-1";

   export const DOC_SOURCE_DATA_FILE: Record<DocSourceValue, string> = {
     "2568-draft-1": "budget_2568_drafted",
     "2569-draft-1": "budget_2569_drafted",
     "2570-draft-1": "budget_2570_drafted", // add here
   };
   ```

3. **Add the dropdown option** — append to `DOC_SOURCE_OPTIONS` in the same file:

   ```ts
   export const DOC_SOURCE_OPTIONS = [
     ...{ value: "2570-draft-1", label: "2570 ฉบับร่าง (วาระ 1)" },
   ];
   ```

4. **Fetch the data**:

   ```sh
   pnpm data:fetch 2570_drafted
   ```

### Build

```sh
pnpm run build
```

Output will be in the `out/` folder (static files, ready to deploy).

## Related resources

- Figma link
- Spreadsheet / CoLab / Google Drive link
- External data sources link

## Team members

- Dev
- Designer
- PM

## License
