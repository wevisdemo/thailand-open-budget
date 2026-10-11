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
  year: number;
  version: string;
}

export default function BudgetProportionCard(props: BudgetProportionCardProps) {
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
      <div className="flex flex-1 items-center justify-center">
        <DonutChart percentage={percentage} />
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
        <p>
          งบฯ ทั้งประเทศ{" "}
          <span className="font-bold">
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
