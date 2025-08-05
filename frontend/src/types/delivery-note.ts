export interface DeliveryNoteItem {
  item_id: number;
  item_name: string;
  quantity: number;
  price: number;
  total: number;
  color_code: string;
  color_price: number;
}

export interface DeliveryNote {
  id: number;
  cust_id: number | null;
  name: string;
  mobile: string;
  date: string;
  items: DeliveryNoteItem[];
  total_amount: number;
  old_balance: number;
  grand_total: number;
  paid: number;
  balance: number;
  status: "pending" | "completed" | string;
  del: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}
