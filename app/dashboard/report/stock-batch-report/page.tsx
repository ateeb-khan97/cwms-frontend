import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
import StockBatchTable from './StockBatchTable';
import prisma from 'config/prisma';
import { cookies } from 'next/headers';

function Header() {
  return (
    <header className="select-none text-[#3b3e66]">
      <BreadcrumbComponent />
      <h1 className="text-3xl font-semibold ">Stock Batch Report</h1>
      <p>Please see Stock Batch Report below all connected channels</p>
    </header>
  );
}
//
async function getTableData() {
  'use server';
  await prisma.$queryRawUnsafe('SET SQL_MODE = "";');
  const loc = cookies().get('loc_no')?.value;
  const type = cookies().get('type')?.value;
  //
  const userQuery = ` WHERE ind.location_id = ${loc} AND ind.bin_id IS NOT NULL AND ind.is_received = 1 GROUP BY ind.product_id, isku.batch_number, ind.location_id;`;
  const adminQuery = ` WHERE ind.bin_id IS NOT NULL AND ind.is_received = 1 GROUP BY ind.product_id, isku.batch_number, ind.location_id;`;

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
  (SUM(ind.third_level)) AS total_inventory,
  loc.loc_name,
  p.mrp_unit_price
from
  inward_detail ind
LEFT JOIN inward_sku isku ON
  isku.product_id = ind.product_id
  AND isku.inward_id = ind.inward_id
LEFT JOIN products p ON
  p.id = ind.product_id
LEFT JOIN locations loc ON
  loc.loc_code = ind.location_id
${type == 'admin' ? adminQuery : userQuery}`)) as any[];
}
//
export default function Page() {
  return (
    <>
      <section className="flex min-h-[100%] flex-col gap-10 p-7">
        <Header />
        <div className="rounded-md border border-gray-100 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b-[1px] p-5">
            <p className="py-2 font-semibold text-gray-500">
              Here you can manage your all Stock Batch Report!
            </p>
          </div>
          <StockBatchTable getTableData={getTableData} />
        </div>
      </section>
    </>
  );
}
