import { PageActionButtons } from "@/components/shared/page-action-buttons";
import CustomerTable from "./_components/customers-table";
import { Suspense } from "react";
import DataLoading from "@/components/shared/data-loading";
import { PlusIcon, UserPlus } from "lucide-react";

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
            icon: UserPlus,
          },
          {
            key: "2",
            url: "/customers/new-account",
            label: "Add Account",
            color: "white",
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
