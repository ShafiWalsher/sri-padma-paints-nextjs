import { z } from "zod";

// Particular item schema
const ParticularSchema = z.object({
  item_id: z.number().nullable(),
  item_name: z.string().min(1, "Product name is required"),
  quantity: z.number().nonnegative("Quantity must be positive"),
  price: z.number().nonnegative("Price must be positive"),
  color_code: z.string().optional(),
  color_price: z.number().nonnegative().optional(),
  total: z.number().positive("Total must be positive"),
});

// Base delivery note fields
export const DeliveryNoteSchema = z
  .object({
    type: z.enum(["cash", "credit"]),
    cust_id: z.number().nullable(),
    account_id: z.number().nullable(),
    name: z.string().min(1, "Customer name is required"),
    mobile: z
      .string()
      .regex(/^\d{10}$/, { message: "Mobile number must be exactly 10 digits" })
      .optional()
      .or(z.literal("")),
    date: z.string().min(1, "Date is required"),
    items: z.array(ParticularSchema).min(1, "At least one item required"),
    subtotal: z.number().nonnegative(),
    discount_percent: z.number().min(0).max(20),
    discount_amount: z.number().nonnegative(),
    total_amount: z.number().nonnegative(),
  })
  .refine(
    (data) => {
      if (data.type === "credit") {
        return data.cust_id !== null && data.account_id !== null;
      }
      return true;
    },
    {
      message: "Customer and Account are required for credit delivery notes",
      path: ["account_id"],
    }
  );

export type DeliveryNoteFormData = z.infer<typeof DeliveryNoteSchema>;
