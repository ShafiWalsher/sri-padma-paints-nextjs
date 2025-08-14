"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { deliveryNotesServices } from "@/services/delivery-notes-service";
import { formatDate } from "@/lib/utils";
import { APP_ADDRESS, APP_NAME } from "@/constants";
import BackButton from "@/components/shared/back-button";
import PrintAndPdfButtons from "@/components/shared/print-and-pdf";

export default function DeliveryNotePrintPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data: note } = useQuery({
    enabled: !!id,
    queryKey: ["delivery-note", id],
    queryFn: () => deliveryNotesServices.fetchDeliveryNote(id as string),
  });

  if (!note) return;

  const items =
    typeof note.items === "string" ? JSON.parse(note.items) : note.items || [];

  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <BackButton />
        <h2 className=" text-black/70">
          Print Delivery Note{" "}
          <span className="text-orange-600">ID: #{note.id}</span>
        </h2>
        <PrintAndPdfButtons
          contentId="delivery-note-content"
          fileName="DeliveryNote"
        />
      </div>
      <div
        id="delivery-note-content"
        className="max-w-5xl bg-white p-8 rounded-lg shadow print:shadow-none border-[2px] border-border/60 text-sm"
      >
        {/* Brand Header */}
        <header className="border-b pb-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-extrabold tracking-wide">
                {APP_NAME}
              </h1>
              <p
                className="whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: APP_ADDRESS }}
              />
            </div>
            <div className="text-right">
              <h2 className="text-xl font-semibold text-black/70">
                Delivery Note
              </h2>
              <p className="text-muted-foreground">ID: #{note.id}</p>
              <p className="text-muted-foreground">
                Date: {formatDate(note.date)}
              </p>
            </div>
          </div>
        </header>

        {/* Customer Info */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            Customer Information
          </h3>
          <div className="grid grid-cols-2 gap-y-1 gap-x-8">
            <p>
              <span className="font-medium">Name:</span> {note.name}
            </p>
            <p>
              <span className="font-medium">Mobile:</span> {note.mobile}
            </p>
          </div>
        </section>

        {/* Items Table */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            Item Details
          </h3>
          <div className="overflow-hidden border rounded-md">
            <table className="w-full border-collapse text-left">
              <thead className="bg-gray-100 text-gray-700 text-sm">
                <tr>
                  <th className="p-3 border-r">#</th>
                  <th className="p-3 border-r">Item</th>
                  <th className="p-3 border-r">Qty</th>
                  <th className="p-3 border-r">Price</th>
                  <th className="p-3 border-r">Color Code</th>
                  <th className="p-3 border-r">Color Price</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any, index: number) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="p-3 border-r">{index + 1}</td>
                    <td className="p-3 border-r">{item.item_name}</td>
                    <td className="p-3 border-r">{item.quantity}</td>
                    <td className="p-3 border-r">₹{item.price}</td>
                    <td className="p-3 border-r">{item.color_code || "-"}</td>
                    <td className="p-3 border-r">
                      {item.color_price ? `₹${item.color_price}` : "-"}
                    </td>
                    <td className="p-3 text-right font-semibold">
                      ₹{item.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Payment Summary */}
        <section className="grid grid-cols-2 border-t pt-6">
          <div />
          <div className="space-y-2 text-right text-sm">
            <p>
              <span className="font-semibold">Total Amount:</span> ₹
              {note.total_amount}
            </p>
            <p>
              <span className="font-semibold">Grand Total:</span> ₹
              {note.grand_total}
            </p>
            <p>
              <span className="font-semibold">Paid:</span> ₹{note.paid}
            </p>
            <p className="text-lg font-bold">Balance: ₹{note.balance}</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-muted-foreground">
          ವಿಶೇಷ ಸೂಚನೆ: ಚೆಕ್ ಇಲ್ಲದ ಪಾವತಿಯನ್ನು ಮಾತ್ರವೇ ನಾವು ಸ್ವೀಕರಿಸುತ್ತೇವೆ.
        </footer>
      </div>
    </>
  );
}
