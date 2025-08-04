"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeliveryNote } from "@/types/delivery-note";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Eye,
  MoreHorizontal,
  PrinterCheck,
  SquarePen,
} from "lucide-react";
import { useRouter } from "next/navigation";

export function useColumns(): ColumnDef<DeliveryNote>[] {
  const router = useRouter();

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
      id: "name",
      accessorKey: "name",
      header: ({ column }) => (
        <p
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center cursor-pointer justify-center"
        >
          <span>Name</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </p>
      ),
      size: 300,
    },
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
      size: 60,
    },
    {
      id: "date",
      accessorKey: "date",
      header: "Date",
    },
    {
      id: "total_amount",
      accessorKey: "total_amount",
      header: "Total",
      cell: ({ row }) => (
        <p className="text-right">
          {row.original.total_amount != null
            ? Number(row.original.total_amount).toFixed(2)
            : "—"}
        </p>
      ),
    },
    {
      id: "old_balance",
      accessorKey: "old_balance",
      header: "Old Bal",
      cell: ({ row }) => (
        <p className="text-right">
          {row.original.old_balance != null
            ? Number(row.original.old_balance).toFixed(2)
            : "—"}
        </p>
      ),
    },
    {
      id: "grand_total",
      accessorKey: "grand_total",
      header: "Grand Total",
      cell: ({ row }) => (
        <p className="text-right">
          {row.original.grand_total != null
            ? Number(row.original.grand_total).toFixed(2)
            : "—"}
        </p>
      ),
    },
    {
      id: "paid",
      accessorKey: "paid",
      header: "Paid",
      cell: ({ row }) => (
        <p className="text-right">
          {row.original.paid != null
            ? Number(row.original.paid).toFixed(2)
            : "—"}
        </p>
      ),
    },
    {
      id: "balance",
      accessorKey: "balance",
      header: "Balance",
      cell: ({ row }) => (
        <p className="text-right">
          {row.original.balance != null
            ? Number(row.original.balance).toFixed(2)
            : "—"}
        </p>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = (row.original.status || "").toLowerCase();

        const getBadgeColor = (status: string) => {
          switch (status) {
            case "pending":
              return "bg-yellow-100 text-yellow-800 border border-yellow-400";
            case "complete":
              return "bg-green-100 text-green-800 border border-green-400";
            default:
              return "bg-gray-100 text-gray-800 border border-gray-300";
          }
        };

        return (
          <div className="flex justify-center">
            <span
              className={`px-2 py-1 text-xs rounded-lg font-medium capitalize ${getBadgeColor(
                status
              )}`}
            >
              {status || "—"}
            </span>
          </div>
        );
      },
    },
    {
      id: "created_by",
      accessorKey: "created_by",
      header: "Created By",
      cell: ({ row }) => <span>{row.original.created_by || "—"}</span>,
    },
    {
      id: "created_at",
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.created_at
            ? new Date(row.original.created_at).toLocaleString()
            : "—"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const note = row.original;

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
                  className="hover:!bg-blue-200/40 cursor-pointer"
                  onClick={() =>
                    router.push(`/delivery-note/view?id=${note.id}`)
                  }
                >
                  <Eye size={14} className="mr-2" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:!bg-blue-200/40 cursor-pointer"
                  // onClick={() =>
                  //   router.push(`/delivery-note/edit?id=${note.id}`)
                  // }
                >
                  <SquarePen size={14} className="mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:!bg-blue-200/40 cursor-pointer"
                  onClick={() =>
                    router.push(`/delivery-note/print?id=${note.id}`)
                  }
                >
                  <PrinterCheck size={14} className="mr-2" />
                  Print
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}
