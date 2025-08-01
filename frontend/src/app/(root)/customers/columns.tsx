"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Customer } from "@/types/customer";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

export const columns: ColumnDef<Customer>[] = [
  //   Table Headers
  {
    id: "sl_no",
    header: "#",
    size: 10,
    maxSize: 20,
    enableSorting: false,
    cell: ({ table, row }) => {
      // this is all rows _after_ filter+sort but _before_ pagination
      const fullRows = table.getSortedRowModel().rows;
      // find where this row lives in that list
      const idx = fullRows.findIndex((r) => r.id === row.id);
      return <p className="text-center ">{idx + 1}</p>;
    },
  },
  {
    accessorKey: "name",
    size: 300,
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center cursor-pointer justify-center"
        >
          <span>Name</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </p>
      );
    },
  },
  {
    accessorKey: "mobile",
    size: 60,
    header: ({ column }) => {
      return (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center cursor-pointer justify-center"
        >
          <span>Mobile</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </p>
      );
    },
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "balance",
    header: "Balance",
    size: 60,
    cell: ({ row }) => <p className="text-right">{row.original.balance}</p>,
  },

  //   Actions
  {
    id: "actions",
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              className="h-8 w-8 p-0 cursor-pointer outline-0 bg-[var(--primary)]/20 group hover:outline-0 hover:bg-[var(--primary)]/40 hover:border-[1px] hover:border-[var(--border)]"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4 text-[var(--primary)]/80 group-hover:text-[var(--primary)]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[var(--background)]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
