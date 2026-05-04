import BudgetListTable from "./BudgetListTable";
import type { BudgetItem } from "@/types/budget";
import type { Tag } from "@/types/search";

interface SearchBudgetProportionProps {
  tags: Tag[];
  data: BudgetItem[];
  year: number;
  version: string;
}

export default function BudgetListSection(props: SearchBudgetProportionProps) {
  return (
    <div>
      <div>
        <h2 className="font-serif text-[28px] font-bold">รายการงบประมาณ</h2>
        <p className="text-[16px] font-bold">
          ที่เกี่ยวข้องกับ &apos;{props.tags.map((t) => t.word).join(", ")}
          &apos;
        </p>
        <p className="text-text-01">
          <span className="text-blue-70">
            พบทั้งหมด {props.data.length.toLocaleString()} รายการ
          </span>{" "}
          <span>
            ปีงบฯ {props.year} · {props.version}
          </span>{" "}
          <span className="text-gray-60">เรียงจากมากไปน้อย</span>
        </p>
      </div>
      <div>
        <BudgetListTable tags={props.tags} data={props.data} />
      </div>
    </div>
  );
}
