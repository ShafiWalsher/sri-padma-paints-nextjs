"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { deliveryNotesServices } from "@/services/delivery-notes-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import BackButton from "@/components/shared/back-button";

export default function DeliveryNoteViewPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data: note } = useQuery({
    enabled: !!id,
    queryKey: ["delivery-note", id],
    queryFn: () => deliveryNotesServices.fetchDeliveryNote(id as string),
  });

  if (!note) return;

  console.log(note);

  const items =
    typeof note.items === "string" ? JSON.parse(note.items) : note.items || [];

  const getBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-400";
      case "complete":
        return "bg-green-100 text-green-800 border border-green-400";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <BackButton />
        <h2 className=" text-black/70">Delivery Note Info</h2>
      </div>
      <article className="m-auto grid grid-cols-1 md:grid-cols-2 gap-16">
        <Card className="p-0 rounded-lg border-[1px] border-border/20 shadow-none gap-0">
          <CardHeader className="!gap-0 bg-gray-100 rounded-t-lg border-b-[1px] border-border/20">
            <CardTitle className="py-2 text-lg font-medium">
              General Information
            </CardTitle>
          </CardHeader>
          <CardContent className="py-4">
            <div className="flex justify-between">
              <div className="grid grid-cols-2 gap-y-1 gap-x-6 self-start">
                <div>Name</div>
                <div>: {note.name}</div>

                <div>Mobile</div>
                <div>: {note.mobile}</div>

                <div>Date</div>
                <div>: {formatDate(note.date)}</div>

                <div>Status</div>
                <div>
                  :
                  <span
                    className={`ms-1 px-2 py-0.5 rounded-md text-xs font-medium first-letter:!uppercase ${getBadgeColor(
                      note.status
                    )}`}
                  >
                    {note.status}
                  </span>
                </div>
              </div>

              <div className="text-right grid grid-cols-2 gap-y-1 gap-x-6 self-start">
                <div>Total Amount :</div>
                <div>{note.total_amount}</div>

                <div>Old Balance :</div>
                <div>{note.old_balance}</div>

                <div>Grand Total :</div>
                <div>{note.grand_total}</div>

                <div>Paid :</div>
                <div>{note.paid}</div>

                <hr className="w-full col-span-2 mt-2  border-t border-border/40" />

                <div>Balance :</div>
                <div className="font-bold text-lg">₹{note.balance}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-0 rounded-lg border-[1px] border-border/20 shadow-none gap-0">
          <CardHeader className="!gap-0 bg-gray-100 rounded-t-lg border-b-[1px] border-border/20">
            <CardTitle className="py-2 text-lg font-medium">
              Particulars Information
            </CardTitle>
          </CardHeader>
          <CardContent className="py-4">
            {items.length === 0 ? (
              <p className="text-muted-foreground">No items found.</p>
            ) : (
              <div className="space-y-3">
                {items.map((item: any, index: number) => (
                  <div key={index} className="flex items-end gap-1">
                    <div className="w-10 text-center">
                      <p className="text-xl font-semibold">{index + 1}.</p>
                    </div>
                    <div className="w-full flex justify-between border border-border/20 p-3 rounded-lg bg-gray-50 text-sm space-y-2">
                      <div className="space-y-2">
                        <p className="font-medium text-lg">{item.item_name}</p>
                        <div className="flex gap-6">
                          {item.color_code && (
                            <p>Color Code: {item.color_code}</p>
                          )}
                          <p>Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p>Price: ₹{item.price}</p>
                        {item.color_price && (
                          <p>Color Price: ₹{item.color_price}</p>
                        )}
                        <p className="mt-4">
                          <span className="text-lg">Total: ₹{item.total}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </article>
    </>
  );
}
