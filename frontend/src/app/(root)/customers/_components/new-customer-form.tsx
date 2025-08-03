"use client";

import { FormInput } from "@/components/form/form-utilities";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Form } from "@/components/ui/form"; // Import the Form component from shadcn/ui
import { CustomerFormData, customerSchema } from "@/schemas/customer-schema";
import { customerServices } from "@/services/customer-service";
import { CustomerPayload } from "@/types/customer";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export const NewCustomerForm = () => {
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      mobile: "",
      address: "",
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

  const router = useRouter();

  // Function to handle form submission and call the API endpoint.
  async function onSubmit(data: CustomerPayload) {
    await customerServices.createCustomer(data);
    reset();
    router.push("/customers");
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <FormInput
          control={control}
          name="name"
          label="Name"
          placeholder="Enter your name"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 space-x-4">
          {/* Mobile Field */}
          <FormInput
            control={control}
            name="mobile"
            label="Mobile"
            placeholder="Enter your mobile number"
          />

          {/* Address Field */}
          <FormInput
            control={control}
            name="address"
            label="Address"
            placeholder="Enter your address (optional)"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 space-x-4">
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
                {isSubmitting ? "Submitting..." : "Create User"}
              </Button>
            </div>
          </CardFooter>
        </div>
      </form>
    </Form>
  );
};
