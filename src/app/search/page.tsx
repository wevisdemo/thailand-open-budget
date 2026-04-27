import type { Metadata } from "next";
import type { BudgetItem, BudgetMinistryItem } from "@/types/budget";
import SearchTemplate from "@/app/components/Search/SearchTemplate";

export const metadata: Metadata = {
  title: "ค้นหางบประมาณ | Thailand Open Budget",
  description: "ค้นหาและสำรวจข้อมูลงบประมาณแผ่นดินของประเทศไทย",
};

const headerSummaryInfo = {
  itemAmount: 124500,
  totalBudget: 348000,
  totalDepartment: 20,
};

const budgetData: BudgetItem[] = [
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

const ministryData: BudgetMinistryItem[] = [
  {
    id: "1",
    ministry: "กรมทางหลวงชนบท",
    amount: 8787120000,
    budgetary: "กระทรวงคมนาคม",
    budgetPercentage: 33.3,
  },
  {
    id: "2",
    ministry: "กรมทางหลวงชนบท",
    amount: 8787120000,
    budgetary: "กระทรวงคมนาคม",
    budgetPercentage: 33.3,
  },
  {
    id: "3",
    ministry: "กรมทางหลวงชนบท",
    amount: 8787120000,
    budgetary: "กระทรวงคมนาคม",
    budgetPercentage: 33.3,
  },
];

export default function SearchPage() {
  return (
    <SearchTemplate
      headerSummaryInfo={headerSummaryInfo}
      budgetData={budgetData}
      ministryData={ministryData}
    />
  );
}
