"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@carbon/react";
import { ChevronDown, ChevronUp } from "@carbon/icons-react";
import { parseCoreContent } from "@/constants/ministry";

// The collapsed panel shows at most four 24px lines and 400 characters.
const COLLAPSED_HEIGHT = 96;
const COLLAPSED_CHARS = 400;

interface CoreContentPanelProps {
  text: string;
}

export default function CoreContentPanel({ text }: CoreContentPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [tooTall, setTooTall] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // ดูเพิ่มเติม only shows when the text is longer than 400 characters or
  // taller than the collapsed height, which changes with the page width. A
  // hidden tab measures 0 and is measured again when it is shown.
  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;
    const observer = new ResizeObserver(() =>
      setTooTall(element.offsetHeight > COLLAPSED_HEIGHT),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const tooLong = text.length > COLLAPSED_CHARS;
  const overflows = tooLong || tooTall;
  const isClipped = overflows && !expanded;
  const block = parseCoreContent(
    tooLong && !expanded ? `${text.slice(0, COLLAPSED_CHARS)}…` : text,
  );

  return (
    <div className="flex flex-col gap-[8px]">
      <div
        className="relative overflow-hidden"
        style={isClipped ? { maxHeight: COLLAPSED_HEIGHT } : undefined}
      >
        <div ref={contentRef} className="text-[14px] leading-[24px]">
          {block.kind === "list" ? (
            <ol className="list-decimal pl-[24px]">
              {block.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          ) : (
            <p className="whitespace-pre-line">{block.text}</p>
          )}
        </div>
        {isClipped && (
          <div className="absolute inset-x-0 bottom-0 h-[32px] bg-gradient-to-t from-white" />
        )}
      </div>
      {overflows && (
        <Button
          kind="ghost"
          size="sm"
          renderIcon={expanded ? ChevronUp : ChevronDown}
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className="self-center font-medium"
        >
          {expanded ? "ย่อ" : "ดูเพิ่มเติม"}
        </Button>
      )}
    </div>
  );
}
