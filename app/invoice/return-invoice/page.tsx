import prisma from 'config/prisma';
import { Metadata } from 'next';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import Loading from './loading';

interface PropType {
  params: any;
  searchParams: { id?: string };
}
//
interface DataType {
  product_id: string;
  product_name: string;
  po_id: string;
  quantity: string;
}
//
export const metadata: Metadata = {
  title: 'CWMS - Return PDF',
};
//
async function getData(pick_list_id: string) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  await prisma.$queryRawUnsafe(`set sql_mode = "";`);
  return (await prisma.$queryRawUnsafe(
    `select id.product_id, p.product_name, is2.po_id, CAST(COUNT(id.product_id) as CHAR) as quantity from inward_detail id left join products p on id.product_id = p.id left join inward_sku is2 on is2.inward_id = id.inward_id where id.pick_list_id = '${pick_list_id}' group by id.product_id, is2.po_id;`,
  )) as DataType[];
}
//
let isLoading = true;
//
export default async function Page(prop: PropType) {
  const pickListId = prop.searchParams?.id;
  if (pickListId == undefined) {
    redirect('/dashboard');
  }
  const tableData = await getData(pickListId);
  isLoading = false;
  let totalQuantity = 0;
  tableData.forEach((each) => (totalQuantity += Number(each.quantity)));
  return (
    <section className="flex min-h-screen w-full items-center justify-center">
      <main className="w-[180mm] p-5">
        <header className="flex justify-between">
          <div className="flex items-end gap-2 text-[0.8rem] font-semibold">
            <span className="select-none">PickList ID: </span>
            <span>{pickListId}</span>
          </div>
          <div className="w-56">
            <Image
              alt="logo"
              src={'/pharm_logo.png'}
              width={100}
              height={100}
              unoptimized
              draggable="false"
              className="w-full select-none"
            />
          </div>
        </header>
        <main>
          {isLoading ? (
            <Loading />
          ) : (
            <table className="mt-5 w-full text-[0.7rem]">
              <thead className="select-none">
                <tr>
                  <th className="bg-gray-200">Product ID</th>
                  <th className="bg-gray-200 text-start">Product Name</th>
                  <th className="bg-gray-200">PO ID</th>
                  <th className="bg-gray-200">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {tableData.length > 0 ? (
                  <>
                    {tableData.map((each) => {
                      return (
                        <tr
                          className="border-y text-center"
                          key={each.product_id}
                        >
                          <td className="w-[100px]">{each.product_id}</td>
                          <td className="text-start">{each.product_name}</td>
                          <td className="w-[100px]">{each.po_id}</td>
                          <td className="w-[100px]">{each.quantity}</td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td></td>
                      <td></td>
                      <td className="select-none text-center font-bold">
                        Total
                      </td>
                      <td className="text-center font-bold">{totalQuantity}</td>
                    </tr>
                  </>
                ) : (
                  <tr className="select-none">
                    <td></td>
                    <td className="py-5 text-center">No Data Found!</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </main>
      </main>
    </section>
  );
}
