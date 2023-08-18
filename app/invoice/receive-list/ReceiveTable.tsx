'use client';

import Loader from 'components/Shared/Loader';
import TransferType from 'modules/Transfer/transfer.type';
import { useEffect, useState } from 'react';

//
export default function ReceiveTable() {
  const [tableData, setTableData] = useState<TransferType | null>(null);
  const [dataToShow, setDataToShow] = useState<any[]>([]);
  useEffect(() => {
    const localData = localStorage.getItem('invoice-receive');
    if (localData) {
      const parsedData: TransferType = JSON.parse(localData);
      setTableData(parsedData);
      const resultMap = new Map();
      parsedData.transfer_detail.forEach((each) => {
        if (resultMap.has(each.product_id)) {
          const existingObject = resultMap.get(each.product_id);
          if (existingObject) {
            existingObject.count++;
          }
        } else {
          resultMap.set(each.product_id, {
            product_id: each.product_id,
            product_name: each.product_name,
            count: 1,
          });
        }
      });
      setDataToShow(Array.from(resultMap.values()));
    }
    localStorage.removeItem('invoice-receive');
  }, []);
  return (
    <section className="flex flex-col">
      <div className="flex flex-col text-sm">
        <span>
          <b>Transfer From:</b> {tableData?.loc_name}
        </span>
        <span>
          <b>Transfer ID:</b> {tableData?.id}
        </span>
        <span>
          <b>Location To: </b> {tableData?.location_to}
        </span>
      </div>
      {tableData == null ? (
        <div className="flex h-56 w-full items-center justify-center">
          <Loader />
        </div>
      ) : (
        <table className="mt-5 w-[100%] border border-black text-[10px]">
          <thead>
            <tr>
              <th className="w-[20px] border border-black">#</th>
              <th className="w-[20px] border border-black">Product ID</th>
              <th className="w-[150px] border border-black">Product</th>
              <th className="w-[110px] border border-black">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {dataToShow.map((each, key) => {
              return (
                <tr key={key} className="border-b border-b-black">
                  <td className="border-r border-r-black text-center">
                    {key + 1}
                  </td>
                  <td className="border-r border-r-black text-center">
                    {each.product_id}
                  </td>
                  <td className="border-r border-r-black text-center">
                    {each.product_name}
                  </td>
                  <td className="border-r border-r-black text-center">
                    {each.count}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}
