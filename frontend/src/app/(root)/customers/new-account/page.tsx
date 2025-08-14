"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BackButton from "@/components/shared/back-button";
import { AccountForm } from "../_components/account-form";
import { useSearchParams } from "next/navigation";

const NewCustomerAccountPage = () => {
  const searchParams = useSearchParams();
  const customerId = searchParams.get("cust_id");

  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <BackButton
          overridePath={`${
            customerId ? `/customers/view?id=${customerId}` : `/customers`
          }`}
        />
        <h2 className=" text-black/70">Create New Account</h2>
      </div>
      <Card className="w-full md:w-1/2 !h-fit border-[1px] border-border/20 shadow-none p-0 overflow-hidden gap-2">
        <CardHeader className="bg-gray-50 p-0 border-b-[1px] border-border/40 gap-0">
          <CardTitle className="text-xl m-0 p-2 px-4">
            Account Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <AccountForm action="CREATE" cust_id={customerId ?? ""} />
        </CardContent>
      </Card>
    </>
  );
};

export default NewCustomerAccountPage;
