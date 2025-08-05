import z from "zod";

export const vendorSchema = z.object({
  vendor_name: z.string().min(1, "Vendor name is required"),
  mobile: z.string().regex(/^\d{10}$/, { message: "Mobile must be 10 digits" }),
  email: z.email("Invalid email format").or(z.literal("")).optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  gst_number: z.string().optional(),
});

export type VendorFormData = z.infer<typeof vendorSchema>;
