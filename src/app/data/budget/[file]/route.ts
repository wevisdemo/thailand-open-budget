import {
  DOC_SOURCE_OPTIONS,
  getDocSourceFromSheet,
  getDocSourceSheet,
} from "@/constants/budget";
import { getBudgetItems } from "@/lib/budget-source";
import { packBudgetItems } from "@/lib/packed-budget-items";

// /data/budget/<sheet>.json: every item in one document, packed, for Home and
// Search. The site is a static export, so `next build` writes each one as a
// file, from budget_<sheet>.json; the unpacked file itself is not published.

export const dynamicParams = false;

export function generateStaticParams() {
  return DOC_SOURCE_OPTIONS.map(({ value }) => ({
    file: `${getDocSourceSheet(value)}.json`,
  }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  const docSource = getDocSourceFromSheet(file.replace(/\.json$/, ""));
  return Response.json(packBudgetItems(getBudgetItems(docSource)));
}
