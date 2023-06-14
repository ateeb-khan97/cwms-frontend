'use client';

import { Button } from '@mantine/core';
import DataTableComponent from 'components/Shared/DataTableComponent';

//
interface TableType {
  product_name: string;
  product_id: string;
  inward_child: string;
}
//
export default function ReturnTable({
  tableData,
  deleteHandler,
}: {
  tableData: TableType[];
  deleteHandler: (id: string) => void;
}) {
  return (
    <>
      <DataTableComponent
        data={tableData}
        columns={[
          {
            name: 'ID',
            cell: (row: TableType) => row.product_id,
            center: true,
            width: '100px',
            grow: 0,
          },
          {
            name: 'Name',
            cell: (row: TableType) => row.product_name,
            grow: 2,
          },
          {
            name: 'Barcode',
            cell: (row: TableType) => row.inward_child,
            center: true,
            grow: 0,
            width: '200px',
          },
          {
            cell: (row: TableType) => (
              <>
                <Button
                  onClick={() => {
                    deleteHandler(row.inward_child);
                  }}
                  className="bg-red-500 transition-all hover:bg-red-900"
                  compact
                >
                  Delete
                </Button>
              </>
            ),
            button: true,
          },
        ]}
        children={<></>}
      />
    </>
  );
}
