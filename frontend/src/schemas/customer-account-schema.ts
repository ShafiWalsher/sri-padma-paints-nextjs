import z from "zod";

export const customerAccountSchema = z.object({
  customer_id: z.string(),
  account_name: z.string().min(3, "Account name must be at least 3 characters"),
  address: z.string().optional(),
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

export type customerAccountFormData = z.infer<typeof customerAccountSchema>;
