"use client";
import { Product } from "@/types/product";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export function useProductColumns(): ColumnDef<Product>[] {
  return [
    {
      id: "sl_no",
      header: "#",
      size: 10,
      maxSize: 20,
      enableSorting: false,
      cell: ({ table, row }) => {
        const fullRows = table.getSortedRowModel().rows;
        const idx = fullRows.findIndex((r) => r.id === row.id);
        return <p className="text-center">{idx + 1}</p>;
      },
    },
    {
      id: "vendor_name",
      accessorKey: "vendor_name",
      header: ({ column }) => (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center cursor-pointer justify-center"
        >
          <span>Vendor</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </p>
      ),
    },
    {
      id: "product_name",
      accessorKey: "product_name",
      header: ({ column }) => (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center cursor-pointer justify-center"
        >
          <span>Name</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </p>
      ),
    },
    {
      id: "color",
      accessorKey: "color",
      header: ({ column }) => (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center cursor-pointer justify-center"
        >
          <span>Color</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </p>
      ),
    },
    {
      id: "package",
      accessorKey: "package",
      header: ({ column }) => (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center cursor-pointer justify-center"
        >
          <span>Package</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </p>
      ),
    },
    {
      id: "item_price",
      accessorKey: "item_price",
      header: ({ column }) => (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center cursor-pointer justify-center"
        >
          <span>Price</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </p>
      ),
      cell: ({ row }) => (
        <p className="text-right">
          ₹{Number(row.original.item_price).toFixed(2)}
        </p>
      ),
    },
    {
      id: "quantity",
      accessorKey: "quantity",
      header: ({ column }) => (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center cursor-pointer justify-center"
        >
          <span>Qty</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </p>
      ),
      cell: ({ row }) => <p className="text-center">{row.original.quantity}</p>,
    },
  ];
}
