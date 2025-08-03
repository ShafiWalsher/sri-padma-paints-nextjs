export interface DeliveryNoteItem {
  item_id: string;
  item_name: string;
  quantity?: number;
  rate?: number;
  total: number;
}

export interface DeliveryNote {
  id: number;
  cust_id: number | null;
  name: string;
  mobile: string;
  date: string; // ISO date: "YYYY-MM-DD"
  items: DeliveryNoteItem[]; // parsed JSON array
  total_amount: number;
  old_balance: number;
  grand_total: number;
  paid: number;
  balance: number;
  status: "pending" | "paid" | string;
  del: number; // 0 or 1
  created_by: string | null;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}
