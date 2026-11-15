"use client";

import { useReducer, useEffect } from "react";
import type { BudgetItem, PackedBudgetItems } from "@/types/budget";
import { type DocSourceValue, getDocSourceSheet } from "@/constants/budget";
import { withBasePath } from "@/lib/base-path";
import { unpackBudgetItems } from "@/lib/packed-budget-items";

type Status = "idle" | "loading" | "success" | "error";

interface State {
  data: BudgetItem[];
  status: Status;
}

type Action =
  | { type: "loading" }
  | { type: "success"; data: BudgetItem[] }
  | { type: "error" };

function reducer(_state: State, action: Action): State {
  switch (action.type) {
    case "loading":
      return { data: [], status: "loading" };
    case "success":
      return { data: action.data, status: "success" };
    case "error":
      return { data: [], status: "error" };
  }
}

// Loads one ministry's items in a document, for the ministry and budgetary
// pages' item tables. The file is written by `next build`
// (src/app/data/budget_by_ministry/[sheet]/[file]/route.ts).
export function useMinistryItems(
  docSource: DocSourceValue,
  ministryId: number,
) {
  const [{ data, status }, dispatch] = useReducer(reducer, {
    data: [],
    status: "idle",
  });

  useEffect(() => {
    // A newer year may be requested before this file arrives; its response
    // must not overwrite the newer one.
    let ignore = false;
    dispatch({ type: "loading" });

    const sheet = getDocSourceSheet(docSource);
    fetch(withBasePath(`/data/budget_by_ministry/${sheet}/${ministryId}.json`))
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json() as Promise<PackedBudgetItems>;
      })
      .then((packed) => {
        if (!ignore) {
          dispatch({ type: "success", data: unpackBudgetItems(packed) });
        }
      })
      .catch(() => {
        if (!ignore) dispatch({ type: "error" });
      });

    return () => {
      ignore = true;
    };
  }, [docSource, ministryId]);

  return { data, status };
}
