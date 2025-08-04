"use client";
import { PageActionButtons } from "@/components/shared/page-action-buttons";
import { Suspense } from "react";
import { PlusIcon } from "lucide-react";
import DataLoading from "@/components/shared/data-loading";
import ProductsTable from "./_components/products-table";

export default function Products() {
  return (
    <>
      <PageActionButtons
        actions={[
          {
            key: "1",
            url: "/products/new",
            label: "Add Products",
            color: "black",
            icon: PlusIcon,
          },
        ]}
        className="flex justify-end"
      />

      <Suspense fallback={<DataLoading />}>
        <ProductsTable />
      </Suspense>
    </>
  );
}
