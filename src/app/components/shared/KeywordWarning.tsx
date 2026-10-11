import ExclamationIcon from "@/app/components/shared/icons/exclamation-icon";

// Shown with keyword results: a keyword can mean more than one thing.
export default function KeywordWarning() {
  return (
    <div className="border-interactive-01 flex gap-[12px] border border-l-[3px] bg-[#eef2ff] px-[8px] py-[16px] md:px-[20px]">
      <ExclamationIcon className="mt-[2px] shrink-0" />
      <p className="text-text-01 text-[14px]">
        <span className="font-bold">ข้อควรระวัง:</span>{" "}
        คีย์เวิร์ดบางคำอาจมีได้มากกว่าหนึ่งความหมาย (เช่น
        เป็นได้ทั้งชื่อสิ่งของหรือชื่อสถานที่)
        จึงควรตรวจสอบบริบทที่ปรากฏคำดังกล่าว ก่อนนำผลลัพธ์ไปใช้หรือสื่อสาร
      </p>
    </div>
  );
}
