export interface NavLinkItem {
  label: string;
  url: string;
  icon: React.ReactNode;
  menu: boolean;
  subMenu: NavSubMenuItem[];
}

interface NavSubMenuItem {
  label: string;
  url: string;
  icon: React.ReactNode;
}
