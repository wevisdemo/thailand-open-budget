import { Suspense } from "react";
import type { Metadata } from "next";

import AboutTemplate from "../components/Aboutpage/AboutTemplate";

export const metadata: Metadata = {
  title: "เกี่ยวกับเรา | Thailand Open Budget",
  description: "เกี่ยวกับเรา",
};

export default function SearchPage() {
  return (
    <Suspense>
      <AboutTemplate />
    </Suspense>
  );
}
