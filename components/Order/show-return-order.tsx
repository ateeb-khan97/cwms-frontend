'use client';

import { Skeleton, Button, TextInput } from '@mantine/core';
import DataTableComponent from 'components/Shared/DataTableComponent';
import { useEffect, useState } from 'react';
import { MdDownload, MdSearch } from 'react-icons/md';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
//
interface TableType {
  customerOrderId: string;
  orderId: string;
  product_id: string;
  quantity: string;
}
//
const TableHeadComponent = ({
  filterFunction,
  data,
}: {
  filterFunction: (e: string) => void;
  data: TableType[];
}) => {
  const [search, setSearch] = useState<string>('');
  async function downloadHandler() {
    const csvData = Papa.unparse(data);
    // Create a Blob containing the CSV data
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'return-order.csv');
  }
  return (
    <>
      <div className="flex items-center gap-5">
        <Button
          onClick={downloadHandler}
          className="btn"
          leftIcon={<MdDownload />}
        >
          Download
        </Button>
        <TextInput
          icon={<MdSearch />}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            filterFunction(e.target.value);
          }}
          placeholder="Search"
          className="w-56"
        />
      </div>
    </>
  );
};
//
export default function ShowReturnOrder({
  getTableData,
}: {
  getTableData: () => Promise<any>;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<TableType[]>([]);
  const [filData, setFilData] = useState<TableType[]>([]);
  async function getData() {
    setIsLoading(true);
    const data = await getTableData();
    setTableData(data);
    setFilData(data);
    setIsLoading(false);
  }
  //
  const filterFunction = (search: string) => {
    search = search.toLowerCase();
    const filteredData = filData.filter((each) => {
      for (let key in each) {
        if (
          each[key as keyof TableType]
            ?.toString()
            ?.toLowerCase()
            ?.includes(search)
        ) {
          return true;
        }
      }
      return false;
    });
    setTableData(filteredData);
  };
  //
  useEffect(() => {
    getData();
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
              name: 'ID',
              cell(row, rowIndex, column, id) {
                return rowIndex + 1;
              },
              width: '100px',
              center: true,
              compact: true,
              grow: 0,
            },

            {
              name: 'Product ID',
              cell(row: TableType, rowIndex, column, id) {
                return row.product_id;
              },
              width: '130px',
              center: true,
              compact: true,
              grow: 0,
            },
            {
              name: 'Product Name',
              cell(row, rowIndex, column, id) {
                return row.product_name || '';
              },
              grow: 2,
            },
            {
              name: 'Order #',
              cell(row, rowIndex, column, id) {
                return row.customerOrderId;
              },
              grow: 1,
            },
            {
              name: 'Quantity',
              cell(row, rowIndex, column, id) {
                return row.quantity;
              },
              width: '130px',
              center: true,
              compact: true,
              grow: 0,
            },
            {
              name: 'Return ID',
              cell(row, rowIndex, column, id) {
                return row.return_id;
              },
              width: '130px',
              center: true,
              compact: true,
              grow: 0,
            },
          ]}
          data={tableData}
        >
          <TableHeadComponent data={filData} filterFunction={filterFunction} />
        </DataTableComponent>
      )}
    </>
  );
}
