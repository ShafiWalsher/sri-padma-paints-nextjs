import axioInstance from "@/lib/axios";
import { CustomerFormData } from "@/schemas/customer-schema";
import type { Customer } from "@/types/customer";

async function fetchCustomers(): Promise<Customer[]> {
  try {
    const response = await axioInstance.get<{
      success: boolean;
      data: Customer[];
    }>("/customer/getAllCustomers.php");
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error("Failed to load customers");
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch customers");
  }
}

async function createCustomer(payload: CustomerFormData) {
  const response = await axioInstance.post(
    "/customer/createCustomer.php",
    payload
  );
  return response.data;
}

export const customerServices = {
  fetchCustomers,
  createCustomer,
};
