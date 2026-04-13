"use client";

import { useState } from "react";
import type { BudgetItem } from "@/types/budget";
import SearchBudgetProportion from "./SearchBudgetProportion";
import SearchBudgetTrend from "./SearchBudgetTrend";
import BudgetListSection from "./BudgetListSection";

const mockBudgetData: BudgetItem[] = [
  {
    id: "1",
    description: "เงินเดือน",
    ministry: "กระทรวงวัฒนธรรม",
    budgetary: "สำนักงานปลัดกระทรวงวัฒนธรรม",
    plan: "แผนงานบุคลากรภาครัฐ",
    project: "",
    category: "งบบุคลากร",
    amount: 854393700,
    year: 2026,
  },
  {
    id: "2",
    description: "ค่าตอบแทนพนักงานราชการ",
    ministry: "กระทรวงวัฒนธรรม",
    budgetary: "สำนักงานปลัดกระทรวงวัฒนธรรม",
    plan: "แผนงานบุคลากรภาครัฐ",
    project: "",
    category: "งบบุคลากร",
    amount: 165082900,
    year: 2026,
  },
  {
    id: "3",
    description: "ค่าเช่าบ้าน",
    ministry: "กระทรวงวัฒนธรรม",
    budgetary: "สำนักงานปลัดกระทรวงวัฒนธรรม",
    plan: "แผนงานบุคลากรภาครัฐ",
    project: "",
    category: "งบดำเนินงาน",
    amount: 58158500,
    year: 2026,
  },
  {
    id: "4",
    description: "ค่าใช้จ่ายในการจัดแสดงนิทรรศการศิลปะ ณ หอศิลป์แห่งชาติ",
    ministry: "กระทรวงวัฒนธรรม",
    budgetary: "สำนักงานปลัดกระทรวงวัฒนธรรม",
    plan: "แผนงานยุทธศาสตร์การขับเคลื่อนนโยบายซอฟต์พาวเวอร์",
    project: "โครงการส่งเสริมสนับสนุนวัฒนธรรมสร้างสรรค์",
    category: "งบรายจ่ายอื่น",
    amount: 107075000,
    year: 2026,
  },
  {
    id: "5",
    description: "ค่าใช้จ่ายในการยกระดับสินค้าและบริการทางวัฒนธรรมสู่สากล",
    ministry: "กระทรวงวัฒนธรรม",
    budgetary: "สำนักงานปลัดกระทรวงวัฒนธรรม",
    plan: "แผนงานยุทธศาสตร์เพื่อสนับสนุนด้านการสร้างความสามารถในการแข่งขัน",
    project:
      "โครงการส่งเสริม สนับสนุน และพัฒนาศักยภาพอุตสาหกรรมวัฒนธรรมไทยสู่สากล",
    category: "งบรายจ่ายอื่น",
    amount: 18752600,
    year: 2026,
  },
  {
    id: "6",
    description: "เงินอุดหนุนสนับสนุนการจัดกิจกรรมด้านภาพยนตร์และวีดิทัศน์",
    ministry: "กระทรวงวัฒนธรรม",
    budgetary: "สำนักงานปลัดกระทรวงวัฒนธรรม",
    plan: "แผนงานยุทธศาสตร์เพื่อสนับสนุนด้านการสร้างความสามารถในการแข่งขัน",
    project: "โครงการเพิ่มมูลค่าทางเศรษฐกิจด้วยทุนทางวัฒนธรรม",
    category: "งบเงินอุดหนุน",
    amount: 2000000,
    year: 2026,
  },
  {
    id: "7",
    description: "เงินอุดหนุนสนับสนุนงานมหกรรมผ้าไหม สู่เส้นทางโลก",
    ministry: "กระทรวงวัฒนธรรม",
    budgetary: "สำนักงานปลัดกระทรวงวัฒนธรรม",
    plan: "แผนงานยุทธศาสตร์เพื่อสนับสนุนด้านการสร้างความสามารถในการแข่งขัน",
    project: "โครงการเพิ่มมูลค่าทางเศรษฐกิจด้วยทุนทางวัฒนธรรม",
    category: "งบเงินอุดหนุน",
    amount: 27550000,
    year: 2026,
  },
  {
    id: "8",
    description: "ค่าใช้จ่ายในการจัดมหกรรมวัฒนธรรมแห่งชาติ วิถีถิ่น วิถีไทย",
    ministry: "กระทรวงวัฒนธรรม",
    budgetary: "สำนักงานปลัดกระทรวงวัฒนธรรม",
    plan: "แผนงานยุทธศาสตร์เพื่อสนับสนุนด้านการสร้างความสามารถในการแข่งขัน",
    project: "โครงการเพิ่มมูลค่าทางเศรษฐกิจด้วยทุนทางวัฒนธรรม",
    category: "งบรายจ่ายอื่น",
    amount: 10000000,
    year: 2026,
  },
];

export default function SearchBody() {
  const [keywords, _setKeywords] = useState<string[]>([
    "น้ำท่วม",
    "ค่าใช้จ่าย",
  ]);

  return (
    <div className="content-container flex flex-col gap-[24px]">
      <div className="flex flex-col gap-[32px] md:flex-row">
        <SearchBudgetProportion
          keywords={keywords}
          filteredBudget={1000000}
          totalBudget={4000000}
        />
        <SearchBudgetTrend
          keywords={keywords}
          filteredBudget={1000000}
          totalBudget={4000000}
        />
      </div>
      <div>
        <BudgetListSection
          keywords={keywords}
          year={2569}
          version="ฉบับร่าง"
          data={mockBudgetData}
        />
      </div>
    </div>
  );
}
