import axioInstance from "@/lib/axios";
import type { Customer, CustomerPayload } from "@/types/customer";

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

async function createCustomer(payload: CustomerPayload) {
  const response = await axioInstance.post(
    "/customer/createCustomer.php",
    payload
  );
  return response.data;
}

// Export all auth-related functions
export const customerServices = {
  fetchCustomers,
  createCustomer,
};
