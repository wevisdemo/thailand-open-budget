"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Tracks whether a scroll container still has content below the fold, so the
// caller can show a fade hint. Attach `scrollRef` and `onScroll` to the
// container; the hook re-checks whenever the container or its content resizes.
// `active` gates the observer (e.g. only while a modal is open).
export function useCanScrollDown(active: boolean) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!active || !el) return;
    onScroll();
    const observer = new ResizeObserver(onScroll);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    return () => observer.disconnect();
  }, [active, onScroll]);

  return { scrollRef, canScrollDown, onScroll };
}
