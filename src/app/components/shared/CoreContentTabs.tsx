"use client";

import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@carbon/react";
import type { OrganizationCoreContent } from "@/types/organization";
import { CORE_CONTENT_TABS } from "@/constants/ministry";
import CoreContentPanel from "./CoreContentPanel";

interface CoreContentTabsProps {
  content: OrganizationCoreContent;
}

export default function CoreContentTabs({ content }: CoreContentTabsProps) {
  // Only the fields the sheet fills in get a tab.
  const tabs = CORE_CONTENT_TABS.filter(({ field }) => content[field]);

  // Carbon outlines a tab, or the panel, whenever it has focus; the design
  // has no focus outline here, the selected tab's underline marks it.
  return (
    <Tabs>
      <TabList
        aria-label="ข้อมูลหน่วยงาน"
        className="[&_.cds--tabs\_\_nav-link]:outline-none"
      >
        {tabs.map(({ field, label }) => (
          <Tab key={field}>{label}</Tab>
        ))}
      </TabList>
      <TabPanels>
        {tabs.map(({ field }) => (
          <TabPanel key={field} className="px-0! pt-[16px]! pb-0! outline-none">
            <CoreContentPanel text={content[field] ?? ""} />
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
}
