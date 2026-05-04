import Modal from "@/app/components/shared/Modal";

interface ProjectOutputInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectOutputInfoModal({
  isOpen,
  onClose,
}: ProjectOutputInfoModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="โครงการ/ผลผลิต ต่างกันอย่างไร?"
    >
      <ul className="flex list-disc flex-col gap-[16px] pl-[20px] text-[14px]">
        <li>
          <p>
            <strong>โครงการ</strong> หมายถึง กิจกรรมภายใต้แผนงานต่าง ๆ
            ที่เกิดขึ้นในปีงบประมาณ โดยมี &lsquo;รายการใช้จ่าย&rsquo; และ
            &lsquo;งบประมาณ&rsquo; ใน 1 โครงการต้องมีวัตถุประสงค์
            สถานที่ดำเนินการ และระยะเวลาดำเนินการ
          </p>
        </li>
        <li>
          <p>
            ในขณะที่ <strong>ผลผลิต</strong>{" "}
            หมายถึงกิจกรรมภายใต้แผนงานในเชิงนโยบาย ประกอบด้วย
            &lsquo;รายการใช้จ่าย&rsquo; และ&lsquo;งบประมาณ&rsquo;
            โดยผลผลิตจะระบุเพียงแค่วัตถุประสงค์
          </p>
        </li>
      </ul>
      <p className="mt-[16px] text-[14px] font-bold">
        1 รายการ จะสามารถอยู่ภายใต้ 1 ผลผลิต หรือ 1 โครงการ
        อย่างใดอย่างหนึ่งเท่านั้น
      </p>
    </Modal>
  );
}
