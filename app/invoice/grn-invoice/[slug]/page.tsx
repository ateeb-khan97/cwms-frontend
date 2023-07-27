import axiosFunction from 'functions/axiosFunction';
import Image from 'next/image';
import { cookies } from 'next/headers';
import dayjs from 'dayjs';
import GoodReceiveType from 'modules/Inbound/InvoiceType';
//
type PropType = { slug: string };
async function fetchData(id: string, token: string) {
  return await axiosFunction({
    urlPath: '/inward/find_by_po',
    method: 'POST',
    data: { id },
    token,
  });
}
var message = '';
export default async function Page({ params }: { params: PropType }) {
  const token: string | undefined = cookies().get('token')?.value;
  let tableData: GoodReceiveType[] = [];
  let totalRecQty = 0;
  let totalGSTValue = 0;
  let totalStockValue = 0;
  if (token) {
    const response = await fetchData(params.slug, token);
    tableData = response.data;
    for (let each of tableData) {
      totalRecQty += +each.received_quantity;
      totalGSTValue +=
        +(+(each.purchasing_price || 0) * +(each.gst_rate || 0)) / 100;
      totalStockValue += +each.purchasing_price * +each.received_quantity;
    }
    message = response.status == 200 ? '' : response.message;
  }

  return (
    <>
      <section className="flex min-h-screen w-full items-center justify-center">
        <main className="w-[210mm] py-10">
          <header
            className="flex items-center justify-between
          "
          >
            <div>
              <Image
                alt="logo"
                src={'/pharm_logo.png'}
                width={200}
                height={200}
              />
            </div>

            <div>
              <Image alt="logo" src={'/invoice.png'} width={200} height={200} />
            </div>
          </header>
          <h1 className="text-center text-3xl font-semibold text-gray-700">
            Good Receive Note
          </h1>
          {message != '' && (
            <div className="mx-auto mt-5 w-56 rounded-md border border-red-500 bg-red-500 py-2 text-center text-xl font-semibold text-white">
              {message}
            </div>
          )}
          <div className="mt-5 text-xs">
            <ul className="w-[33%] ">
              <li className="flex gap-1">
                <span className="font-semibold">Vendor:</span>
                <span>{tableData[0]?.vendor_name || '-'}</span>
              </li>
              <li className="flex gap-1">
                <span className="font-semibold">Payment Terms:</span>
                <span>{tableData[0]?.payment_terms || '-'}</span>
              </li>
              <li className="flex gap-1">
                <span className="font-semibold">PO Number:</span>
                <span>{tableData[0]?.po_id || '-'}</span>
              </li>
              <li className="flex gap-1">
                <span className="font-semibold">PO Date:</span>
                <span>
                  {dayjs(tableData[0]?.po_date).format('DD-MMM-YYYY') || ''}
                </span>
              </li>
              <li className="flex gap-1">
                <span className="font-semibold">Delivery Date:</span>
                <span>
                  {dayjs(tableData[0]?.delivery_date).format('DD-MMM-YYYY') ||
                    ''}
                </span>
              </li>
              <li className="flex gap-1">
                <span className="font-semibold">Delivery Location:</span>
                <span>{tableData[0]?.delivery_location || '-'}</span>
              </li>
            </ul>
            <div>
              <table className="mt-5 w-full ">
                <thead>
                  <tr>
                    <th className="border border-black">PO ID</th>
                    <th className="border border-black">GRN Date</th>
                    <th className="border border-black">Product Name</th>
                    <th className="border border-black">Rec QTY</th>
                    <th className="border border-black">MRP</th>
                    <th className="border border-black">TP</th>
                    <th className="border border-black">Disc%</th>
                    <th className="border border-black">Batch#</th>
                    <th className="border border-black">Expiry</th>
                    <th className="border border-black">FOC</th>
                    <th className="border border-black">GST Rate</th>
                    <th className="border border-black">GST Value</th>

                    <th className="border border-black">Total Stock Value</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.length > 0 &&
                    tableData.map((each_elem, key) => {
                      return (
                        <tr key={key}>
                          <td className="border border-black text-center">
                            {each_elem.po_id || 0}
                          </td>
                          <td className="border border-black text-center">
                            {each_elem.inward_date?.substring(0, 10) || ''}
                          </td>
                          <td className="border border-black text-center">
                            {each_elem.product_name || ''}
                          </td>
                          <td className="border border-black text-center">
                            {each_elem.received_quantity || ''}
                          </td>
                          <td className="border border-black text-center">
                            {each_elem.maximum_retail_price || ''}
                          </td>
                          <td className="border border-black text-center">
                            {each_elem.trade_price || ''}
                          </td>
                          <td className="border border-black text-center">
                            {each_elem.discount_percentage || ''}
                          </td>
                          <td className="border border-black text-center">
                            {each_elem.batch_number || '-'}
                          </td>
                          <td className="border border-black text-center">
                            {dayjs(each_elem.batch_expiry).format(
                              'DD-MMM-YYYY',
                            )}
                          </td>
                          <td className="border border-black text-center">
                            {each_elem.foc ? 'Yes' : 'No'}
                          </td>

                          <td className="border border-black text-center">
                            {each_elem.gst_rate || '0'}%
                          </td>
                          <td className="border border-black text-center">
                            {(+(each_elem.purchasing_price || 0) *
                              +(each_elem.gst_rate || 0)) /
                              100}
                          </td>
                          <td className="border border-black text-center">
                            {+(each_elem.purchasing_price || 0) *
                              +each_elem.received_quantity}
                          </td>
                        </tr>
                      );
                    })}
                  <tr>
                    <td className="border-b border-black">-</td>
                    <td className="border-b border-black"></td>
                    <td className="border-b border-black"></td>
                    <td className="border-b border-black"></td>
                    <td className="border-b border-black"></td>
                    <td className="border-b border-black"></td>
                    <td className="border-b border-black"></td>
                    <td className="border-b border-black"></td>
                    <td className="border-b border-black"></td>
                    <td className="border-b border-black"></td>
                    <td className="border-b border-black"></td>
                    <td className="border-b border-black"></td>
                    <td className="border-b border-black"></td>
                  </tr>
                  <tr>
                    <td />
                    <td />
                    <td className="text-center">Total Quantity</td>
                    <td className="text-center">{totalRecQty || 0}</td>
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                    <td className="text-center">{totalGSTValue || 0}</td>
                    <td className="text-center">{totalStockValue || 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </section>
    </>
  );
}
