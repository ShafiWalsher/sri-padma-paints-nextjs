import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReceiptIndianRupee, Wallet } from "lucide-react";
import DeliveryNoteForm from "../_components/delivery-note-form";

const AddDeliveryNotePage = () => {
  return (
    <div>
      <Tabs defaultValue="cash-delivery-note" className="w-full md:w-5/6">
        <TabsList className="w-full bg-black/20 duration-100 h-10 ">
          <TabsTrigger
            className="data-[state=active]:bg-black/60 data-[state=active]:text-white text-black transition-all duration-300 cursor-pointer"
            value="cash-delivery-note"
          >
            {<ReceiptIndianRupee size="5" />}Cash Deliery Note
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-black/60 data-[state=active]:text-white text-black transition-all duration-300 cursor-pointer"
            value="credit-delivery-note"
          >
            {<Wallet size="5" />} Credit Delivery Note
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cash-delivery-note" className="mt-6">
          <h2 className="mb-4">
            Add <span className="text-orange-600">Cash</span> Delivery Note
          </h2>
          <DeliveryNoteForm type="cash" />
        </TabsContent>
        <TabsContent value="credit-delivery-note" className="mt-6">
          <h2 className="mb-4">
            Add <span className="text-orange-600">Credit</span> Delivery Note
          </h2>
          <DeliveryNoteForm type="credit" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddDeliveryNotePage;
