import { DOC_SOURCE_OPTIONS } from "@/constants/budget";
import Breadcrumb, {
  type BreadcrumbItem,
} from "@/app/components/shared/layout/Breadcrumb";
import Dropdown, {
  type DropdownOption,
} from "@/app/components/shared/ui/Dropdown";

interface BudgetNavbarProps {
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
  return (
    <div className="border-gray-20 sticky top-[44px] z-20 flex flex-col gap-[8px] border-b-[2px] bg-white px-[8px] py-[8px] transition-[top] duration-300 in-data-header-hidden:top-0 md:top-[48px] md:flex-row md:items-center md:justify-between md:px-[32px] md:py-[4px] md:in-data-header-hidden:top-0">
      <Breadcrumb items={breadcrumbItems} />
      <div className="w-full max-w-[370px] md:w-[240px]">
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
