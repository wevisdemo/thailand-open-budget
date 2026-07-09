"use client";
import React, { useState } from "react";
import Footer from "../shared/Footer";
import Breadcrumb from "../shared/Breadcrumb";
import HeroSection from "./DownloadSection/HeroSection";
import DetailSection from "./DownloadSection/DetailSection";

const DownloadTemplate = () => {
  return (
    <main className="mx-auto flex w-full flex-col">
      <div className="border-gray-20 flex items-center justify-between border-b-[2px] bg-white px-[8px] py-[15px] md:px-[32px]">
        <Breadcrumb
          items={[
            { label: "หน้าหลัก", href: "/" },
            { label: "ดาวน์โหลด", href: "/download" },
          ]}
        />
      </div>
      <section>
        <HeroSection />
      </section>
      <section className="bg-white px-[24px]">
        <DetailSection />
      </section>

      <Footer />
    </main>
  );
};

export default DownloadTemplate;
