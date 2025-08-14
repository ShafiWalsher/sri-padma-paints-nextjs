export interface Customer {
  id: string;
  name: string;
  mobile: string;
  address?: string;
  default_account_name: string;
  total_balance: string;
  accounts_count: string;
  created_at: string;
}

export interface CustomerAccount {
  id: string;
  customer_id: string;
  account_name: string;
  address?: string;
  balance: string;
  is_default: number;
  remark?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerDetails {
  customer: Customer;
  accounts: CustomerAccount[];
  default_account: CustomerAccount;
  total_balance: number;
  accounts_count: number;
}
