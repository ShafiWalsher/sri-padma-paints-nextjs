export interface Vendor {
  id: string;
  vendor_name: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  mobile?: string;
  email?: string;
  gst_number?: string;
}

export interface VendorPayload {
  vendor_name: string;
  mobile?: string;
  email?: string;
  city?: string;
  address?: string;
  gst_number?: string;
}
