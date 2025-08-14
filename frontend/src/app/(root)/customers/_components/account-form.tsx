"use client";

import { FormInput, FormSelect } from "@/components/form/form-utilities";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  customerAccountFormData,
  customerAccountSchema,
} from "@/schemas/customer-account-schema";
import { customerAccountServices } from "@/services/customer-account-service";
import { customerServices } from "@/services/customer-service";
import { CustomerAccount } from "@/types/customer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface AccountFormProps {
  action: "CREATE" | "EDIT";
  initialAccountData?: CustomerAccount;
  cust_id?: string;
}

interface customerOption {
  value: string;
  label: string;
}

export const AccountForm = ({
  action,
  initialAccountData,
  cust_id,
}: AccountFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [customerOptions, setCustomerOptions] = useState<customerOption[]>([]);

  const form = useForm<customerAccountFormData>({
    resolver: zodResolver(customerAccountSchema),
    defaultValues: initialAccountData
      ? {
          customer_id: String(initialAccountData.customer_id),
          account_name: initialAccountData.account_name,
          balance: String(initialAccountData.balance),
          address: initialAccountData.address ?? "",
          remark: initialAccountData.remark ?? "",
        }
      : {
          customer_id: cust_id ?? "",
          account_name: "",
          balance: "",
          address: "",
          remark: "",
        },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  // fetch customers
  useEffect(() => {
    const loadCustomers = async () => {
      const customersData = await customerServices.getCustomers();
      const customers = customersData.map((item: any) => {
        return {
          value: String(item.id),
          label: item.name,
        };
      });
      setCustomerOptions(customers);
    };
    loadCustomers();
  }, []);

  // Function to handle form submission and call the API endpoint.
  async function onSubmit(data: customerAccountFormData) {
    if (action === "CREATE") {
      await customerAccountServices.createAccount(data);

      reset();
      router.push(`/customers/view?id=${cust_id}`);
      queryClient.invalidateQueries({
        queryKey: ["customer"],
      });
    } else {
      await customerAccountServices.updateAccount(initialAccountData!.id, data);

      reset();
      router.push(`/customers/view?id=${initialAccountData!.customer_id}`);
      queryClient.invalidateQueries({
        queryKey: ["customer"],
      });
    }
  }

  const href = initialAccountData?.customer_id
    ? `/customers/view?id=${initialAccountData.customer_id}`
    : cust_id
    ? `/customers/view?id=${cust_id}`
    : `/customers`;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2">
            <FormSelect
              control={control}
              name="customer_id"
              label="Customers"
              variant="searchable"
              placeholder="Select customer..."
              options={customerOptions}
              selectClassName="bg-white"
              readOnly={!!initialAccountData}
            />
          </div>
          {/* Name Field */}
          <FormInput
            control={control}
            name="account_name"
            label="Name"
            placeholder="Enter your name"
          />

          {/* Address Field */}
          <FormInput
            control={control}
            name="address"
            label="Address"
            placeholder="Enter your address (optional)"
          />
          {/* Balance Field */}
          <FormInput
            control={control}
            name="balance"
            label="Balance"
            type="text"
            placeholder="Enter balance amount"
          />

          {/* Remark Field */}
          <div className="lg:col-span-2">
            <FormInput
              control={control}
              name="remark"
              label="Remark"
              placeholder="Add remark"
            />
          </div>
        </div>

        <div className="flex justify-end mt-10">
          <CardFooter className="p-0">
            <div className="space-x-2">
              <Link href={href} className="secondary-button">
                Cancel
              </Link>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? action === "CREATE"
                    ? "Creating..."
                    : "Updating..."
                  : action === "CREATE"
                  ? "Create Account"
                  : "Update Account"}
              </Button>
            </div>
          </CardFooter>
        </div>
      </form>
    </Form>
  );
};
