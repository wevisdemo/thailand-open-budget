import SearchDonutChart from "./SearchDonutChart";

interface SearchBudgetProportionProps {
  keywords: string[];
  filteredBudget: number;
  totalBudget: number;
}

export default function SearchBudgetProportion(
  props: SearchBudgetProportionProps,
) {
  const percentage =
    props.totalBudget > 0
      ? (props.filteredBudget / props.totalBudget) * 100
      : 0;

  return (
    <div className="flex w-full flex-col gap-[16px] bg-white px-[16px] py-[24px] md:px-[24px]">
      <div>
        <h2 className="font-serif text-[28px] font-bold">สัดส่วนงบประมาณ</h2>
        <p className="text-[16px] font-bold">
          ที่เกี่ยวข้องกับ &apos;{props.keywords.join(", ")}&apos; เทียบกับงบฯ
          ประเทศ
        </p>
        <p className="text-text-01">ปีงบฯ 2569 · ฉบับร่าง</p>
      </div>
      <div className="mt-[24px]">
        <SearchDonutChart percentage={percentage} />
      </div>
      <div className="flex flex-col gap-[4px]">
        <p className="text-blue-70">
          งบฯ ที่เกี่ยวข้องกับคีย์เวิร์ด{" "}
          <span className="font-bold">
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
