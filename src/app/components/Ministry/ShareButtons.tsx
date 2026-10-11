"use client";

import { useEffect, useState } from "react";
import LinkIcon from "@/app/components/shared/icons/link-icon";
import FacebookFIcon from "@/app/components/shared/icons/facebook-f-icon";
import XIcon from "@/app/components/shared/icons/x-icon";

const BUTTON_CLASS =
  "border-ui-05 flex h-[28px] w-[28px] items-center justify-center rounded-full border hover:cursor-pointer";

interface ShareButtonsProps {
  title: string;
}

export default function ShareButtons({ title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  // The URL is read on click, not render: the year in its query string can
  // change while the page is open.
  function handleCopyLink() {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => setCopied(true));
  }

  function handleShare(shareUrl: (url: string) => string) {
    window.open(
      shareUrl(encodeURIComponent(window.location.href)),
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <div className="flex items-center gap-[8px]">
      <span className="text-[14px] font-bold">แชร์หน้านี้</span>
      <button
        onClick={handleCopyLink}
        aria-label="คัดลอกลิงก์"
        className={BUTTON_CLASS}
      >
        <LinkIcon />
      </button>
      <button
        onClick={() =>
          handleShare(
            (url) => `https://www.facebook.com/sharer/sharer.php?u=${url}`,
          )
        }
        aria-label="แชร์ไปยัง Facebook"
        className={BUTTON_CLASS}
      >
        <FacebookFIcon />
      </button>
      <button
        onClick={() =>
          handleShare(
            (url) =>
              `https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(title)}`,
          )
        }
        aria-label="แชร์ไปยัง X"
        className={BUTTON_CLASS}
      >
        <XIcon />
      </button>
      <span role="status" className="text-text-02 text-[12px]">
        {copied ? "คัดลอกลิงก์แล้ว" : ""}
      </span>
    </div>
  );
}
