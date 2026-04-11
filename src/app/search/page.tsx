import type { Metadata } from "next";
import type { BudgetItem } from "@/types/budget";

export const metadata: Metadata = {
  title: "ค้นหางบประมาณ | Thailand Open Budget",
  description: "ค้นหาและสำรวจข้อมูลงบประมาณแผ่นดินของประเทศไทย",
};

export default function SearchPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-12">
      <div className="flex flex-col gap-2"></div>
    </main>
  );
}
