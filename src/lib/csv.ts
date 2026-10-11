// Downloads a table as a CSV file. Every cell is quoted, and the file starts
// with a byte-order mark so Excel reads the Thai text as UTF-8.
export function downloadCsv(
  headers: string[],
  rows: (string | number)[][],
  fileName: string,
) {
  const csv = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
