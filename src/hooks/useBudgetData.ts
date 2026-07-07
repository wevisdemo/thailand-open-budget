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

export function useBudgetData(docSource: DocSourceValue | null) {
  const [{ data, status }, dispatch] = useReducer(reducer, {
    data: [],
    status: "idle",
  });

  useEffect(() => {
    if (!docSource) return;

    const fileName = DOC_SOURCE_DATA_FILE[docSource];
    const fiscalYear = getFiscalYear(docSource);
    dispatch({ type: "loading" });

    fetch(withBasePath(`/data/${fileName}.json`))
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json() as Promise<BudgetItem[]>;
      })
      .then((data) =>
        dispatch({
          type: "success",
          data: data.filter((item) => item.fiscal_year === fiscalYear),
        }),
      )
      .catch(() => dispatch({ type: "error" }));
  }, [docSource]);

  return { data, status };
}
