import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai_Looped } from "next/font/google";
import "./globals.css";
import Header from "./components/shared/Header";
import { withBasePath } from "@/lib/base-path";

const ibmPlexSansThaiLooped = IBM_Plex_Sans_Thai_Looped({
  variable: "--font-sans",
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://wevisdemo.github.io/thailand-open-budget";

const ogImage = {
  url: withBasePath("/og-image.png"),
  width: 1200,
  height: 630,
  alt: "Open Budget เงินภาษีที่คุณจ่าย รัฐนำไปใช้ทำอะไรบ้าง?",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Open Budget เงินภาษีที่คุณจ่าย รัฐนำไปใช้ทำอะไรบ้าง?",
  description:
    "แพลตฟอร์มงบประมาณที่ช่วยให้คุณค้นหา ติดตาม และตั้งคำถามต่อการใช้งบประมาณของภาครัฐได้สะดวกยิ่งขึ้น เพื่อปกป้องภาษีทุกบาทของประชาชน",
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: "Open Budget",
    title: "Open Budget เงินภาษีที่คุณจ่าย รัฐนำไปใช้ทำอะไรบ้าง?",
    description:
      "แพลตฟอร์มงบประมาณที่ช่วยให้คุณค้นหา ติดตาม และตั้งคำถามต่อการใช้งบประมาณของภาครัฐได้สะดวกยิ่งขึ้น เพื่อปกป้องภาษีทุกบาทของประชาชน",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Budget เงินภาษีที่คุณจ่าย รัฐนำไปใช้ทำอะไรบ้าง?",
    description:
      "แพลตฟอร์มงบประมาณที่ช่วยให้คุณค้นหา ติดตาม และตั้งคำถามต่อการใช้งบประมาณของภาครัฐได้สะดวกยิ่งขึ้น เพื่อปกป้องภาษีทุกบาทของประชาชน",
    images: [ogImage.url],
  },
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
