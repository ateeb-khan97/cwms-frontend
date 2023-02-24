type ConversionType = {
  id: number;
  item_conversion: string;
  product_id: number;
  selling_unit: string;
  sorting: number;
  type: 'C' | 'B' | 'P';
};
export type ProductType = {
  bar_code?: string;
  categories?: any[];
  comment?: string;
  created_at: string;
  discount_type?: string;
  discounted_price?: string;
  dosage_instruction?: string;
  drap_id?: string;
  id: number;
  item_nature?: string;
  item_release_level?: string;
  item_storage_location?: string;
  item_tracking_level?: string;
  manufacturer?: any;
  manufacturer_id: number;
  margin?: string;
  maximum_retail_price?: string;
  minimum_retail_price?: string;
  mrp_unit_price?: string;
  prescription_required?: boolean;
  price_levels?: string;
  product_conversions?: ConversionType[];
  product_generic_formulas?: any[];
  product_lifecycle?: string;
  product_name: string;
  product_tags?: any[];
  purchasing_price?: string;
  purchasing_unit?: string;
  quantity?: string;
  sales_tax_group?: string;
  sales_tax_percentage?: string;
  selling_discount?: string;
  side_effects?: string;
  sku_department?: string;
  sku_description?: string;
  sku_maximum_level?: string;
  sku_minimum_level?: string;
  sku_reorder_level?: string;
  sku_warehouse_lead_time?: string;
  status: boolean;
  stock_nature?: string;
  tax_code?: string;
  trade_discount?: string;
  trade_price?: string;
  updated_at: string;
  vendors?: any[];
};
