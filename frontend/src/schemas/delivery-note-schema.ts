import { z } from "zod";

/* ───────────────── CREDIT Delivery-Note schema ────────────────── */
export const CreditDeliveryNoteSchema = z
  .object({
    custId: z.string().optional(),
    name: z.string().min(1, "Customer Name is required"),
    mobile: z.string().optional(),
    date: z.string().min(1, "Date is required"),
    particulars: z
      .array(
        z
          .object({
            itemId: z.string(),
            itemName: z.string().min(1, "Item Name is required"),
            price: z.number().positive("Price must be a number"),
            quantity: z.number().positive("Quantity must be a number"),
            color_code: z.string().optional(),
            color_price: z.number().nonnegative().optional(),
            total: z.number().positive("Total must be a number"),
          })
          .strict()
      )
      .superRefine((items, ctx) => {
        items.forEach((it, idx) => {
          if (it.color_code && it.color_price === undefined) {
            ctx.addIssue({
              path: [idx, "color_price"],
              code: "custom",
              message: "Provide price when color code is entered",
            });
          }
        });
      })
      .min(1, "At least one particular is required"),
    grandTotal: z.number().nonnegative("Grand Total must be a number"),
    paid: z.number().nonnegative("Paid Amount must be a number"),
    oldBalance: z.number().nonnegative("Old Balance must be a number"),
    balance: z.number().nonnegative("Balance Amount must be a number"),
  })
  .refine(
    (data) => {
      if (!data.custId) return true; // skip validation if no customer selected
      return /^\d{10}$/.test(data.mobile || "");
    },
    {
      path: ["mobile"],
      message: "Mobile must be 10 digits",
    }
  )
  .superRefine((data, ctx) => {
    const calcBalance = data.oldBalance + data.grandTotal - data.paid;
    if (data.balance !== calcBalance) {
      ctx.addIssue({
        path: ["balance"],
        code: "custom",
        message: `Balance must be old balance + grand total - paid = ${calcBalance}`,
      });
    }
  });

/* Inferred type for the form */
export type CreditDeliveryNoteFormData = z.infer<
  typeof CreditDeliveryNoteSchema
>;

/* ───────────────── CASH Delivery-Note schema ────────────────── */
export const CashDeliveryNoteSchema = z.object({
  name: z.string().min(1, "Customer Name is required"),
  mobile: z
    .string()
    .regex(/^\d{10}$/, { message: "Mobile must be 10 digits" })
    .optional(),
  date: z.string().min(1, "Date is required"),
  particulars: z
    .array(
      z
        .object({
          itemId: z.string(),
          itemName: z.string().min(1, "Item Name is required"),
          price: z.number().positive("Price is required"),
          quantity: z.number().positive("Quantity is required"),
          color_code: z.string().optional(),
          color_price: z.number().nonnegative().optional(),
          total: z.number().positive("Total must be a number"),
        })
        .strict()
    )
    .superRefine((items, ctx) => {
      items.forEach((it, idx) => {
        if (it.color_code && it.color_price === undefined) {
          ctx.addIssue({
            path: [idx, "color_price"],
            code: "custom",
            message: "Provide price when color code is entered",
          });
        }
      });
    })
    .min(1, "At least one particular is required"),
  grandTotal: z.number().nonnegative("Grand Total must be a number"),
});

export type CashDeliveryNoteFormData = z.infer<typeof CashDeliveryNoteSchema>;
