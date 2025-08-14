import axioInstance from "@/lib/axios";
import { CustomerFormData } from "@/schemas/customer-schema";
import type { Customer, CustomerDetails } from "@/types/customer";

async function getCustomers(): Promise<Customer[]> {
  const { data: response } = await axioInstance.get(
    "/customers/getCustomers.php"
  );
  return response.data;
}

async function getCustomer(customerId: string): Promise<Customer> {
  const { data: response } = await axioInstance.get(
    `/customers/getCustomer.php?customer_id=${customerId}`
  );
  return response.data;
}

async function createCustomer(payload: CustomerFormData) {
  const { data: response } = await axioInstance.post(
    "/customers/createCustomer.php",
    payload
  );
  return response.data;
}

async function updateCustomer(customerId: string, payload: CustomerFormData) {
  const { data: response } = await axioInstance.post(
    "/customers/updateCustomer.php",
    {
      customer_id: customerId,
      ...payload,
    }
  );
  return response.data;
}

async function getCustomerDetails(
  customerId: string
): Promise<CustomerDetails> {
  const { data: response } = await axioInstance.get(
    `/customers/getCustomerDetails.php?customer_id=${customerId}`
  );
  return response.data;
}

async function deleteCustomer(customerId: string) {
  const { data: response } = await axioInstance.post(
    "/customers/deleteCustomer.php",
    {
      customer_id: customerId,
    }
  );
  return response.data;
}

export const customerServices = {
  getCustomers,
  getCustomer,
  createCustomer,
  getCustomerDetails,
  updateCustomer,
  deleteCustomer,
};
