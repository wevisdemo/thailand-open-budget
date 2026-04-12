import Link from "next/link";
import DownloadIcon from "./icons/download-icon";

export default function AboutData() {
  return (
    <div className="m-auto flex max-w-[1032px] flex-col gap-[16px] text-white">
      <div className="flex flex-col gap-[10px]">
        <div className="flex items-center justify-between">
          <h1 className="text-h6 font-serif text-[28px] font-bold">
            เกี่ยวกับข้อมูล
          </h1>
          <button className="text-disabled-02 hover:text-gray-70 hover:border-gray-20 flex items-center gap-[8px] border border-white px-[16px] py-[10px] hover:cursor-pointer hover:bg-white">
            <DownloadIcon color="currentColor" />
            ดาวน์โหลดข้อมูล
          </button>
        </div>

        <h2 className="text-b4 font-serif text-[20px] font-bold">
          ที่มาและอ้างอิงข้อมูล
        </h2>
        <p className="text-b5">
          ข้อมูลงบประมาณที่แสดงบนเว็บไซต์นี้ มาจากร่าง พ.ร.บ. งบประมาณรายจ่าย
          (ฉบับที่ 3 ขาว-แดง) และ พ.ร.บ. ประจำปีงบประมาณ (ฉบับที่ 3 ขาว-แดง)
          เผยแพร่โดย{" "}
          <a
            href="https://www.bb.go.th/topic.php?gid=543&mid=308#"
            target="_blank"
            className="text-inverse-link underline"
          >
            สำนักงบประมาณ
          </a>{" "}
          และผ่านการแปลงข้อมูลผ่านโปรแกรมคอมพิวเตอร์ให้เป็นไฟล์ในรูปแบบ
          Machine-Readable ซึ่งได้รับการตรวจสอบความถูกต้องโดยทีมงาน
          ส่วนในการแสดงผลส่วนต่างๆ
          มาจากการค้นหาและตัดคำเบื้องต้นโดยคอมพิวเตอร์ข้อมูล
          โปรดตรวจสอบบริบทของผลลัพธ์อีกครั้งก่อนการใช้งาน
        </p>
        <div>
          <p>ขอบเขตของข้อมูลงบประมาณที่ใช้พัฒนา</p>
          <ul className="text-b5 flex list-disc flex-col pl-[20px]">
            <li>
              งบประมาณจากร่าง พ.ร.บ. งบประมาณรายจ่าย (ฉบับร่าง วาระ 1) ระหว่างปี
              2566-ปีปัจจุบัน
            </li>
            <li>
              งบประมาณจาก พ.ร.บ. งบประมาณรายจ่าย (ฉบับที่สภาอนุมัติแล้ว วาระ 3)
              ระหว่างปี 2569-ปีปัจจุบัน
            </li>
          </ul>
        </div>
        <p>
          หากต้องการแจ้งข้อผิดพลาดหรือเสนอแนะเพิ่มเติม สามารถแจ้งทีมงานได้ที่
          อีเมล{" "}
          <a
            href="mailto:team@wevis.info"
            className="text-inverse-link underline"
          >
            team@wevis.info
          </a>
        </p>
      </div>

      <div className="bg-inverse-02 flex flex-col rounded-[8px] px-[24px] py-[32px]">
        <h2 className="text-b4 font-serif text-[20px] font-bold">
          ข้อตกลงการใช้งาน (Terms of Use)
        </h2>
        <p className="text-b5">
          ทีมงานตั้งใจเปิดข้อมูลเป็น Open Data ภายใต้เงื่อนไข{" "}
          <a
            href="https://creativecommons.org/licenses/by-nc/4.0/"
            target="_blank"
          >
            Attribution-NonCommercial 4.0 International
          </a>{" "}
          ซึ่งหมายถึง สามารถนำข้อมูลไปใช้ ดัดแปลง ต่อยอดได้
          แต่ห้ามนำไปใช้ทางการค้าหรือแสวงหาผลกำไรจากผลงาน และต้องให้เครดิตกับ
          WeVis
          ข้อมูลทั้งหมดภายในเว็บไซต์ถูกรวบจากเอกสารงบประมาณจากเว็บไซต์ของสำนักงบประมาณภายใต้ข้อจำกัดเรื่องคุณภาพของข้อมูลในหลากหลายด้าน
          ทาง WeVis ไม่สามารถรับผิดชอบต่อผลกระทบใด ๆ
          หากมีข้อมูลที่ผิดพลาดหรือไม่อัปเดตล่าสุด
          หากมีข้อสงสัยต้องการสอบถามเพิ่มเติม
          ประสงค์แจ้งเปลี่ยนแปลงหรือเพิ่มเติมข้อมูลเพื่อความถูกต้อง
          หรือมีข้อเสนอแนะใดๆ สามารถติดต่อได้ที่{" "}
          <a
            href="mailto:team@wevis.info"
            className="text-inverse-link underline"
          >
            team@wevis.info
          </a>{" "}
          ด้าน Source Code ทางทีมมีความตั้งใจที่พัฒนาทุกโปรเจกต์ให้เป็น Open
          Source ภายใต้เงื่อนไข{" "}
          <a
            href="https://creativecommons.org/licenses/by-nc/4.0/"
            target="_blank"
          >
            Attribution-NonCommercial 4.0 International
          </a>{" "}
          ซึ่งหมายถึง สามารถนำผลงานไปใช้ ดัดแปลง ต่อยอดได้
          แต่ห้ามนำไปใช้ทางการค้าหรือแสวงหาผลกำไรจากผลงาน
          และต้องแจ้งทราบและให้เครดิตกับเจ้าของผลงาน
          โดยที่ผลงานที่เกิดขึ้นมาจะต้องอยู่ภายใต้เงื่อนไขแบบเดียวกันกับใบอนุญาต
          Creative Commons ของต้นฉบับ โดย WeVis Ltd. และ Punch Up Ltd.
          เป็นผู้อนุญาต (licensor) ร่วมกัน
        </p>
      </div>
    </div>
  );
}
