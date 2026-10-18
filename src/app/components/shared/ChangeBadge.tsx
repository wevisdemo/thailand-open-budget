import { getChangePercent } from "@/constants/organization";

interface ChangeBadgeProps {
  amount: number;
  previousAmount: number | null;
  // On a grey background: the grey "no change" and "no data" pill goes a
  // shade darker so it still shows.
  onLayer?: boolean;
}

export default function ChangeBadge({
  amount,
  previousAmount,
  onLayer = false,
}: ChangeBadgeProps) {
  const percent = getChangePercent(amount, previousAmount);
  const rounded = percent === null ? null : Number(percent.toFixed(1));

  if (rounded === null || rounded === 0) {
    return (
      <span
        className={`text-text-01 inline-flex rounded-full px-[8px] py-[2px] ${onLayer ? "bg-gray-30" : "bg-ui-03"}`}
      >
        {rounded === null ? "ไม่พบข้อมูล" : "เท่าเดิม"}
      </span>
    );
  }
  return (
    <span
      className={`text-text-01 inline-flex items-center gap-[4px] rounded-full px-[8px] py-[2px] ${rounded > 0 ? "bg-green-30" : "bg-red-30"}`}
    >
      <span aria-hidden className="text-[10px]">
        {rounded > 0 ? "▲" : "▼"}
      </span>
      <span className="sr-only">{rounded > 0 ? "เพิ่มขึ้น" : "ลดลง"}</span>
      {Math.abs(rounded).toFixed(1)}%
    </span>
  );
}
