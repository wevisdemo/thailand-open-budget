interface SearchHeaderStatItemProps {
  label: string;
  value: string;
  unit: string;
}

export default function SearchHeaderStatItem({
  label,
  value,
  unit,
}: SearchHeaderStatItemProps) {
  return (
    <div className="border-ui-03 flex w-full flex-col items-center gap-[4px] border-b-[1px] py-[8px] text-center md:items-start md:border-r-[1px] md:border-b-0 md:px-[24p] md:py-[16px]">
      <span className="text-gray-60 text-b6">{label}</span>
      <span className="text-[28px] leading-none font-bold">{value}</span>
      <span className="text-gray-70 text-b5">{unit}</span>
    </div>
  );
}
