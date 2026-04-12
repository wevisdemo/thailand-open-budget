import WevisIcon from "./icons/wevis-icon";

export default function AboutTeam() {
  return (
    <div className="flex flex-col gap-[16px] px-[16px] py-[40px] md:px-[32px]">
      <h1 className="text-h6 font-bold">เกี่ยวกับโปรเจกต์</h1>

      <div className="flex flex-col gap-[8px]">
        <p className="text-b5 text-[--color-text-02]">โดย</p>
        <WevisIcon className="h-[24px] w-auto" />
        <p className="text-b5 text-[--color-text-02]">
          องค์กรไม่แสวงหากำไร (Civic Technology) ที่มุ่งเผยแพร่ข้อมูลสาธารณะ
          (Open Data) ในรูปแบบที่เข้าถึงได้ง่าย (Accessible)
          และนำไปใช้ประโยชน์ได้ (Usable) ภายใต้แนวคิด &quot;Open Budget&quot;
          ก่อตั้งเมื่อปี 2563
          เพื่อส่งเสริมความโปร่งใสและการมีส่วนร่วมของภาคประชาชนในกระบวนการงบประมาณ
        </p>
      </div>
    </div>
  );
}
