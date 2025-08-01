export interface Customer {
  id: string;
  name: string;
  mobile: number;
  address: string;
  balance: string;
}

export interface CustomerPayload {
  name: string;
  mobile: string;
  address?: string;
  balance?: string;
  remark?: string;
}
