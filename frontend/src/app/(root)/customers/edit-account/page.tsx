"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BackButton from "@/components/shared/back-button";
import { AccountForm } from "../_components/account-form";
import { useSearchParams } from "next/navigation";
import { customerAccountServices } from "@/services/customer-account-service";
import { useEffect, useState } from "react";
import { CustomerAccount } from "@/types/customer";

const EditCustomerAccountPage = () => {
  const searchParams = useSearchParams();
  const accountId = searchParams.get("id") ?? "";

  const [accountData, setAccountData] = useState<CustomerAccount>();

  useEffect(() => {
    const loadData = async () => {
      const data = await customerAccountServices.getAccount(accountId);

      setAccountData(data);
    };
    loadData();
  }, [accountId]);

  if (!accountData) return null;

  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <BackButton />
        <div className="flex flex-col -space-y-1">
          <h2 className=" text-black/70">Edit Account</h2>
          <p className="text-sm text-gray-500">{accountData.account_name}</p>
        </div>
      </div>
      <Card className="w-full md:w-1/2 !h-fit border-[1px] border-border/20 shadow-none p-0 overflow-hidden gap-2">
        <CardHeader className="bg-gray-50 p-0 border-b-[1px] border-border/40 gap-0">
          <CardTitle className="text-xl m-0 p-2 px-4">
            Account Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <AccountForm action="EDIT" initialAccountData={accountData} />
        </CardContent>
      </Card>
    </>
  );
};

export default EditCustomerAccountPage;
