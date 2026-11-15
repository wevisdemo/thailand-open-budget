"use client";

import { useReducer, useEffect } from "react";
import type { BudgetItem, PackedBudgetItems } from "@/types/budget";
import {
  type DocSourceValue,
  getDocSourceSheet,
  getFiscalYear,
} from "@/constants/budget";
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

// Loads one budget document's items, the whole country's, from the packed file
// `next build` writes (src/app/data/budget/[file]/route.ts). The ministry and
// budgetary pages don't use it: they load only their ministry's items.
export function useBudgetData(docSource: DocSourceValue | null) {
  const [{ data, status }, dispatch] = useReducer(reducer, {
    data: [],
    status: "idle",
  });

  useEffect(() => {
    if (!docSource) return;

    const fiscalYear = getFiscalYear(docSource);
    // A newer year may be requested before this file arrives; its response
    // must not overwrite the newer one.
    let ignore = false;
    dispatch({ type: "loading" });

    fetch(withBasePath(`/data/budget/${getDocSourceSheet(docSource)}.json`))
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json() as Promise<PackedBudgetItems>;
      })
      .then((packed) => {
        if (ignore) return;
        dispatch({
          type: "success",
          data: unpackBudgetItems(packed).filter(
            (item) => item.fiscal_year === fiscalYear,
          ),
        });
      })
      .catch(() => {
        if (!ignore) dispatch({ type: "error" });
      });

    return () => {
      ignore = true;
    };
  }, [docSource]);

  return { data, status };
}
