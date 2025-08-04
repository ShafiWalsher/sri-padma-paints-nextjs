"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/shared/data-table";
import { useColumns } from "../product-columns";
import { productServices } from "@/services/product-service";

export default function ProductsTable() {
  const { data } = useSuspenseQuery({
    queryKey: ["deliveryNotes"],
    queryFn: productServices.fetchProducts,
  });

  const columns = useColumns();

  return (
    <DataTable
      columns={columns}
      data={data || []}
      searchableItems={["name"]}
      searchPlaceHolder="Search for a product"
      initialPageSize={50}
    />
  );
}
