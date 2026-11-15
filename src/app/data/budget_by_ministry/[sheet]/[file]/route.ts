import {
  DOC_SOURCE_OPTIONS,
  getDocSourceFromSheet,
  getDocSourceSheet,
} from "@/constants/budget";
import { getMinistryItems } from "@/lib/budget-source";
import { getMinistries } from "@/lib/organization-pages";
import { packBudgetItems } from "@/lib/packed-budget-items";

// /data/budget_by_ministry/<sheet>/<ministry_id>.json: one ministry's items
// in one document, packed, for the ministry and budgetary pages' item tables.
// The site is a static export, so `next build` writes each one as a file,
// from public/data/budget_<sheet>.json; nothing is generated beforehand.

export const dynamicParams = false;

export function generateStaticParams() {
  const ministries = getMinistries();
  return DOC_SOURCE_OPTIONS.flatMap(({ value }) =>
    ministries.map(({ id }) => ({
      sheet: getDocSourceSheet(value),
      file: `${id}.json`,
    })),
  );
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sheet: string; file: string }> },
) {
  const { sheet, file } = await params;
  const docSource = getDocSourceFromSheet(sheet);
  const ministryId = Number(file.replace(/\.json$/, ""));
  return Response.json(
    packBudgetItems(getMinistryItems(docSource, ministryId)),
  );
}
