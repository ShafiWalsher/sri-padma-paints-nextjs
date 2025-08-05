"use client";

import { FormInput } from "@/components/form/form-utilities";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { vendorServices } from "@/services/vendor-service";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { VendorFormData, vendorSchema } from "@/schemas/vendor-schema";

export const NewVendorForm = () => {
  const form = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      vendor_name: "",
      mobile: "",
      email: "",
      city: "",
      address: "",
      gst_number: "",
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  const router = useRouter();

  /* Submit handler */
  async function onSubmit(data: VendorFormData) {
    await vendorServices.createVendor(data);
    reset();
    router.replace("/vendors");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Vendor Name */}
        <FormInput
          control={control}
          name="vendor_name"
          label="Vendor Name"
          placeholder="Enter vendor name"
        />

        {/* Two-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            control={control}
            name="mobile"
            label="Mobile"
            placeholder="Enter mobile number"
          />

          <FormInput
            control={control}
            name="email"
            label="Email (optional)"
            type="email"
            placeholder="Enter email address"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            control={control}
            name="city"
            label="City (optional)"
            placeholder="Enter city"
          />

          <FormInput
            control={control}
            name="address"
            label="Address (optional)"
            placeholder="Enter address"
          />
        </div>

        {/* GST Number */}
        <FormInput
          control={control}
          name="gst_number"
          label="GST Number (optional)"
          placeholder="Enter GST number"
        />

        {/* Footer: Cancel / Submit */}
        <div className="flex justify-end mt-10">
          <CardFooter className="p-0">
            <div className="space-x-2">
              <Link href="/vendors" className="secondary-button">
                Cancel
              </Link>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Create Vendor"}
              </Button>
            </div>
          </CardFooter>
        </div>
      </form>
    </Form>
  );
};
