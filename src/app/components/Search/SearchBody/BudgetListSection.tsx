import { useState } from "react";
import BudgetListTable from "./BudgetListTable";
import { BudgetItem } from "@/types/budget";

interface SearchBudgetProportionProps {
  keywords: string[];
  data: BudgetItem[];
  year: number;
  version: string;
}

export default function BudgetListSection(props: SearchBudgetProportionProps) {
  const [sortPolicy, setSortPolicy] = useState<"asc" | "desc">("desc");
  return (
    <div>
      <div>
        <h2 className="font-serif text-[28px] font-bold">รายการงบประมาณ</h2>
        <p className="text-[16px] font-bold">
          ที่เกี่ยวข้องกับ &apos;{props.keywords.join(", ")}&apos;
        </p>
        <p className="text-text-01">
          <span className="text-blue-70">
            พบทั้งหมด {props.data.length.toLocaleString()} รายการ
          </span>{" "}
          <span>
            ปีงบฯ {props.year} · {props.version}
          </span>{" "}
          <span className="text-gray-60">
            {sortPolicy ? "เรียงจากมากไปน้อย" : "เรียงจากน้อยไปมาก"}
          </span>
        </p>
      </div>
      <div>
        <BudgetListTable keywords={props.keywords} data={props.data} />
      </div>
    </div>
  );
}
