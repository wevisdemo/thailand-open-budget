import WevisIcon from "./icons/wevis-icon";

export default function AboutTeam({ page }: { page?: string }) {
  return (
    <div
      className={`bg-ui-02 m-auto flex ${page === "homepage" ? "max-w-[1280px]" : "max-w-[1032px]"} flex-col gap-[10px]`}
    >
      <h1 className="text-text-01 text-left font-serif text-[28px] font-bold">
        เกี่ยวกับผู้จัดทำ
      </h1>

      <div className="flex flex-col gap-[10px]">
        <div>
          <p className="text-text-01">เว็บไซต์นี้สร้างโดย</p>
          <WevisIcon className="h-[32px]" />
        </div>
        <p className="text-text-01 text-[14px]">
          กลุ่มเทคโนโลยีภาคประชาชน (Civic Technology)
          ที่ขับเคลื่อนสังคมผ่านเทคโนโลยีและข้อมูลเปิด (Open Data)
          หนึ่งภารกิจของเราคือการผลักดันให้ข้อมูลงบประมาณของรัฐเปิดเผยเป็นสาธารณะ
          โปร่งใส (Transparent) เข้าถึงง่าย (Accessible) และนำไปใช้งานได้จริง
          (Usable) เราจึงจัดทำโครงการ ‘Open Budget: งบประมาณโปร่งใส ตรวจสอบได้’
          ขึ้นมาตั้งแต่ปี 2565
          และได้ต่อยอดพัฒนาเป็นแพลตฟอร์มนี้เพื่อเชื่อมโยงข้อมูลงบประมาณให้เป็นระบบมากขึ้น
          และสร้างต้นแบบเชิงเทคนิคที่นอกจากจะเป็นเครื่องมือสำคัญให้ผู้กำหนดนโยบาย
          ประชาชน สื่อมวลชน
          และนักวิชาการสามารถเข้าถึงและใช้งานข้อมูลการใช้จ่ายงบประมาณของรัฐได้โดยสะดวกแล้ว
          ยังนำไปสู่การผลักดันให้หน่วยงานภาครัฐปรับปรุงกระบวนการเปิดเผยข้อมูลให้สอดคล้องกับมาตรฐานสากลและตอบสนองต่อการใช้งานของสาธารณะได้อย่างยั่งยืนในอนาคต
        </p>
        <p className="text-text-01 text-[14px]">
          โครงการนี้{" "}
          <a
            className="text-text-01 underline"
            href="https://www.wevis.info/"
            target="_blank"
            rel="noopener noreferrer"
          >
            WeVis
          </a>{" "}
          ได้รับการสนับสนุนทุนในการดำเนินงานจาก{" "}
          <a
            className="text-text-01 underline"
            href="https://www.ned.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            National Endowment for Democracy (NED)
          </a>{" "}
          และ{" "}
          <a
            className="text-text-01 underline"
            href="https://www.opensocietyfoundations.org/george-soros/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Society Foundations (OSF)
          </a>
          ซึ่งนำมาใช้เป็นต้นทุนในการรวบรวมข้อมูล ออกแบบ พัฒนาเว็บไซต์ ประสานงาน
          และบริหารจัดการโครงการ
        </p>
      </div>
    </div>
  );
}
