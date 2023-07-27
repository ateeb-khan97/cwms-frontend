export default interface GoodReceiveType {
  vendor_name: string;
  payment_terms: string;
  po_id: string;
  po_date: string;
  delivery_location: string;
  delivery_date: string;
  inward_date: string;
  product_name: string;
  received_quantity: string;
  maximum_retail_price: string;
  trade_price: string;
  discount_percentage: string;
  batch_number: string;
  batch_expiry: string;
  foc: boolean;
  purchasing_price: string;
  advance_income_tax: string;
  gst_rate: string;
}
