import { z } from "zod";

export const customerSchema = z.object({
  name: z
    .string()
    .min(5, { message: "Name must be at least 5 characters long" }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Mobile must be 10 digits" }),
  address: z.string().optional(),
  balance: z.string().optional(),
  remark: z.string().optional(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
