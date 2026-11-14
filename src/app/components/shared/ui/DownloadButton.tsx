"use client";

import { Button } from "@carbon/react";
import { Download } from "@carbon/icons-react";

interface DownloadButtonProps {
  text: string;
  // Renders a link when set, otherwise a button that calls onClick.
  href?: string;
  // Opens the link in a new tab, e.g. for a file hosted elsewhere.
  newTab?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  // Applies to the bordered wrapper, e.g. for alignment in a flex parent.
  className?: string;
}

// A ghost button in a 2px bordered frame; the hover fill covers the frame.
export default function DownloadButton({
  text,
  href,
  newTab = false,
  onClick,
  disabled = false,
  className = "",
}: DownloadButtonProps) {
  return (
    <div
      className={`border-ui-03 hover:bg-ui-03 w-fit shrink-0 border-[1px] bg-white p-[2px] ${className}`}
    >
      <Button
        kind="ghost"
        renderIcon={Download}
        href={href}
        target={href && newTab ? "_blank" : undefined}
        rel={href && newTab ? "noopener noreferrer" : undefined}
        onClick={onClick}
        disabled={disabled}
        className="min-h-0! justify-start gap-[4px] px-[12px]! py-[9px]! text-[14px] font-normal whitespace-nowrap [--cds-background-hover:transparent] [--cds-link-primary-hover:var(--color-blue-80)] [--cds-link-primary:var(--color-blue-60)] [&_.cds--btn__icon]:static"
      >
        {text}
      </Button>
    </div>
  );
}
