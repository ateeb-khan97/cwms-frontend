import ShowProductPage from 'components/Products/ShowProductPage';
import prisma from 'config/prisma';
//
async function getDownloadData() {
  'use server';
  await prisma.$queryRawUnsafe(`set sql_mode = "";`);
  return (await prisma.$queryRawUnsafe(`select group_concat(distinct v.vendor_name SEPARATOR ';') as vendor_names, group_concat(distinct c.category_name SEPARATOR ';') as category_names, p.* from products p left join manufacturers m on m.id = p.manufacturer_id 
  left join product_vendor pv on pv.product_id = p.id 
  left join vendors v on v.id = pv.vendor_id 
  left join product_category pc on pc.product_id = p.id 
  left join categories c on c.id = pc.category_id 
  group by p.id;`)) as any[];
}
//
export default function Page() {
  return <ShowProductPage getDownloadData={getDownloadData} />;
}
