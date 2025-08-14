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
import {
  ArrowUpDown,
  Eye,
  MoreHorizontal,
  SquarePen,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { customerServices } from "@/services/customer-service";
import { useConfirmDialog } from "@/contexts/confirm-dialog-context";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

export function useCustomerColumns(): ColumnDef<Customer>[] {
  const router = useRouter();
  const confirm = useConfirmDialog();
  const queryClient = useQueryClient();

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
        cell: ({ row }) => (
          <Link
            href={`customers/view?id=${row.original.id}`}
            className="hover:underline text-blue-700 font-medium"
          >
            {row.original.name}
          </Link>
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
        id: "main_account",
        accessorKey: "default_account_name",
        header: "Default Account",
        size: 60,
      },

      {
        id: "total_balance",
        accessorKey: "total_balance",
        header: "Total Bal.",
        size: 60,
        cell: ({ row }) => (
          <p className="text-right">{row.original.total_balance}</p>
        ),
      },
      {
        id: "accounts_count",
        accessorKey: "accounts_count",
        header: "Accounts",
        size: 60,
        cell: ({ row }) => (
          <p className="text-right">{row.original.accounts_count}</p>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        size: 40,
        cell: ({ row }) => {
          const customer = row.original;

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
                    onClick={() =>
                      router.push(`/customers/view?id=${customer.id}`)
                    }
                  >
                    <Eye size={14} className="mr-2" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hover:!bg-blue-200/40"
                    onClick={() =>
                      router.push(`/customers/new?id=${customer.id}`)
                    }
                  >
                    <SquarePen size={14} className="mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hover:!bg-red-200/40 text-red-600"
                    onClick={async () => {
                      try {
                        await confirm({
                          title: "Delete Customer?",
                          description: `Are you sure you want to delete ${customer.name}?`,
                          confirmText: "Delete",
                        });
                      } catch {
                        return;
                      }
                      await customerServices.deleteCustomer(customer.id);
                      queryClient.invalidateQueries({
                        queryKey: ["customers"],
                      });
                      router.refresh();
                    }}
                  >
                    <Trash2 size={14} className="mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [router, confirm, queryClient]
  );
}
