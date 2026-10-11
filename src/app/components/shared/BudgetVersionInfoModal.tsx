import Modal from "@/app/components/shared/Modal";

interface BudgetVersionInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BudgetVersionInfoModal({
  isOpen,
  onClose,
}: BudgetVersionInfoModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="แต่ละวาระต่างกันอย่างไร?">
      <ul className="flex list-disc flex-col pl-[20px] text-[14px]">
        <li>
          <p className="font-bold">งบประมาณฉบับร่าง (วาระ 1)</p>
          <p className="text-text-01">
            เป็นร่างงบประมาณที่คณะรัฐมนตรีอนุมัติและส่งให้รัฐสภาพิจารณา (สส. และ
            สว.){" "}
            <strong>เป็นฉบับที่ยังไม่ผ่านการพิจารณาในรายละเอียด</strong>{" "}
          </p>
        </li>
        <li>
          <p className="font-bold">งบประมาณฉบับที่สภาอนุมัติแล้ว (วาระ 3)</p>
          <p className="text-text-01">
            เป็นงบประมาณที่รัฐสภาพิจารณารายละเอียด ตั้งข้อสังเกต ลงมติรายมาตรา
            และได้รับการอนุมัติให้มีการบังคับใช้ตามกฎหมาย
          </p>
        </li>
      </ul>
    </Modal>
  );
}
