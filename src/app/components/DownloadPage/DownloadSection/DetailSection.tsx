import React from "react";
import type { BudgetDocument } from "@/types/budget";
import rawDocuments from "@/app/data/budget_index.json";

const documents = (rawDocuments as BudgetDocument[]) || [];

const DetailSection = () => {
  return (
    <section className="bg-white">
      <div className="content-container flex w-full flex-col gap-[48px] py-[64px]">
        <div className="flex w-full flex-col gap-[10px]">
          <h2 className="text-text-01 font-serif text-[28px] leading-[36px] font-bold">
            เกี่ยวกับข้อมูล
          </h2>
          <p className="text-text-01 font-serif text-[20px] leading-[28px] font-bold">
            ที่มาและข้อจำกัดข้อมูล
          </p>
          <div className="text-text-01 flex w-full flex-col gap-[10px] text-[14px] leading-[20px]">
            <p>
              ข้อมูลงบประมาณที่แสดงบนเว็บไซต์นี้ มาจากร่าง พ.ร.บ.
              งบประมาณรายจ่าย (ฉบับที่ 3 ขาว-แดง) และ พ.ร.บ. ประจำปีงบประมาณ
              (ฉบับที่ 3 ขาว-แดง) เผยแพร่โดย{" "}
              <a
                href="https://www.bb.go.th/topic.php?gid=543&mid=308#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-link-01 hover:text-link-02 underline"
              >
                สำนักงบประมาณ
              </a>
              และผ่านการแปลงข้อมูลผ่านโปรแกรมคอมพิวเตอร์ให้เป็นไฟล์ในรูปแบบ
              Machine-Readable ซึ่งได้รับการตรวจสอบความถูกต้องโดยทีมงาน
              ส่วนในการแสดงผลส่วนต่างๆ
              มาจากการค้นหาและตัดคำเบื้องต้นโดยคอมพิวเตอร์ข้อมูล
              โปรดตรวจสอบบริบทของผลลัพธ์อีกครั้งก่อนการใช้งาน
            </p>
            <ul className="list-inside list-disc">
              <p className="text-text-01 text-[14px] leading-[20px]">
                ขอบเขตของข้อมูลงบประมาณที่ใช้พัฒนา
              </p>
              <li>
                งบประมาณจากร่าง พ.ร.บ. งบประมาณรายจ่าย (ฉบับร่าง วาระ 1)
                ระหว่างปี 2566-ปีปัจจุบัน
              </li>
              <li>
                งบประมาณจาก พ.ร.บ. งบประมาณรายจ่าย (ฉบับที่สภาอนุมัติแล้ว วาระ
                3) ระหว่างปี 2569-ปีปัจจุบัน
              </li>
            </ul>
            <p>
              หากต้องการแจ้งข้อผิดพลาดหรือเสนอแนะเพิ่มเติม
              สามารถแจ้งทีมงานได้ที่ อีเมล{" "}
              <a
                href="mailto:team@wevis.info"
                className="text-link-01 hover:text-link-02 underline"
              >
                team@wevis.info
              </a>
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-[16px]">
          <div className="border-gray-20 w-full overflow-x-auto rounded-[8px] border">
            <table className="w-full min-w-[640px] border-collapse text-left text-[14px] leading-[20px]">
              <thead>
                <tr className="border-gray-20 bg-gray-10 text-text-02 border-b">
                  <th className="px-[16px] py-[12px] font-medium">
                    ปีงบประมาณ
                  </th>
                  <th className="px-[16px] py-[12px] font-medium">เอกสาร</th>
                  <th className="px-[16px] py-[12px] font-medium">สถานะ</th>
                  <th className="px-[16px] py-[12px] font-medium">
                    อัปเดตล่าสุด
                  </th>
                  <th className="px-[16px] py-[12px] font-medium">
                    แหล่งที่มา
                  </th>
                  <th className="px-[16px] py-[12px] font-medium">ดาวน์โหลด</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr
                    key={`${doc.year}-${doc.status}`}
                    className="border-gray-20 text-text-01 border-b last:border-b-0"
                  >
                    <td className="px-[16px] py-[12px] align-top whitespace-nowrap">
                      {doc.year}
                    </td>
                    <td className="px-[16px] py-[12px] align-top">
                      <div className="font-medium">{doc.nick_name}</div>
                      <div className="text-text-02 text-[12px] leading-[18px]">
                        {doc.full_name}
                      </div>
                    </td>
                    <td className="px-[16px] py-[12px] align-top whitespace-nowrap">
                      {doc.status}
                    </td>
                    <td className="text-text-02 px-[16px] py-[12px] align-top whitespace-nowrap">
                      {doc.updated_date ?? "-"}
                    </td>
                    <td className="px-[16px] py-[12px] align-top whitespace-nowrap">
                      {doc.source_url ? (
                        <a
                          href={doc.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-link-01 hover:text-link-02 underline"
                        >
                          ที่มา
                        </a>
                      ) : (
                        <span className="text-text-03">-</span>
                      )}
                    </td>
                    <td className="px-[16px] py-[12px] align-top whitespace-nowrap">
                      {doc.csv_url ? (
                        <a
                          href={doc.csv_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-link-01 hover:text-link-02 underline"
                        >
                          CSV
                        </a>
                      ) : (
                        <span className="text-text-03">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailSection;
