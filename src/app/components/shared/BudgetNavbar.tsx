import { DOC_SOURCE_OPTIONS } from "@/constants/budget";
import Breadcrumb, {
  type BreadcrumbItem,
} from "@/app/components/shared/Breadcrumb";
import Dropdown, {
  type DropdownOption,
} from "@/app/components/shared/Dropdown";

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
    <div className="border-gray-20 sticky top-0 z-20 flex items-center justify-between border-b-[2px] bg-white px-[8px] py-[4px] md:px-[32px]">
      <Breadcrumb items={breadcrumbItems} />
      <div className="w-[220px]">
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
