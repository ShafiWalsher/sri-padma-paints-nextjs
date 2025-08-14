import axioInstance from "@/lib/axios";
import { ProductFormData } from "@/schemas/product-schema";
import { Product } from "@/types/product";

async function createProduct(payload: ProductFormData) {
  const { data: response } = await axioInstance.post(
    "/products/createProduct.php",
    payload
  );
  return response.data;
}

async function getProducts(): Promise<Product[]> {
  const { data: response } = await axioInstance.get(
    "/products/getAllProducts.php"
  );
  return response.data;
}

export const productServices = {
  createProduct,
  getProducts,
};
