"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/shared/data-table";
import { useColumns } from "../customer-columns";
import { customerServices } from "@/services/customer-service";

export default function CustomerTable() {
  const { data } = useSuspenseQuery({
    queryKey: ["customers"],
    queryFn: customerServices.fetchCustomers,
  });

  const columns = useColumns();

  return (
    <DataTable
      columns={columns}
      data={data || []}
      searchableItems={["name", "mobile"]}
      searchPlaceHolder="Search for a user or mobile"
      initialPageSize={50}
    />
  );
}
