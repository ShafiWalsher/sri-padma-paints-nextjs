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
  customer_account_id: number;
  customer_name: string;
  customer_mobile: string;
  date: string;
  payment_type: string;
  subtotal: number;
  discount_percent: number;
  discount_amount: number;
  total_amount: number;
  status: "pending" | "completed" | string;
  items: DeliveryNoteItem[];
}
