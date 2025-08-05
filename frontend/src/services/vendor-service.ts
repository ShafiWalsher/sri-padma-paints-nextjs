import axioInstance from "@/lib/axios";
import { VendorFormData } from "@/schemas/vendor-schema";
import { Vendor } from "@/types/vendor";

async function createVendor(payload: VendorFormData) {
  const response = await axioInstance.post(
    "/vendors/createVendor.php",
    payload
  );
  return response.data;
}

async function fetchVendors(): Promise<Vendor[]> {
  try {
    const response = await axioInstance.get<{
      success: boolean;
      data: Vendor[];
    }>("/vendors/getAllVendors.php");
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error("Failed to load products");
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch products");
  }
}

export const vendorServices = {
  createVendor,
  fetchVendors,
};
