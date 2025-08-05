"use client";
import { PageActionButtons } from "@/components/shared/page-action-buttons";
import { Suspense } from "react";
import { PlusIcon } from "lucide-react";
import DataLoading from "@/components/shared/data-loading";
import VendorsTable from "./_components/vendors-table";

export default function Vendors() {
  return (
    <>
      <PageActionButtons
        actions={[
          {
            key: "1",
            url: "/vendors/new",
            label: "Add Vendor",
            color: "black",
            icon: PlusIcon,
          },
        ]}
        className="flex justify-end"
      />

      <Suspense fallback={<DataLoading />}>
        <VendorsTable />
      </Suspense>
    </>
  );
}
