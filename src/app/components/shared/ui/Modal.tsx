"use client";

import Image from "next/image";
import { useEffect } from "react";
import { withBasePath } from "@/lib/base-path";

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
        className="relative flex max-h-[min(90vh,400px)] w-[90vw] max-w-[450px] flex-col bg-white p-[16px]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="mb-[16px] flex shrink-0 items-start justify-between gap-[16px]">
          <h2 className="text-[20px] font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="mt-[4px] shrink-0 p-[4px] hover:cursor-pointer"
          >
            <Image
              src={withBasePath("/icons/cross.svg")}
              width={10}
              height={10}
              alt="ปิด"
            />
          </button>
        </div>
        {/* The title stays put; a long body scrolls inside the card. */}
        <div className="min-h-0 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
