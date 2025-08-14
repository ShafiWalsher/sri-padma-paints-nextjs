"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerForm } from "../_components/customer-form";
import BackButton from "@/components/shared/back-button";
import { useSearchParams } from "next/navigation";
import { customerServices } from "@/services/customer-service";
import { useQuery } from "@tanstack/react-query";

const EditCustomerPage = () => {
  const searchParams = useSearchParams();
  const customerId = searchParams.get("id");

  const { data: customer } = useQuery({
    queryKey: ["customer_edit", customerId],
    queryFn: () => customerServices.getCustomer(customerId as string),
  });

  if (!customer) return null;

  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <BackButton />
        <h2 className=" text-black/70">Update Customer Details</h2>
      </div>
      <Card className="w-full md:w-1/2 !h-fit border-[1px] border-border/20 shadow-none p-0 overflow-hidden gap-2">
        <CardHeader className="bg-gray-50 p-0 border-b-[1px] border-border/40 gap-0">
          <CardTitle className="text-xl m-0 p-2 px-4">
            Customer Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <CustomerForm
            key={customerId}
            action="EDIT"
            initialCustomerData={customer}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default EditCustomerPage;
