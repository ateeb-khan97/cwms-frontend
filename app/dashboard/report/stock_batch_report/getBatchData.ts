'use server';

import prisma from 'config/prisma';
import { cookies } from 'next/headers';
//
type TableType = {
  product_id: string;
  batch_number: string;
  manufacturer_name: string;
  category_name: string;
  product_name: string;
  item_conversion: string;
  total_inventory: string;
  loc_name: string;
  purchasing_price: string;
  total_purchasing_price: string;
  trade_price: string;
  mrp_unit_price: string;
  tax_code: string;
  aging_time: string;
  second_level: string;
};
//
export default async function getBatchData() {
  await prisma.$queryRawUnsafe('SET SQL_MODE = "";');
  const loc = cookies().get('loc_no')?.value;
  const type = cookies().get('type')?.value;
  //
  const userQuery = ` WHERE ind.location_id = ${loc} AND ind.bin_id IS NOT NULL AND ind.is_received = 1 GROUP BY ind.product_id, isku.batch_number, ind.location_id;`;
  const adminQuery = ` WHERE ind.bin_id IS NOT NULL AND ind.is_received = 1 GROUP BY ind.product_id, isku.batch_number, ind.location_id;`;
  //
  return (await prisma.$queryRawUnsafe(`SELECT ind.product_id, isku.batch_number, (SELECT manufacturer_name FROM manufacturers LEFT JOIN products ON
    products.manufacturer_id = manufacturers.id WHERE products.id = ind.product_id) AS manufacturer_name,
  (SELECT group_concat(category_name)
  FROM
    product_category
  LEFT JOIN categories ON
    product_category.category_id = categories.id
  WHERE
    product_category.product_id = ind.product_id) AS category_name,
  p.product_name,
  ind.third_level as item_conversion,
  (SUM(ind.second_level)) AS second_level,
  (SUM(ind.third_level)) AS total_inventory,
  loc.loc_name,
  p.purchasing_price,
  (COUNT(ind.inward_id)) * p.purchasing_price AS total_purchasing_price,
  p.trade_price,
  p.mrp_unit_price,
  p.tax_code,
  (
  SELECT
    updated_at
  from
    grn
  WHERE
    product_id = ind.product_id
    AND grn.location_id = ind.location_id
  ORDER BY
    id
  LIMIT 0,
  1) AS aging_time
from
  inward_detail ind
LEFT JOIN inward_sku isku ON
  isku.product_id = ind.product_id
  AND isku.inward_id = ind.inward_id
LEFT JOIN products p ON
  p.id = ind.product_id
LEFT JOIN locations loc ON
  loc.loc_code = ind.location_id
${type == 'admin' ? adminQuery : userQuery}`)) as TableType[];
}
