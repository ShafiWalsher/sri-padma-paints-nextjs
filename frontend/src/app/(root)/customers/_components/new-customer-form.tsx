"use client";

import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CustomerFormData, customerSchema } from "@/schemas/customer-schema";
import { customerServices } from "@/services/customer-service";
import { CustomerPayload } from "@/types/customer";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export const NewCustomerForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      mobile: "",
      address: "",
    },
  });

  const router = useRouter();

  // Function to handle form submission and call the API endpoint.
  async function onSubmit(data: CustomerPayload) {
    await customerServices.createCustomer(data);
    reset();
    router.push("/customers");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={"space-y-4"}>
      {/* Name Field */}
      <div className="space-y-1">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} placeholder="Enter your name" />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 space-x-4">
        {/* Mobile Field */}
        <div className="space-y-1">
          <Label htmlFor="mobile">Mobile</Label>
          <Input
            id="mobile"
            {...register("mobile")}
            placeholder="Enter your mobile number"
          />
          {errors.mobile && (
            <p className="text-red-600 text-sm mt-1">{errors.mobile.message}</p>
          )}
        </div>

        {/* Address Field */}
        <div className="space-y-1">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            {...register("address")}
            placeholder="Enter your address (optional)"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 space-x-4">
        {/* balance Field */}
        <div className="space-y-1">
          <Label htmlFor="balance">Balance</Label>
          <Input
            id="balance"
            {...register("balance")}
            placeholder="Enter balance amount"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="remark">Remark</Label>
          <Input id="remark" {...register("remark")} placeholder="Add remark" />
        </div>
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
              className="disabled:bg-gray-400 disabled:cursor-not-allowed "
            >
              {isSubmitting ? "Submitting..." : "Create User"}
            </Button>
          </div>
        </CardFooter>
      </div>
    </form>
  );
};
