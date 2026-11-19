"use client";

import { useState } from "react";
import Link from "next/link";
import type { OrganizationMinistryGroup } from "@/types/organization";
import DownAngleIcon from "@/app/components/shared/icons/down-angle-icon";
import ShareBar from "@/app/components/shared/ui/ShareBar";
import BoldMatch from "@/app/components/shared/ui/BoldMatch";
import ChangeBadge from "@/app/components/shared/ui/ChangeBadge";

// The units' own table repeats the outer table's column widths so its cells
// line up with the ministry rows.
const UNIT_COLUMN_WIDTHS = ["5%", "5%", "38%", "18%", "18%", "16%"];

// Units shown when a ministry expands, and added by each "see more" click.
const UNITS_PER_PAGE = 20;

// A click on the row's own link or button already does its job; only clicks
// elsewhere in the row expand it, so the chevron doesn't toggle twice.
function isFromControl(event: React.MouseEvent) {
  return (event.target as HTMLElement).closest("a, button") !== null;
}

interface MinistryRowsProps {
  group: OrganizationMinistryGroup;
  rank: number;
  isExpanded: boolean;
  onToggle: (ministryId: number) => void;
  totalBudget: number;
  maxAmount: number;
  dataValue: string;
  query: string;
}

interface AmountCellsProps {
  amount: number;
  previousAmount: number | null;
  totalBudget: number;
  maxAmount: number;
}

function AmountCells({
  amount,
  previousAmount,
  totalBudget,
  maxAmount,
}: AmountCellsProps) {
  return (
    <>
      <td className="px-[16px] py-[16px] text-right whitespace-nowrap">
        {amount.toLocaleString("en-US")}
      </td>
      <td className="px-[16px] py-[16px]">
        <ShareBar
          percent={(amount / totalBudget) * 100}
          fill={(amount / maxAmount) * 100}
        />
      </td>
      <td className="px-[16px] py-[16px] text-right">
        <ChangeBadge amount={amount} previousAmount={previousAmount} />
      </td>
    </>
  );
}

// One ministry's row, and under it, while expanded, its units in a box that
// scrolls past half the screen: a ministry can hold thousands
// (องค์กรปกครองส่วนท้องถิ่น has ~2,850).
export default function MinistryRows({
  group,
  rank,
  isExpanded,
  onToggle,
  totalBudget,
  maxAmount,
  dataValue,
  query,
}: MinistryRowsProps) {
  const [visibleCount, setVisibleCount] = useState(UNITS_PER_PAGE);
  const visibleUnits = group.units.slice(0, visibleCount);
  const remaining = group.units.length - visibleUnits.length;
  const ministryHref = `/organizations/${group.ministry_id}?budget_source=${dataValue}`;

  function handleRowClick(event: React.MouseEvent) {
    if (isFromControl(event)) return;
    onToggle(group.ministry_id);
  }

  return (
    <>
      <tr
        onClick={handleRowClick}
        className="border-ui-03 hover:bg-gray-10 border-b bg-white align-top leading-[18px] hover:cursor-pointer"
      >
        <td className="py-[16px] text-center">
          <button
            type="button"
            onClick={() => onToggle(group.ministry_id)}
            aria-expanded={isExpanded}
            aria-label={`${isExpanded ? "ซ่อน" : "แสดง"}หน่วยงานใน${group.ministry_name}`}
            className="hover:cursor-pointer"
          >
            <DownAngleIcon
              className={`transition-transform ${isExpanded ? "" : "-rotate-90"}`}
            />
          </button>
        </td>
        <td className="py-[16px] text-center">{rank}</td>
        <td className="px-[16px] py-[16px]">
          <Link
            href={ministryHref}
            className="text-text-01 hover:text-blue-70 underline"
          >
            <BoldMatch text={group.ministry_name} query={query} />
          </Link>
          <p className="text-text-03 mt-[4px]">
            มี {group.units.length.toLocaleString()} หน่วยงาน
          </p>
        </td>
        <AmountCells
          amount={group.budget_amount}
          previousAmount={group.previous_year_amount}
          totalBudget={totalBudget}
          maxAmount={maxAmount}
        />
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={6} className="p-0">
            <div className="max-h-[50vh] overflow-y-auto">
              <table className="w-full table-fixed border-collapse">
                <colgroup>
                  {UNIT_COLUMN_WIDTHS.map((width, i) => (
                    <col key={i} style={{ width }} />
                  ))}
                </colgroup>
                <tbody>
                  {visibleUnits.map((unit) => {
                    const unitHref = `/organizations/${unit.ministry_id}/${unit.budgetary_id}?budget_source=${dataValue}`;
                    return (
                      <tr
                        key={unit.budgetary_id}
                        className="border-ui-03 bg-ui-01 hover:bg-gray-10 border-b align-top leading-[18px]"
                      >
                        <td />
                        <td />
                        <td className="px-[16px] py-[16px]">
                          <Link
                            href={unitHref}
                            className="text-text-01 hover:text-blue-70 underline"
                          >
                            <BoldMatch
                              text={unit.budgetary_name}
                              query={query}
                            />
                          </Link>
                        </td>
                        <AmountCells
                          amount={unit.budget_amount}
                          previousAmount={unit.previous_year_amount}
                          totalBudget={totalBudget}
                          maxAmount={maxAmount}
                        />
                      </tr>
                    );
                  })}
                  {remaining > 0 && (
                    <tr className="border-ui-03 bg-ui-01 border-b">
                      <td />
                      <td />
                      <td colSpan={4} className="px-[16px] py-[12px] text-left">
                        <button
                          type="button"
                          onClick={() =>
                            setVisibleCount((count) => count + UNITS_PER_PAGE)
                          }
                          className="text-blue-70 underline hover:cursor-pointer"
                        >
                          ดูเพิ่มเติม ({Math.min(UNITS_PER_PAGE, remaining)} จาก{" "}
                          {remaining.toLocaleString()} หน่วยงานที่เหลือ)
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
