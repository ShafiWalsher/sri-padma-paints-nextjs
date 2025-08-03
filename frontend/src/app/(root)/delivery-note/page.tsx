import { PageActionButtons } from "@/components/shared/page-action-buttons";
import { Suspense } from "react";
import DataLoading from "@/components/shared/data-loading";
import { PlusIcon } from "lucide-react";
import DeliveryNotesTable from "./_components/delivery-notes-table";

export default function DeliveryNotePage() {
  return (
    <>
      <PageActionButtons
        actions={[
          {
            key: "1",
            url: "/delivery-note/new",
            label: "Add Delivery Note",
            color: "black",
            icon: PlusIcon,
          },
        ]}
        className="flex justify-end"
      />

      <Suspense fallback={<DataLoading />}>
        <DeliveryNotesTable />
      </Suspense>
    </>
  );
}
