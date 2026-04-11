"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import WevisIcon from "./icons/wevis-icon";

const links: { label: string; url: string }[] = [
  { label: "หน้าหลัก", url: "/" },
  { label: "เกี่ยวกับ", url: "/about" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative flex h-[44px] items-center justify-between bg-black px-[10px] md:h-[58px] md:px-[32px]">
      <Link href="/">
        <WevisIcon color="white" className="h-[24px] md:h-[58px]" />
      </Link>

      {/* Desktop nav */}
      <nav className="hidden gap-[24px] md:flex">
        {links.map(({ label, url }) => (
          <Link
            key={url}
            href={url}
            className="text-white hover:text-[#BFDBFEBF]"
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Mobile menu button */}
      <div className="relative md:hidden">
        <button onClick={() => setMenuOpen((prev) => !prev)}>
          <Image src="/icons/menu.svg" alt="menu" width={24} height={24} />
        </button>

        {menuOpen && (
          <nav className="absolute top-full right-[-10px] flex w-[100px] flex-col bg-black py-[16px]">
            {links.map(({ label, url }) => (
              <Link
                key={url}
                href={url}
                className="px-[15px] py-[7px] text-white hover:text-[#BFDBFEBF]"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
