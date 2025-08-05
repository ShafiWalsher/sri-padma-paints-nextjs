"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/shared/data-table";
import { useColumns } from "../vendor-columns";
import { vendorServices } from "@/services/vendor-service";

export default function VendorsTable() {
  const { data } = useSuspenseQuery({
    queryKey: ["vendors"],
    queryFn: vendorServices.fetchVendors,
  });

  const columns = useColumns();

  return (
    <DataTable
      columns={columns}
      data={data || []}
      searchableItems={["vendor_name"]}
      searchPlaceHolder="Search for a vendor"
      initialPageSize={50}
    />
  );
}
