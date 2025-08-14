import { z } from "zod";

export const customerSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Mobile must be 10 digits" }),
  address: z.string().optional(),
  account_name: z
    .string()
    .min(3, { message: "Account name must be at least 3 characters long" })
    .optional(),
  balance: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (val === undefined || val === "") return true;
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0;
      },
      { message: "Balance must be a non-negative number" }
    ),
  remark: z.string().optional(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
