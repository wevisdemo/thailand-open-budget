import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai_Looped } from "next/font/google";
import "./globals.css";
import Header from "./components/shared/Header";

const ibmPlexSansThaiLooped = IBM_Plex_Sans_Thai_Looped({
  variable: "--font-sans",
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Open Budget เงินภาษีที่คุณจ่าย รัฐนำไปใช้ทำอะไรบ้าง?",
  description:
    "แพลตฟอร์มงบประมาณที่ช่วยให้คุณค้นหา ติดตาม และตั้งคำถามต่อการใช้งบประมาณของภาครัฐได้สะดวกยิ่งขึ้น เพื่อปกป้องภาษีทุกบาทของประชาชน",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${ibmPlexSansThaiLooped.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        {children}
      </body>
    </html>
  );
}
