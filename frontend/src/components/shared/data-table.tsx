"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
  Row,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import React from "react";
import { DataTablePagination } from "./data-table-pagination";
import { Columns3Icon } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchableItems?: (keyof TData)[];
  searchPlaceHolder?: string;
  sortColumnByDefault?: string;
  initiallyHiddenColumns?: string[];
  initialPageSize?: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchableItems,
  searchPlaceHolder,
  sortColumnByDefault,
  initiallyHiddenColumns,
  initialPageSize = 10,
}: DataTableProps<TData, TValue>) {
  // Column Sizing
  const [columnSizing, setColumnSizing] = React.useState({});

  // Sorting
  const [sorting, setSorting] = React.useState<SortingState>(() => {
    if (!sortColumnByDefault) return [];
    return [{ id: sortColumnByDefault, desc: false }];
  });

  // Filters
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  // Global Filter
  const [globalFilter, setGlobalFilter] = React.useState("");

  const globalFilterFn = React.useCallback(
    (row: Row<TData>, _columnId: string, filterValue: string): boolean => {
      if (!searchableItems || searchableItems.length === 0) return false;

      return searchableItems.some((key) => {
        const value = row.original[key];
        return String(value).toLowerCase().includes(filterValue.toLowerCase());
      });
    },
    [searchableItems]
  );

  //   Column Visibility
  const hiddenIds = ["actions", ...(initiallyHiddenColumns ?? [])];

  const initialVisibility = columns.reduce<VisibilityState>((acc, col) => {
    // Hide the column if its id is 'actions'
    // Ensure all hidden IDs are set to false, even if not in columns
    if (!col.id) return acc;
    if (hiddenIds.includes(col.id)) {
      acc[col.id] = false;
    }
    return acc;
  }, {});

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialVisibility);

  // Pagination State
  const [pagination, setPagination] = React.useState({
    pageIndex: 0, // Start at the first page
    pageSize: initialPageSize, // Default or prop-provided page size
  });

  // Table initialization
  const tableConfig = React.useMemo(
    () => ({
      data,
      columns,
      enableMultiSort: true,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onColumnVisibilityChange: setColumnVisibility,
      getGlobalFilteredRowModel: getFilteredRowModel(),
      onGlobalFilterChange: setGlobalFilter,
      globalFilterFn,
      getPaginationRowModel: getPaginationRowModel(),
      onPaginationChange: setPagination,
      state: {
        sorting,
        columnSizing,
        onColumnSizingChange: setColumnSizing,
        columnResizeMode: "onChange",
        columnFilters,
        columnVisibility,
        globalFilter,
        pagination,
      },
    }),
    [
      data,
      columns,
      columnSizing,
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      globalFilterFn,
      pagination,
    ]
  );

  // Now call useReactTable at the top level with the memoized config.
  const table = useReactTable(tableConfig);
  return (
    <>
      <div className="flex items-center py-4">
        {searchableItems && (
          <Input
            placeholder={searchPlaceHolder || "Search..."}
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm "
          />
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto border-border/20 p-0">
              <Columns3Icon className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[var(--background)]">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize cursor-pointer "
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border border-border/20 ">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, idx) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width: header.getSize()
                          ? `${header.getSize()}px`
                          : undefined,
                      }}
                      className={`!text-center bg-primary-foreground/20 uppercase text-black ${
                        idx == 0 && "rounded-tl-md"
                      } ${
                        idx == headerGroup.headers.length - 1 && "rounded-tr-md"
                      }`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={` hover:bg-blue-500/10 ${
                    row.getIsSelected() && "!bg-blue-500/20"
                  } `}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: cell.column.getSize()
                          ? `${cell.column.getSize()}px`
                          : undefined,
                      }}
                      className="whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </>
  );
}
