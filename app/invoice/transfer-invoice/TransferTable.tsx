'use client';

import Loader from 'components/Shared/Loader';
import { useEffect, useState } from 'react';

//
export default function TransferTable() {
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<any[]>([]);
  //
  useEffect(() => {
    setLoading(true);
    const localData = localStorage.getItem('transferData');
    if (localData) {
      const parsedData = JSON.parse(localData);
      setTableData(parsedData);
    }
    localStorage.removeItem('transferData');
    setLoading(false);
  }, []);
  //
  return (
    <>
      {loading ? (
        <div className="flex h-56 items-center justify-center">
          <Loader />
        </div>
      ) : (
        <table className="mt-5 w-full ">
          <thead>
            <tr>
              <th className="border border-black">Product ID</th>
              <th className="border border-black">Product Name</th>
              <th className="border border-black">Barcode</th>
            </tr>
          </thead>
          <tbody>
            {tableData.length > 0 &&
              tableData.map((each: any, key: number) => {
                return (
                  <tr key={key}>
                    <td className="border border-black text-center">
                      {each.product_id || ''}
                    </td>
                    <td className="border border-black text-center">
                      {each.product_name || ''}
                    </td>
                    <td className="border border-black text-center">
                      {each.inward_child || ''}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
    </>
  );
}
