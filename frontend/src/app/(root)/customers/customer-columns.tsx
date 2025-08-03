"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Customer } from "@/types/customer";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye, MoreHorizontal, SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";

export function useColumns(): ColumnDef<Customer>[] {
  const router = useRouter();

  return useMemo(
    () => [
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
        id: "name",
        accessorKey: "name",
        size: 300,
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
        id: "mobile",
        accessorKey: "mobile",
        size: 60,
        header: ({ column }) => (
          <p
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center cursor-pointer justify-center"
          >
            <span>Mobile</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </p>
        ),
      },
      {
        id: "address",
        accessorKey: "address",
        header: "Address",
      },
      {
        id: "balance",
        accessorKey: "balance",
        header: "Balance",
        size: 60,
        cell: ({ row }) => <p className="text-right">{row.original.balance}</p>,
      },
      {
        id: "actions",
        header: "Actions",
        size: 40,
        cell: ({ row }) => {
          const user = row.original;

          return (
            <div className="flex justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    className="h-8 w-8 p-0 cursor-pointer outline-0 bg-primary/30 hover:bg-primary/40"
                  >
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4 text-black/60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white">
                  <DropdownMenuItem
                    className="hover:!bg-blue-200/40"
                    onClick={() => router.push(`/customers/${user.id}`)}
                  >
                    <Eye size={14} className="mr-2" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hover:!bg-blue-200/40"
                    onClick={() => router.push(`/customers/${user.id}/edit`)}
                  >
                    <SquarePen size={14} className="mr-2" />
                    Edit
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [router]
  );
}
