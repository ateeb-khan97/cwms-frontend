'use client';

import { Skeleton } from '@mantine/core';
import DataTableComponent from 'components/Shared/DataTableComponent';
import { useEffect, useState } from 'react';

//
interface IPropType {
  getTableData: () => Promise<any[]>;
}
//
export default function StockBatchTable({ getTableData }: IPropType) {
  const [tableData, setTableData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  //
  async function tableDataSetter() {
    setIsLoading(true);
    setTableData(await getTableData());
    setIsLoading(false);
  }
  useEffect(() => {
    tableDataSetter();
  }, []);
  return (
    <>
      {isLoading ? (
        <div className="w-full p-5">
          <Skeleton height={8} radius="xl" />
          <Skeleton height={8} mt={6} radius="xl" />
          <Skeleton height={8} mt={6} width="70%" radius="xl" />
        </div>
      ) : (
        <DataTableComponent
          columns={[
            {
              name: 'Prod.ID',
              selector: (row: any) => row.product_id,
              center: true,
              grow: 0,
              width: '80px',
            },
            {
              name: 'Product',
              selector: (row: any) => row.product_name,
            },
            {
              name: 'Manufacturer',
              selector: (row: any) => row.manufacturer_name,
            },
            {
              name: 'Category',
              selector: (row: any) => row.category_name,
            },
            {
              name: 'Batch No',
              cell: (row: any) => row.batch_number,
              grow: 0,
              center: true,
            },
            {
              name: 'Loc.Name',
              selector: (row: any) => row.loc_name,
              center: true,
              grow: 0,
              width: '150px',
            },
            {
              name: 'Batch Expiry',
              selector: (row: any) => row.batch_expiry,
              center: true,
              grow: 0,
              width: '150px',
            },
            {
              name: 'Inventory',
              selector: (row: any) => row.total_inventory,
              center: true,
              grow: 0,
              width: '100px',
            },
            {
              name: 'MRP',
              selector: (row: any) =>
                row.mrp_unit_price ? row.mrp_unit_price : '-',
              center: true,
              grow: 0,
              width: '80px',
            },
          ]}
          data={tableData}
        />
      )}
    </>
  );
}
