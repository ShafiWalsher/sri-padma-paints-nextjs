import axioInstance from "@/lib/axios";
import { Product } from "@/types/product";

async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await axioInstance.get<{
      success: boolean;
      data: Product[];
    }>("/products/getAllProducts.php");
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error("Failed to load products");
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch products");
  }
}

export const productServices = {
  fetchProducts,
};
