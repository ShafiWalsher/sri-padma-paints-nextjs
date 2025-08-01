import { LucideIcon } from "lucide-react";

// Define a type for a single menu item.
export type NavMenuItem = {
  title: string;
  pageTitle?: string;
  url?: string;
  icon?: LucideIcon;
  childrens?: NavMenuItem[];
};

// Define your nav menu as an array of items.
export type NavMenuType = NavMenuItem[];

export type SearchableSelectItem = {
  id: string;
  name: string;
  [key: string]: any;
};
