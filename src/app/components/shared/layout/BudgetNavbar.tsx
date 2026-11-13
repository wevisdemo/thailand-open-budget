import { DOC_SOURCE_OPTIONS } from "@/constants/budget";
import Breadcrumb, {
  type BreadcrumbItem,
} from "@/app/components/shared/layout/Breadcrumb";
import Dropdown, {
  type DropdownOption,
} from "@/app/components/shared/ui/Dropdown";

interface BudgetNavbarProps {
  // Empty on pages without a trail (home); the dropdown then sits alone.
  breadcrumbItems: BreadcrumbItem[];
  selectedDocSource: DropdownOption | null;
  onChangeDocSource: (option: DropdownOption) => void;
  onOpenVersionInfo: () => void;
}

export default function BudgetNavbar({
  breadcrumbItems,
  selectedDocSource,
  onChangeDocSource,
  onOpenVersionInfo,
}: BudgetNavbarProps) {
  // Carry the selected document across breadcrumb links, unless the link
  // already names one (e.g. the ministry link on the budgetary page).
  const items = breadcrumbItems.map((item) => {
    if (
      !item.href ||
      !selectedDocSource ||
      item.href.includes("budget_source=")
    )
      return item;
    const separator = item.href.includes("?") ? "&" : "?";
    return {
      ...item,
      href: `${item.href}${separator}budget_source=${selectedDocSource.value}`,
    };
  });

  return (
    <div className="border-gray-20 sticky top-[44px] z-30 flex flex-col gap-[8px] border-b-[2px] bg-white px-[8px] py-[8px] transition-[top] duration-300 in-data-header-hidden:top-0 md:top-[48px] md:flex-row md:items-center md:justify-between md:px-[32px] md:py-[4px] md:in-data-header-hidden:top-0">
      {items.length > 0 && <Breadcrumb items={items} />}
      <div className="w-full max-w-[370px] md:ml-auto md:w-[240px]">
        <Dropdown
          options={DOC_SOURCE_OPTIONS}
          selectedOption={selectedDocSource}
          onChange={onChangeDocSource}
          placeholder="Choose an option"
          footerLink={{
            label: "แต่ละวาระต่างกันอย่างไร?",
            onClick: onOpenVersionInfo,
          }}
        />
      </div>
    </div>
  );
}
