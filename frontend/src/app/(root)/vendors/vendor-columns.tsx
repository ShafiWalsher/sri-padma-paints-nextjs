"use client";

import { Vendor } from "@/types/vendor";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export function useColumns(): ColumnDef<Vendor>[] {
  return [
    /* ───────────── Serial # ───────────── */
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

    /* ───────────── Vendor Name ───────────── */
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

    /* ───────────── Mobile ───────────── */
    {
      id: "mobile",
      accessorKey: "mobile",
      header: ({ column }) => (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center cursor-pointer justify-center"
        >
          <span>Mobile</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </p>
      ),
      cell: ({ row }) => (
        <p className="text-center">{row.original.mobile ?? "—"}</p>
      ),
    },

    /* ───────────── City ───────────── */
    {
      id: "city",
      accessorKey: "city",
      header: ({ column }) => (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center cursor-pointer justify-center"
        >
          <span>City</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </p>
      ),
    },

    /* ───────────── State ───────────── */
    {
      id: "state",
      accessorKey: "state",
      header: ({ column }) => (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center cursor-pointer justify-center"
        >
          <span>State</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </p>
      ),
    },

    /* ───────────── GST Number ───────────── */
    {
      id: "gst_number",
      accessorKey: "gst_number",
      header: ({ column }) => (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center cursor-pointer justify-center"
        >
          <span>GST No.</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </p>
      ),
      cell: ({ row }) => (
        <p className="text-center">{row.original.gst_number ?? "—"}</p>
      ),
    },
  ];
}
