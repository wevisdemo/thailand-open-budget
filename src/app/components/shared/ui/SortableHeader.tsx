"use client";

import Image from "next/image";
import { withBasePath } from "@/lib/base-path";
import type { BudgetSort, BudgetSortKey } from "@/types/budget";
import ArrowsVerticalIcon from "@/app/components/shared/icons/arrows-vertical-icon";

interface SortableHeaderProps {
  label: string;
  widthClassName: string;
  sortKey: BudgetSortKey;
  sort: BudgetSort | null;
  onSortChange: (key: BudgetSortKey) => void;
  align?: "left" | "right";
  children?: React.ReactNode;
}

export default function SortableHeader({
  label,
  widthClassName,
  sortKey,
  sort,
  onSortChange,
  align = "left",
  children,
}: SortableHeaderProps) {
  const isActive = sort?.key === sortKey;
  return (
    <th
      className={`${widthClassName} px-[16px] py-[8px] font-semibold hover:cursor-pointer hover:bg-[#CACACA] ${align === "right" ? "text-right" : "text-left"}`}
      onClick={() => onSortChange(sortKey)}
    >
      <span
        className={`flex items-center gap-[8px] ${align === "right" ? "justify-end" : ""}`}
      >
        {label}
        {children}
        {isActive ? (
          <Image
            src={withBasePath("/icons/arrow-down.svg")}
            alt=""
            width={16}
            height={16}
            className={`shrink-0 ${sort.dir === "desc" ? "rotate-180" : ""}`}
          />
        ) : (
          <ArrowsVerticalIcon className="shrink-0" />
        )}
      </span>
    </th>
  );
}
