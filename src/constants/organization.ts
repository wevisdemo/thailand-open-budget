import type {
  OrganizationHighlight,
  OrganizationYearTotal,
} from "@/types/organization";

export const HIGHLIGHT_TITLES = {
  topMinistry: "กลุ่มหน่วยงานที่ได้รับงบประมาณมากที่สุด",
  topBudgetary: "หน่วยงานที่ได้รับงบประมาณมากที่สุด",
  topIncrease: "หน่วยงานที่งบประมาณเพิ่มขึ้นมากที่สุด",
  topDecrease: "หน่วยงานที่งบประมาณลดลงมากที่สุด",
} as const;

function formatMillions(baht: number): string {
  return Math.round(baht / 1_000_000).toLocaleString("en-US");
}

function budgetaryHref(unit: OrganizationYearTotal, query: string): string {
  return `/organizations/${unit.ministry_id}/${unit.budgetary_id}${query}`;
}

function shiftHighlight(
  id: "topIncrease" | "topDecrease",
  { unit, diff }: { unit: OrganizationYearTotal; diff: number },
  query: string,
): OrganizationHighlight {
  const amountDiff = unit.budget_amount - (unit.previous_year_amount ?? 0);
  return {
    id,
    title: HIGHLIGHT_TITLES[id],
    name: unit.budgetary_name,
    href: budgetaryHref(unit, query),
    value: `${diff > 0 ? "เพิ่มขึ้น" : "ลดลง"}จากงบปีก่อน ${formatMillions(Math.abs(amountDiff))}`,
    unit: `ล้านบาท (${Math.abs(diff).toFixed(2)}%)`,
  };
}

// Picks the year's highlights, in card order. A highlight the year cannot
// answer is left out: with no previous-year document there is no shift to
// rank, so only the first two remain.
export function getOrganizationHighlights(
  data: OrganizationYearTotal[],
  dataValue: string,
): OrganizationHighlight[] {
  const query = `?budget_source=${dataValue}`;
  const highlights: OrganizationHighlight[] = [];

  // 1. กลุ่มหน่วยงานที่ได้รับงบประมาณมากที่สุด: budget_amount summed per ministry_id
  const ministryTotals = new Map<number, { name: string; amount: number }>();
  for (const unit of data) {
    const amount = ministryTotals.get(unit.ministry_id)?.amount ?? 0;
    ministryTotals.set(unit.ministry_id, {
      name: unit.ministry_name,
      amount: amount + unit.budget_amount,
    });
  }
  const [topMinistry] = [...ministryTotals.entries()].sort(
    ([, a], [, b]) => b.amount - a.amount,
  );
  if (topMinistry) {
    const [ministryId, { name, amount }] = topMinistry;
    highlights.push({
      id: "topMinistry",
      title: HIGHLIGHT_TITLES.topMinistry,
      name,
      href: `/organizations/${ministryId}${query}`,
      value: formatMillions(amount),
      unit: "ล้านบาท",
    });
  }

  // 2. หน่วยงานที่ได้รับงบประมาณมากที่สุด
  const [topBudgetary] = [...data].sort(
    (a, b) => b.budget_amount - a.budget_amount,
  );
  if (topBudgetary) {
    highlights.push({
      id: "topBudgetary",
      title: HIGHLIGHT_TITLES.topBudgetary,
      name: topBudgetary.budgetary_name,
      href: budgetaryHref(topBudgetary, query),
      value: formatMillions(topBudgetary.budget_amount),
      unit: "ล้านบาท",
    });
  }

  // 3-4 are ranked by the change in share of the year's total, in percentage points.
  // The total is over every unit, the same base previous_year_percent takes.
  // Units new this year have no previous share and are left out.
  const grandTotal = data.reduce((sum, unit) => sum + unit.budget_amount, 0);
  const shifts = data
    .filter((unit) => unit.previous_year_percent !== null)
    .map((unit) => ({
      unit,
      diff:
        (unit.budget_amount / grandTotal) * 100 -
        (unit.previous_year_percent ?? 0),
    }))
    .sort((a, b) => b.diff - a.diff);

  const increase = shifts[0];
  const decrease = shifts[shifts.length - 1];
  // 3. หน่วยงานที่งบประมาณเพิ่มขึ้นมากที่สุด
  if (increase?.diff > 0) {
    highlights.push(shiftHighlight("topIncrease", increase, query));
  }
  // 4. หน่วยงานที่งบประมาณลดลงมากที่สุด
  if (decrease?.diff < 0) {
    highlights.push(shiftHighlight("topDecrease", decrease, query));
  }

  return highlights;
}
