import { NavMenuType } from "@/types/common";
import {
  Blocks,
  Box,
  FilePlus2,
  ReceiptIndianRupee,
  Truck,
  UsersRound,
} from "lucide-react";

export const APP_NAME_SHORT = "SPP";
export const APP_NAME = "Shree Padma Paints";

export const APP_ADDRESS =
  "Sonai Nursing Home, Mulgund Road,<br>Gadag Karnataka - 582 101.<br>+91 95912 94257";

export const NAV_MENU_ITEMS: NavMenuType = [
  {
    title: "Customers",
    pageTitle: "Customers",
    icon: UsersRound,
    url: "/customers",
  },
  {
    title: "Delivery Note",
    pageTitle: "Delivery Note",
    icon: ReceiptIndianRupee,
    childrens: [
      {
        title: "Delivery Notes",
        pageTitle: "Manage Delivery Notes",
        url: "/delivery-note",
        icon: FilePlus2,
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
        url: "/products",
        icon: Box,
      },
      {
        title: "Manage Vendors",
        pageTitle: "Manage Vendors",
        url: "/vendors",
        icon: Truck,
      },
    ],
  },
];
