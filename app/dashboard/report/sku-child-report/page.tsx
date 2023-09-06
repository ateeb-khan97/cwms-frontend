import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
import prisma from 'config/prisma';
import SkuChildReport from 'components/Report/SkuChildReport';
import { headers } from 'next/headers';
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
interface ISearchParams {
  search?: string | null;
  currentRowsPerPage?: string | null;
  currentPage?: string | null;
  page?: string | null;
  totalRows?: string | null;
}
//
interface IPropType {
  params: {};
  searchParams?: ISearchParams;
}
//
async function getTableData() {
  'use server';
  //
  let page = '1';
  let currentRowsPerPage = '1';
  let search = '';
  //
  const referer = headers().get('referer');
  if (referer) {
    const url = new URL(referer);
    page = url.searchParams.get('page') || '1';
    currentRowsPerPage = url.searchParams.get('currentRowsPerPage') || '1';
    search = url.searchParams.get('search') || '';
  }
  //
  //
  const [{ count }] = (await prisma.$queryRawUnsafe(
    `select CAST(count(id.id) as CHAR) as count from inward_detail id left join locations l on l.loc_code = location_id where id.inward_child like "%${search}%" or id.bin_id like "%${search}%" or id.id like "%${search}%" or id.user_name like "%${search}%" or l.loc_name like "%${search}%";`,
  )) as { count: string }[];
  const tableData = (await prisma.$queryRawUnsafe(
    `select id.id, id.bin_id , id.second_level, id.third_level, id.inward_id, id.inward_child , id.is_received , id.user_name , CAST(Date(id.created_at) as CHAR) as created_at , CAST(Date(id.location_change_date) as CHAR) as location_change_date , id.pick_list_id , l.loc_name from inward_detail id left join locations l on l.loc_code = location_id  where id.inward_child like "%${search}%" or id.bin_id like "%${search}%" or id.id like "%${search}%" or id.user_name like "%${search}%" or l.loc_name like "%${search}%" limit ${currentRowsPerPage} OFFSET ${
      (Number(page) - 1) * Number(currentRowsPerPage)
    };`,
  )) as any[];
  //
  return {
    totalCount: count,
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
