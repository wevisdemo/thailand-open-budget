import SummaryInfoStatItem from "./SummaryInfoStatItem";
import ExclamationIcon from "@/app/components/shared/icons/exclamation-icon";

interface SummaryInfoProps {
  itemAmount: number;
  totalBudgetAmount: number;
  totalMinistry: number;
}

export default function SummaryInfo({
  itemAmount,
  totalBudgetAmount,
  totalMinistry,
}: SummaryInfoProps) {
  return (
    <div className="content-container flex flex-col gap-[24px] bg-white md:gap-[8px]">
      <div className="divide-ui-03 flex flex-col justify-between md:flex-row">
        <SummaryInfoStatItem
          label="จำนวนโครงการ/ผลผลิต"
          value={`${itemAmount.toLocaleString()}+`}
          unit="รายการ"
        />
        <SummaryInfoStatItem
          label="งบประมาณทั้งหมด (ปีงบฯ 2569)"
          value={totalBudgetAmount.toLocaleString()}
          unit="ล้านบาท"
        />
        <SummaryInfoStatItem
          label="หน่วยงานที่ได้รับงบประมาณ"
          value={totalMinistry.toLocaleString()}
          unit="หน่วยงาน"
        />
      </div>
      <div className="border-interactive-01 flex gap-[12px] border border-l-[3px] bg-[#eef2ff] px-[8px] py-[16px] md:px-[20px]">
        <ExclamationIcon className="mt-[2px] shrink-0" />
        <p className="text-text-01 text-[14px]">
          <span className="font-bold">ข้อควรระวัง:</span>{" "}
          คีย์เวิร์ดบางคำอาจมีได้มากกว่าหนึ่งความหมาย (เช่น
          เป็นได้ทั้งชื่อสิ่งของหรือชื่อสถานที่)
          จึงควรตรวจสอบบริบทที่ปรากฏคำดังกล่าว ก่อนนำผลลัพธ์ไปใช้หรือสื่อสาร
        </p>
      </div>
    </div>
  );
}
