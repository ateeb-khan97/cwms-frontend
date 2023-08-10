import axios, { AxiosRequestConfig } from 'axios';
import StockBatchReport from 'components/Report/StockBatchReport';
import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
import { cookies } from 'next/headers';
//

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
};
//
async function DataFetcher() {
  const token = cookies().get('token')?.value;
  if (token) {
    const config: AxiosRequestConfig = {
      method: 'get',
      headers: { Authorization: `Bearer ${token}` },
      url: 'http://localhost:3001/api/inward/find_for_batch_report',
    };
    const response = await axios(config);

    return response.data;
  }
  return [];
}
//
export default async function Page() {
  const tableData: TableType[] = await DataFetcher();
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
          <StockBatchReport tableData={tableData} />
        </div>
      </section>
    </>
  );
}
