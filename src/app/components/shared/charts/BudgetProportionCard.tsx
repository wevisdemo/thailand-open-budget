import type { ReactNode } from "react";
import { truncateText } from "@/lib/truncate";
import DonutChart from "./DonutChart";

interface BudgetProportionCardProps {
  // The line under the title naming what is measured, e.g. a ministry.
  subtitle: string;
  // Label for the measured amount in the legend, e.g. "งบฯ <ministry>".
  selectedLabel: string;
  // Cuts a long selectedLabel to this many characters, with the full label
  // on hover. Unset, the label is shown whole.
  selectedLabelMaxLength?: number;
  filteredBudget: number;
  totalBudget: number;
  // What totalBudget is, in the legend and under the donut; the country's
  // budget by default.
  totalLabel?: string;
  donutLabel?: string;
  // A control to change what the share is measured against, under the year.
  baseSelect?: ReactNode;
  year: number;
  version: string;
}

export default function BudgetProportionCard(props: BudgetProportionCardProps) {
  const totalLabel = props.totalLabel ?? "งบฯ ทั้งประเทศ";
  const percentage =
    props.totalBudget > 0
      ? (props.filteredBudget / props.totalBudget) * 100
      : 0;

  return (
    <div className="flex h-full w-full flex-col gap-[16px] bg-white px-[16px] py-[24px] md:px-[24px]">
      <div>
        <h2 className="font-serif text-[28px] font-bold">สัดส่วนงบประมาณ</h2>
        <p className="text-[16px] font-bold">{props.subtitle}</p>
        <p className="text-text-01">
          ปีงบฯ {props.year} · {props.version}
        </p>
      </div>
      {props.baseSelect}
      <div className="flex flex-1 items-center justify-center">
        <DonutChart percentage={percentage} label={props.donutLabel} />
      </div>
      <div className="flex flex-col gap-[4px]">
        <p className="text-blue-70 flex gap-[8px]">
          <span title={props.selectedLabel}>
            {props.selectedLabelMaxLength
              ? truncateText(props.selectedLabel, props.selectedLabelMaxLength)
              : props.selectedLabel}
          </span>
          <span className="shrink-0 font-bold">
            {props.filteredBudget.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            บาท
          </span>
        </p>
        <p className="flex gap-[8px]">
          <span title={totalLabel}>
            {props.selectedLabelMaxLength
              ? truncateText(totalLabel, props.selectedLabelMaxLength)
              : totalLabel}
          </span>
          <span className="shrink-0 font-bold">
            {props.totalBudget.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            บาท
          </span>
        </p>
      </div>
    </div>
  );
}
