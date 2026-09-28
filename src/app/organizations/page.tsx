import { Suspense } from "react";
import type { Metadata } from "next";
import OrganizationsTemplate from "@/app/components/Organizations/OrganizationsTemplate";

export const metadata: Metadata = {
  title: "หน่วยงานทั้งหมด | Thailand Open Budget",
  description: "สำรวจงบประมาณแผ่นดินของทุกกระทรวงและหน่วยงานของประเทศไทย",
};

export default function OrganizationsPage() {
  return (
    <Suspense>
      <OrganizationsTemplate />
    </Suspense>
  );
}
