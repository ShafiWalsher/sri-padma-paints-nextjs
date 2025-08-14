import { z } from "zod";

// Schema for a single product
export const productSchema = z.object({
  vendor_id: z.string(),
  vendor_name: z.string().optional(),
  product_name: z.string().min(1, "Product name is required"),
  color: z.string().min(1, "Color is required"),
  item_price: z.number().min(0, "Item price must be non-negative"),
  quantity: z.number().min(0, "Quantity must be non-negative"),
  package: z.string().optional(),
});

// Schema for multiple products
export const multiProductSchema = z.object({
  products: z.array(productSchema).min(1, "At least one product is required"),
});

// Inferred TypeScript type
export type ProductFormData = z.infer<typeof multiProductSchema>;
