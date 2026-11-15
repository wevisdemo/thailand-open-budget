import type {
  OrganizationListData,
  OrganizationYearTotal,
} from "@/types/organization";
import {
  type DocSourceValue,
  getPreviousStageDocSource,
} from "@/constants/budget";

// A previous-year amount as a share of the previous year's country budget,
// 0-100, rounded to 6 decimals as getYearTotals rounds it.
function getSharePercent(amount: number | null, total: number | undefined) {
  return amount === null || !total
    ? null
    : Number(((amount / total) * 100).toFixed(6));
}

// Packs every document's unit totals, writing each ministry's name once.
export function packOrganizationTotals(
  totalsByDocument: Record<
    string,
    { units: OrganizationYearTotal[]; countryBudget: number }
  >,
): OrganizationListData {
  const ministryNames: OrganizationListData["ministryNames"] = {};
  const years: OrganizationListData["years"] = {};
  for (const [docSource, { units, countryBudget }] of Object.entries(
    totalsByDocument,
  )) {
    years[docSource] = {
      units: units.map((unit) => {
        ministryNames[unit.ministry_id] = unit.ministry_name;
        return [
          unit.budgetary_id,
          unit.budgetary_name,
          unit.ministry_id,
          unit.budget_amount,
          unit.previous_year_amount,
        ];
      }),
      countryBudget,
    };
  }
  return { ministryNames, years };
}

// One document's unit totals, field for field as they were packed.
export function unpackOrganizationTotals(
  { ministryNames, years }: OrganizationListData,
  docSource: DocSourceValue,
): OrganizationYearTotal[] {
  const previousDocSource = getPreviousStageDocSource(docSource);
  const previousTotal = previousDocSource
    ? years[previousDocSource]?.countryBudget
    : undefined;
  return (years[docSource]?.units ?? []).map(
    ([budgetaryId, budgetaryName, ministryId, amount, previousAmount]) => ({
      budgetary_id: budgetaryId,
      budgetary_name: budgetaryName,
      ministry_id: ministryId,
      ministry_name: ministryNames[ministryId],
      budget_amount: amount,
      previous_year_amount: previousAmount,
      previous_year_percent: getSharePercent(previousAmount, previousTotal),
    }),
  );
}
