"use client";

import { useReducer, useEffect } from "react";
import type { BudgetItem } from "@/types/budget";
import {
  type DocSourceValue,
  DOC_SOURCE_DATA_FILE,
  getFiscalYear,
} from "@/constants/budget";
import { withBasePath } from "@/lib/base-path";

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

// Loads one budget document's items. With a ministry id it loads only that
// ministry's, from the per-ministry split written at build time
// (scripts/split-budget-by-ministry.mjs), instead of the whole country's.
export function useBudgetData(
  docSource: DocSourceValue | null,
  ministryId: number | null = null,
) {
  const [{ data, status }, dispatch] = useReducer(reducer, {
    data: [],
    status: "idle",
  });

  useEffect(() => {
    if (!docSource) return;

    const fileName = DOC_SOURCE_DATA_FILE[docSource];
    const fiscalYear = getFiscalYear(docSource);
    // A newer year may be requested before this file arrives; its response
    // must not overwrite the newer one.
    let ignore = false;
    dispatch({ type: "loading" });

    const path =
      ministryId === null
        ? `/data/${fileName}.json`
        : `/data/budget_by_ministry/${fileName.replace(/^budget_/, "")}/${ministryId}.json`;

    fetch(withBasePath(path))
      .then((res) => {
        // A ministry with no items in a document has no file for it.
        if (ministryId !== null && res.status === 404) return [];
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json() as Promise<BudgetItem[]>;
      })
      .then((data) => {
        if (ignore) return;
        dispatch({
          type: "success",
          data: data.filter((item) => item.fiscal_year === fiscalYear),
        });
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
