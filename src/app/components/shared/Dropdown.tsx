"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import DownAngleIcon from "@/app/components/shared/icons/down-angle-icon";

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  selectedOption: DropdownOption | null;
  onChange: (value: DropdownOption) => void;
  placeholder?: string;
  footerLink?: { label: string; href?: string; onClick?: () => void };
}

export default function Dropdown({
  options,
  selectedOption: value,
  onChange,
  placeholder = "Choose an option",
  footerLink,
}: DropdownProps) {
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

  const selectedLabel = value?.label ?? null;

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="bg-field-01 flex w-full items-center justify-between px-[16px] py-[14px] shadow-[0_2px_4px_rgba(0,0,0,0.16)]"
      >
        <span className={selectedLabel ? "text-text-01" : "text-text-02"}>
          {selectedLabel ?? placeholder}
        </span>
        <DownAngleIcon
          className={
            open ? "rotate-180 transition-transform" : "transition-transform"
          }
        />
      </button>

      {open && (
        <div className="border-ui-03 absolute right-0 left-0 z-10 border bg-white shadow-[0_2px_4px_rgba(0,0,0,0.16)]">
          <ul>
            {options.map((option, i) => (
              <li key={option.value}>
                {i > 0 && <div className="border-ui-03 border-t" />}
                <button
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className="hover:bg-ui-01 text-text-01 flex w-full items-center justify-between px-[16px] py-[14px] text-left"
                >
                  {option.label}
                  {value?.value === option.value && (
                    <Image
                      src="/icons/checkmark.svg"
                      width={16}
                      height={16}
                      alt=""
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>

          {footerLink && (
            <>
              <div className="border-ui-03 border-t" />
              <div className="px-[16px] py-[14px]">
                {footerLink.href ? (
                  <Link
                    href={footerLink.href}
                    className="text-link-01 underline"
                  >
                    {footerLink.label}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={footerLink.onClick}
                    className="text-link-01 cursor-pointer underline"
                  >
                    {footerLink.label}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
