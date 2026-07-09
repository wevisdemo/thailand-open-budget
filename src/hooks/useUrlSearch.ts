"use client";

import { useSyncExternalStore } from "react";

// In a static export the App Router reuses cached page instances, so
// `useSearchParams()` can hand back a STALE query string after a soft
// navigation. That stale value defeats every URL-driven reset in the app.
//
// This store instead reads the address bar directly (the single source of
// truth) and re-renders on any URL change: browser back/forward (`popstate`),
// bfcache restore (`pageshow`), and client navigations (which go through
// `history.pushState` / `replaceState`, patched below to emit an event).

const listeners = new Set<() => void>();
let patched = false;

function emit() {
  for (const listener of listeners) listener();
}

function patchHistory() {
  if (patched || typeof window === "undefined") return;
  patched = true;

  for (const method of ["pushState", "replaceState"] as const) {
    const original = window.history[method].bind(window.history);
    window.history[method] = function patchedHistoryMethod(
      ...args: Parameters<History["pushState"]>
    ) {
      const result = original(...args);
      emit();
      return result;
    };
  }

  window.addEventListener("popstate", emit);
  window.addEventListener("pageshow", emit);
}

function subscribe(onStoreChange: () => void) {
  patchHistory();
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

function getSnapshot() {
  return window.location.search;
}

function getServerSnapshot() {
  return "";
}

// Reactive, always-fresh `window.location.search` (e.g. `?q=foo&budget_source=2570-draft-1`).
export function useUrlSearch(): string {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
