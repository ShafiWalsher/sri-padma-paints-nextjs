"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/shared/data-table";
import { useDNColumns } from "../delvert-note-columns";
import { deliveryNotesServices } from "@/services/delivery-notes-service";

export default function DeliveryNotesTable() {
  const { data } = useSuspenseQuery({
    queryKey: ["deliveryNotes"],
    queryFn: deliveryNotesServices.getDeliveryNotes,
  });

  const columns = useDNColumns();

  return (
    <DataTable
      columns={columns}
      data={data || []}
      searchableItems={["customer_name", "customer_mobile"]}
      searchPlaceHolder="Search for a user or mobile"
      initialPageSize={50}
    />
  );
}
