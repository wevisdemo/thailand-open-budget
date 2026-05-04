"use client";

import Image from "next/image";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onMouseDown={onClose}
    >
      <div
        className="relative w-full max-w-[540px] bg-white p-[16px]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="mb-[24px] flex items-start justify-between gap-[16px]">
          <h2 className="text-[20px] font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="mt-[4px] shrink-0 hover:cursor-pointer"
          >
            <Image src="/icons/cross.svg" width={10} height={10} alt="ปิด" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
