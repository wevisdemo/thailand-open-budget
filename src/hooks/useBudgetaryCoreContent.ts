"use client";

import { useReducer, useEffect } from "react";
import type { OrganizationCoreContent } from "@/types/organization";
import { withBasePath } from "@/lib/base-path";

type Status = "idle" | "loading" | "success" | "error";

interface State {
  data: OrganizationCoreContent | null;
  status: Status;
}

type Action =
  | { type: "loading" }
  | { type: "success"; data: OrganizationCoreContent | null }
  | { type: "error" };

function reducer(_state: State, action: Action): State {
  switch (action.type) {
    case "loading":
      return { data: null, status: "loading" };
    case "success":
      return { data: action.data, status: "success" };
    case "error":
      return { data: null, status: "error" };
  }
}

// The file holds every unit's content, so it is fetched once and shared by
// every budgetary page the reader opens.
let request: Promise<Record<string, OrganizationCoreContent>> | null = null;

function fetchCoreContent() {
  request ??= fetch(withBasePath("/data/budgetary_core_content.json")).then(
    (res) => {
      if (!res.ok) throw new Error(`${res.status}`);
      return res.json() as Promise<Record<string, OrganizationCoreContent>>;
    },
  );
  // A failed request is not kept, so the next page can try again.
  request.catch(() => {
    request = null;
  });
  return request;
}

// Loads a budgetary unit's vision, mission and objectives. Null when the
// sheet has nothing for the unit.
export function useBudgetaryCoreContent(budgetaryId: number) {
  const [{ data, status }, dispatch] = useReducer(reducer, {
    data: null,
    status: "idle",
  });

  useEffect(() => {
    let ignore = false;
    dispatch({ type: "loading" });

    fetchCoreContent()
      .then((content) => {
        if (!ignore) {
          dispatch({ type: "success", data: content[budgetaryId] ?? null });
        }
      })
      .catch(() => {
        if (!ignore) dispatch({ type: "error" });
      });

    return () => {
      ignore = true;
    };
  }, [budgetaryId]);

  return { data, status };
}
