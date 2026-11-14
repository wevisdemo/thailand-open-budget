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

  // The page behind the overlay doesn't scroll while the modal is open.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

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
        {/* Only the close button stays put; the title scrolls with the body. */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-[20px] right-[16px] z-10 p-[4px] hover:cursor-pointer"
        >
          <Image
            src={withBasePath("/icons/cross.svg")}
            width={10}
            height={10}
            alt="ปิด"
          />
        </button>
        <div className="min-h-0 overflow-y-auto">
          <h2 className="mb-[16px] pr-[32px] text-[20px] font-bold">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}
