"use client";

import { useEffect, useRef, useState } from "react";
import DownAngleIcon from "@/app/components/shared/icons/down-angle-icon";
import ChevronLeftIcon from "@/app/components/shared/icons/chevron-left-icon";

interface PaginateProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onChange: (page: number) => void;
}

function PageDropdown({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-[40px] items-center gap-[8px] border-0 px-[16px]"
      >
        {page}
        <DownAngleIcon
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+4px)] right-0 z-10 rounded-[4px] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.16)]">
          <ul className="max-h-[240px] overflow-y-auto">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <li key={p}>
                <button
                  onClick={() => {
                    onChange(p);
                    setOpen(false);
                  }}
                  className={`border-ui-03 hover:bg-ui-01 w-full border-b px-[16px] py-[12px] text-left text-[14px] ${p === page ? "font-bold" : ""}`}
                >
                  {p}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function Paginate({
  page,
  totalPages,
  totalItems,
  pageSize,
  onChange,
}: PaginateProps) {
  const startIndex = (page - 1) * pageSize;

  return (
    <div className="border-ui-03 flex items-center justify-between border-t px-[16px] py-[12px] text-[14px]">
      <p>
        {startIndex + 1} – {Math.min(startIndex + pageSize, totalItems)} จาก{" "}
        <span className="font-bold">{totalItems.toLocaleString()}</span> รายการ
      </p>
      <div className="flex items-center gap-[8px]">
        <div className="flex items-center gap-[8px]">
          <PageDropdown
            page={page}
            totalPages={totalPages}
            onChange={onChange}
          />
          <span>จาก {totalPages} หน้า</span>
        </div>
        <div className="flex">
          <button
            onClick={() => onChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="flex h-[40px] w-[40px] items-center justify-center border-none bg-[#ededed] disabled:opacity-30"
          >
            <ChevronLeftIcon />
          </button>
          <button
            onClick={() => onChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="flex h-[40px] w-[40px] rotate-180 items-center justify-center border-none bg-[#ededed] disabled:opacity-30"
          >
            <ChevronLeftIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
