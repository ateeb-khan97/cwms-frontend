export interface TransferDetailType {
  product_id: number;
  product_name: string;
  sku_child: string;
  transfer_id: number;
}
export default interface TransferType {
  expected_arrival_date: Date;
  id: number;
  location_from: string;
  location_to: string;
  stock_receive_date?: string;
  transfer_detail: TransferDetailType[];
  transfer_status: string;
}
