import { PageActionButtons } from "@/components/shared/page-action-buttons";
import CustomerTable from "./_components/customers-list";
import { Suspense } from "react";
import DataLoading from "@/components/shared/data-loading";
import { PlusIcon } from "lucide-react";

export default function CustomersPage() {
  return (
    <>
      <PageActionButtons
        actions={[
          {
            key: "1",
            url: "/customers/new",
            label: "Add Customer",
            color: "black",
            icon: PlusIcon,
          },
        ]}
        className="flex justify-end"
      />

      <Suspense fallback={<DataLoading />}>
        <CustomerTable />
      </Suspense>
    </>
  );
}
