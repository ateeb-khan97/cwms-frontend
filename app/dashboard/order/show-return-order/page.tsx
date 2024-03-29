import ShowReturnOrder from 'components/Order/show-return-order';
import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
import prisma from 'config/prisma';

function Header() {
  return (
    <header className="select-none text-[#3b3e66]">
      <BreadcrumbComponent />
      <h1 className="text-3xl font-semibold ">Return Order List</h1>
      <p>Please see Return Order List below all connected channels</p>
    </header>
  );
}

async function getTableData() {
  'use server';
  await prisma.$queryRawUnsafe(`set sql_mode = "";`);
  return prisma.$queryRawUnsafe(
    'select ro.id as return_id, ro.customerOrderId, ro.orderId, id.product_id, is2.product_name, CAST(COUNT(*) as CHAR) as quantity, group_concat(distinct ro.skuChild) as skuChilds from `return-order` ro left join inward_detail id on id.inward_child = ro.skuChild left join inward_sku is2 on is2.inward_id = id.inward_id group by is2.po_id;',
  );
}
//
export default function Page() {
  return (
    <section className="flex min-h-[100%] flex-col gap-10 p-7">
      <Header />
      <div className="rounded-md border border-gray-100 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b-[1px] p-5">
          <p className="py-2 font-semibold text-gray-500">
            Here you can manage your all Show Return Order!
          </p>
        </div>
        <ShowReturnOrder getTableData={getTableData} />
      </div>
    </section>
  );
}
