"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/shared/data-table";
import { useColumns } from "../delvert-note-columns";
import { deliveryNotesServices } from "@/services/delivery-notes-service";

export default function DeliveryNotesTable() {
  const { data } = useSuspenseQuery({
    queryKey: ["deliveryNotes"],
    queryFn: deliveryNotesServices.fetchDeliveryNotes,
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
