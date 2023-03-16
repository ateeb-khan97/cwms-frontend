export type CategoryType = {
  category_description?: string;
  category_image_url?: string;
  category_level: 'Parent Level' | 'Sub Level';
  category_name: string;
  child?: [];
  created_at: string;
  id: number;
  parent_id?: null;
  products?: [];
  sorting?: number;
  status: boolean;
  updated_at: string;
};
//
