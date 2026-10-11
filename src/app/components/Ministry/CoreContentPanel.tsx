"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@carbon/react";
import { ChevronDown, ChevronUp } from "@carbon/icons-react";
import { parseCoreContent } from "@/constants/ministry";

// Height of the collapsed panel: five 24px lines.
const COLLAPSED_HEIGHT = 120;

interface CoreContentPanelProps {
  text: string;
}

export default function CoreContentPanel({ text }: CoreContentPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // ดูเพิ่มเติม only shows when the text is taller than the collapsed height,
  // which changes with the page width. A hidden tab measures 0 and is
  // measured again when it is shown.
  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;
    const observer = new ResizeObserver(() =>
      setOverflows(element.offsetHeight > COLLAPSED_HEIGHT),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const block = parseCoreContent(text);
  const isClipped = overflows && !expanded;

  return (
    <div className="flex flex-col gap-[8px]">
      <div
        className="relative overflow-hidden"
        style={isClipped ? { maxHeight: COLLAPSED_HEIGHT } : undefined}
      >
        <div ref={contentRef} className="text-[16px] leading-[24px]">
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
          {expanded ? "ย่อลง" : "ดูเพิ่มเติม"}
        </Button>
      )}
    </div>
  );
}
