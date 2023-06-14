'use client';

import DataTableComponent from 'components/Shared/DataTableComponent';
import axiosFunction from 'functions/axiosFunction';
import { useEffect, useState } from 'react';
//
type TableType = {
  id: string;
  inward_child: string;
  product_id: string;
  product_name: string;
  returned_by: string;
};
//
export default function ReturnList() {
  const [tableData, setTableData] = useState<TableType[]>([]);
  const fetchTableData = async () => {
    const response = await axiosFunction({ urlPath: '/return/find_all' });
    console.log(response.data);
    setTableData(response.data);
  };
  useEffect(() => {
    fetchTableData();
  }, []);
  return (
    <>
      <DataTableComponent
        data={tableData}
        columns={[
          {
            name: 'ID',
            cell: (row: TableType) => row.id,
            center: true,
            width: '100px',
            grow: 0,
          },
          {
            name: 'Prod.ID',
            cell: (row: TableType) => row.product_id,
            center: true,
            width: '100px',
            grow: 0,
          },
          {
            name: 'Prod. Name',
            cell: (row: TableType) => row.product_name,
            grow: 2,
          },
          {
            name: 'Barcode',
            cell: (row: TableType) => row.inward_child,
            center: true,
            width: '200px',
            grow: 0,
          },
          {
            name: 'Returned By',
            cell: (row: TableType) => row.returned_by,
            center: true,
            width: '150px',
            grow: 0,
          },
        ]}
      />
    </>
  );
}
