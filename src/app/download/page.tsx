import { Suspense } from "react";
import type { Metadata } from "next";

import DownloadTemplate from "../components/DownloadPage/DownloadTemplate";

export const metadata: Metadata = {
  title: "ดาวน์โหลด | Thailand Open Budget",
  description: "ดาวน์โหลด",
};

export default function DownloadPage() {
  return (
    <Suspense>
      <DownloadTemplate />
    </Suspense>
  );
}
