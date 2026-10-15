import Modal from "@/app/components/shared/Modal";

interface CategoryInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: { name: string; description: string }[] = [
  {
    name: "งบบุคลากร",
    description:
      "รายจ่ายบริหารงานบุคคล เช่น เงินเดือน ค่าจ้างประจำ ค่าจ้างชั่วคราว ค่าตอบแทนพนักงานราชการ",
  },
  {
    name: "งบดำเนินงาน",
    description:
      "รายจ่ายบริหารงานประจำ เช่น ค่าตอบแทน ใช้สอย วัสดุ และสาธารณูปโภค",
  },
  {
    name: "งบลงทุน",
    description: "รายจ่ายเพื่อการลงทุน เช่น ค่าครุภัณฑ์ ที่ดิน สิ่งก่อสร้าง",
  },
  {
    name: "งบเงินอุดหนุน",
    description:
      "รายจ่ายที่จัดสรรให้หน่วยงานรัฐบางประเภท เช่น หน่วยงานที่ไม่ใช่ราชการส่วนกลาง องค์การมหาชน รัฐวิสาหกิจ องค์กรปกครองส่วนท้องถิ่น เป็นต้น",
  },
  {
    name: "งบรายจ่ายอื่น",
    description:
      "ประเภทงบที่ไม่ถูกจัดอยู่ใน 4 ประเภทก่อนหน้า หรือสำนักงบประมาณกำหนดให้ใช้จ่าย จากงบประเภทนี้",
  },
];

// "ประเภทงบคืออะไร?": the five budget categories.
export default function CategoryInfoModal({
  isOpen,
  onClose,
}: CategoryInfoModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ประเภทงบ">
      <div className="px-[16px] text-[14px] leading-[22px]">
        <ul className="flex list-disc flex-col gap-[4px] pl-[20px]">
          {CATEGORIES.map(({ name, description }) => (
            <li key={name}>
              <strong>{name} :</strong> {description}
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}
