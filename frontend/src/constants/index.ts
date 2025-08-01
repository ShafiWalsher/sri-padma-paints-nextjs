import { NavMenuType } from "@/types/common";
import {
  Blocks,
  BookText,
  Box,
  FileChartLine,
  FilePlus2,
  LayoutDashboard,
  Printer,
  ReceiptIndianRupee,
  Truck,
  UsersRound,
} from "lucide-react";

export const APP_NAME = "Shree Padma Paints";
export const APP_NAME_SHORT = "SPP";

export const NAV_MENU_ITEMS: NavMenuType = [
  {
    title: "Dashboard",
    pageTitle: "Dashboard",
    icon: LayoutDashboard,
    url: "/",
  },
  {
    title: "Customers",
    pageTitle: "Customers",
    icon: UsersRound,
    url: "/customers",
  },
  {
    title: "Billing",
    pageTitle: "Billing",
    icon: ReceiptIndianRupee,
    childrens: [
      {
        title: "New Bill",
        pageTitle: "Create New Bill",
        url: "/add-new-bill",
        icon: FilePlus2,
      },
      {
        title: "Print Bill",
        pageTitle: "Print Bill",
        url: "/print-bill",
        icon: Printer,
      },
      {
        title: "Report",
        pageTitle: "Billing Report",
        url: "/billing-report",
        icon: FileChartLine,
      },
    ],
  },
  {
    title: "Products & Vendors",
    pageTitle: "Products & Vendors",
    icon: Blocks,
    childrens: [
      {
        title: "Manage Products",
        pageTitle: "Manage Products",
        url: "/manage-products",
        icon: Box,
      },
      {
        title: "Manage Vendors",
        pageTitle: "Manage Vendors",
        url: "/manage-vendors",
        icon: Truck,
      },
    ],
  },
];
