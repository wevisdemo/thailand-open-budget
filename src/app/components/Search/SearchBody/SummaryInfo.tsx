import SummaryStatItem from "@/app/components/shared/SummaryStatItem";

interface SummaryInfoProps {
  itemAmount: number;
  totalBudgetAmount: number;
  totalBudgetary: number;
  year: number;
}

export default function SummaryInfo({
  itemAmount,
  totalBudgetAmount,
  totalBudgetary,
  year,
}: SummaryInfoProps) {
  return (
    <div className="content-container flex flex-col gap-[24px] bg-white md:gap-[8px]">
      <div className="divide-ui-03 flex flex-col justify-between md:flex-row">
        <SummaryStatItem
          label="จำนวนรายการ"
          value={`${itemAmount.toLocaleString()}`}
          unit="รายการ"
        />
        <SummaryStatItem
          label={`งบประมาณทั้งหมด (ปีงบฯ ${year})`}
          value={totalBudgetAmount.toLocaleString()}
          unit="ล้านบาท"
        />
        <SummaryStatItem
          label="หน่วยงานที่ได้รับงบประมาณ"
          value={totalBudgetary.toLocaleString()}
          unit="หน่วยงาน"
        />
      </div>
    </div>
  );
}
