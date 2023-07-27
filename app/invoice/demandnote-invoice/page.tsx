import axios from 'axios';
import { deleteCookie } from 'cookies-next';
import { cookies } from 'next/headers';
import Image from 'next/image';
interface TableType {
  id: number;
  product_name: string;
  trade_price?: string;
  quantity: string;
  product_conversions: {
    type: string;
    selling_unit: string;
    item_conversion: string;
  }[];
  manufacturer: {
    manufacturer_name: string;
  };
}

export default async function Page() {
  let tableData: any[] = [];
  let showData: TableType[] = [];
  //
  let totalDemandedQuantity = 0;
  let totalTradePriceValue = 0;
  //
  const cookieData = cookies().get('demandNoteDate')?.value;
  let productIds: any[] = [];
  if (cookieData) {
    tableData = JSON.parse(cookieData);
    tableData.forEach((each) => {
      productIds.push(each.id);
    });
    const response = await axios.post(
      'http://localhost:3001/api/product/demand-note',
      { productIds },
    );
    tableData.forEach((each) => {
      const index = response.data.data.findIndex(
        (eachChild: any) => each.id == eachChild.id,
      );
      response.data.data[index] = {
        ...response.data.data[index],
        quantity: each.quantity,
      };
      totalDemandedQuantity += +each.quantity;
      totalTradePriceValue += +(each.trade_price || 0) * +each.quantity;
    });
    showData = response.data.data;
    deleteCookie('demandNoteDate');
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
            Demand Note
          </h1>
          <table className="mt-5 w-full text-xs">
            <thead>
              <tr>
                <th className="border border-black">Product ID</th>
                <th className="border border-black">Product Name</th>
                <th className="border border-black">Manufacturer Name</th>
                <th className="border border-black">Pack Size</th>
                <th className="border border-black">Quantity</th>
                <th className="border border-black">TP Rate</th>
                <th className="border border-black">TP Value</th>
              </tr>
            </thead>
            <tbody>
              {showData.length > 0 &&
                showData.map((each, key: number) => {
                  return (
                    <tr key={key}>
                      <td className="border border-black text-center">
                        {each.id || ''}
                      </td>
                      <td className="border border-black text-center">
                        {each.product_name || ''}
                      </td>
                      <td className="border border-black text-center">
                        {each.manufacturer.manufacturer_name || ''}
                      </td>
                      <td className="border border-black text-center">
                        {each.product_conversions[1].item_conversion || ''}
                      </td>
                      <td className="border border-black text-center">
                        {each.quantity || ''}
                      </td>
                      <td className="border border-black text-center">
                        {each.trade_price || '0'}
                      </td>
                      <td className="border border-black text-center">
                        {+(each.trade_price || 0) * +each.quantity}
                      </td>
                    </tr>
                  );
                })}
              <tr>
                <td className="border-b border-black">-</td>
                <td className="border-b border-black" />
                <td className="border-b border-black" />
                <td className="border-b border-black" />
                <td className="border-b border-black" />
                <td className="border-b border-black" />
                <td className="border-b border-black" />
              </tr>
              <tr>
                <td className=" border-black" />
                <td className=" border-black" />
                <td className=" border-black" />
                <td className=" border-black text-center">Total Qty</td>
                <td className=" border-black text-center">
                  {totalDemandedQuantity}
                </td>
                <td className=" border-black text-center">Total Amount</td>
                <td className=" border-black text-center">
                  {totalTradePriceValue}
                </td>
              </tr>
            </tbody>
          </table>
        </main>
      </section>
    </>
  );
}
