import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
import prisma from 'config/prisma';
import { cookies } from 'next/headers';
import SkuChildReport from 'components/Report/SkuChildReport';
//
function Header() {
  return (
    <header className="select-none text-[#3b3e66]">
      <BreadcrumbComponent />
      <h1 className="text-3xl font-semibold ">SKU Child Report</h1>
      <p>Please see SKU Child Report below all connected channels</p>
    </header>
  );
}
//
interface IPropType {
  params: {};
  searchParams?: { search?: string };
}
//
async function getTableData() {
  'use server';
  //
  const [{count}] = await prisma.$queryRawUnsafe(
    `select CAST(count(id) as CHAR) as count from inward_detail;`,
  ) as { count: string } [];
  const tableData = (await prisma.$queryRawUnsafe(
    `select bin_id , inward_child , is_received , user_name , Date(created_at) as created_at , Date(location_change_date) as location_change_date , pick_list_id , location_id  from inward_detail;`,
  )) as any[];
  //
  return {
    totalCount:count,
    tableData,
  };
}
//
export default function Page(prop: IPropType) {
  return (
    <>
      <section className="flex min-h-[100%] flex-col gap-10 p-7">
        <Header />
        <div className="rounded-md border border-gray-100 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b-[1px] p-5">
            <p className="py-2 font-semibold text-gray-500">
              Here you can manage your all SKU Child Report!
            </p>
          </div>
          <SkuChildReport getTableData={getTableData} />
        </div>
      </section>
    </>
  );
}
