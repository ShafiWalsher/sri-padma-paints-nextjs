"use client";

import { FormInput } from "@/components/form/form-utilities";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import { CustomerFormData, customerSchema } from "@/schemas/customer-schema";
import { customerServices } from "@/services/customer-service";
import { Customer } from "@/types/customer";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface CustomerFormProps {
  action: "CREATE" | "EDIT";
  initialCustomerData?: Customer;
}

export const CustomerForm = ({
  action,
  initialCustomerData,
}: CustomerFormProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: initialCustomerData
      ? {
          name: initialCustomerData.name,
          mobile: initialCustomerData.mobile,
          address: initialCustomerData.address ?? "",
          account_name: "",
          balance: "",
          remark: "",
        }
      : {
          name: "",
          mobile: "",
          address: "",
          account_name: "Main Account",
          balance: "",
          remark: "",
        },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  // Function to handle form submission and call the API endpoint.
  async function onSubmit(data: CustomerFormData) {
    if (action === "CREATE") {
      await customerServices.createCustomer(data);
    } else {
      await customerServices.updateCustomer(initialCustomerData!.id, data);
    }

    reset();
    router.push("/customers");
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name Field */}
          <div className={`${action !== "CREATE" && "col-span-2"}`}>
            <FormInput
              control={control}
              name="name"
              label="Name"
              placeholder="Enter your name"
            />
          </div>

          {/* Account Name Field */}
          {action === "CREATE" && (
            <FormInput
              control={control}
              name="account_name"
              label="Default Account Name"
              placeholder="Enter account name"
            />
          )}

          {/* Mobile Field */}
          <FormInput
            control={control}
            name="mobile"
            label="Mobile"
            placeholder="Enter your mobile number"
            readOnly={!isAdmin}
          />

          {/* Address Field */}
          <FormInput
            control={control}
            name="address"
            label="Address"
            placeholder="Enter your address (optional)"
          />
        </div>

        {action === "CREATE" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Balance Field */}
            <FormInput
              control={control}
              name="balance"
              label="Balance"
              type="number"
              placeholder="Enter balance amount"
            />

            {/* Remark Field */}
            <FormInput
              control={control}
              name="remark"
              label="Remark"
              placeholder="Add remark"
            />
          </div>
        )}

        <div className="flex justify-end mt-10">
          <CardFooter className="p-0">
            <div className="space-x-2">
              <Link href="/customers" className="secondary-button">
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
                  ? "Create Customer"
                  : "Update Customer"}
              </Button>
            </div>
          </CardFooter>
        </div>
      </form>
    </Form>
  );
};
