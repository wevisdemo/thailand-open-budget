import Modal from "@/app/components/shared/ui/Modal";

interface PlanInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PLAN_TYPES: { name: string; description: string }[] = [
  {
    name: "แผนงานพื้นฐาน",
    description:
      "รวมผลผลิต/โครงการที่เป็นค่าใช้จ่ายใน ‘หน้าที่หรือภารกิจประจำ’ ของหน่วยงานต่าง ๆ",
  },
  {
    name: "แผนงานยุทธศาสตร์",
    description:
      "รวมผลผลิต/โครงการที่ขับเคลื่อนเป้าหมายตามยุทธศาสตร์ชาติหรือนโยบายของรัฐบาล เป็นงบประมาณในลักษณะ Project based ที่มีค่าใช้จ่าย เป้าหมาย ตัวชี้วัด และระยะเวลาสิ้นสุดที่ชัดเจน",
  },
  {
    name: "แผนงานบูรณาการ",
    description:
      "รวมผลผลิต/โครงการที่ดำเนินงานร่วมกันมากกว่า 2 หน่วยงานขึ้นไปซึ่งไม่ได้อยู่ในกระทรวงเดียวกัน เพื่อความรวดเร็ว ประหยัดและลดความซ้ำซ้อนของภารกิจ",
  },
  {
    name: "แผนงานบุคลากรภาครัฐ",
    description:
      "แสดงรายจ่ายบริหารงานบุคลากรของรัฐที่อยู่ในประเภทงบบุคลากร งบดำเนินงาน งบเงินอุดหนุนและงบรายจ่ายอื่น",
  },
];

const STATE_SUPPORT_PLANS = [
  "แผนงานบริหารเพื่อรองรับกรณีฉุกเฉินหรือจำเป็น",
  "แผนงานบริหารจัดการหนี้ภาครัฐ",
  "แผนงานรายจ่ายเพื่อชดใช้เงินคงคลัง",
  "แผนงานรายจ่ายเพื่อชดใช้เงินทุนสำรองจ่าย",
];

// "แผนงานคืออะไร?": what a แผนงาน is, and its five groups.
export default function PlanInfoModal({ isOpen, onClose }: PlanInfoModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="แผนงาน">
      <div className="flex flex-col gap-[16px] px-[16px] text-[14px] leading-[22px]">
        <p>
          แผนงานรวบรวม ‘ผลผลิต/โครงการของรายการใช้จ่าย’ ที่มีเป้าหมายเดียวกัน
          ใช้สำหรับการจัดสรรงบประมาณให้หน่วยงานดำเนินงานสำเร็จตามยุทธศาสตร์ต่าง
          ๆ และเป้าหมายที่รัฐบาลต้องการ โดยมี 5 กลุ่มแผนงานคือ
        </p>
        <ul className="flex list-disc flex-col gap-[4px] pl-[20px]">
          {PLAN_TYPES.map(({ name, description }) => (
            <li key={name}>
              <strong>{name} :</strong> {description}
            </li>
          ))}
          <li>
            <strong>
              กลุ่มแผนงานที่เป็นค่าใช้จ่ายสนับสนุนการดำเนินการของรัฐ
            </strong>{" "}
            ประกอบด้วย
            <ul className="list-disc pl-[20px]">
              {STATE_SUPPORT_PLANS.map((name) => (
                <li key={name}>
                  <strong>{name}</strong>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    </Modal>
  );
}
