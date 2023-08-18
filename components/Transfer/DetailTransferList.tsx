'use client';

import { Button, TextInput } from '@mantine/core';
import DataTableComponent from 'components/Shared/DataTableComponent';
import Loader from 'components/Shared/Loader';
import axiosFunction from 'functions/axiosFunction';
import React from 'react';
import { MdDownload, MdSearch } from 'react-icons/md';
//
interface TableDataType {
  created_at: string;
  expected_arrival_date: string;
  id: string;
  location_from: string;
  location_to: string;
  manufacturer_name: string;
  product_id: string;
  product_name: string;
  quantity: string;
  status: string;
}
//
const TableHeadComponent = ({
  filterFunction,
}: {
  filterFunction: (e: string) => void;
}) => {
  const [search, setSearch] = React.useState<string>('');
  return (
    <>
      <div className="flex items-center gap-5">
        <Button
          onClick={async () => {
            await axiosFunction({
              urlPath: '/transfer/transfer_detail_download',
              responseType: 'blob',
            }).then((response: any) => {
              console.log(response);

              const url = window.URL.createObjectURL(new Blob([response]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', 'transfer-detail.csv');
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            });
          }}
          className="bg-red-500 transition-all hover:bg-red-900"
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
export default function DetailTransferList() {
  const [tableData, setTableData] = React.useState<TableDataType[]>([]);
  const [filteredData, setFilteredData] = React.useState<TableDataType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const dataFetcher = async () => {
    setLoading(true);
    const response = await axiosFunction({
      urlPath: '/transfer/transfer_detail',
    });
    setTableData(response.data);
    setFilteredData(response.data);
    setLoading(false);
  };
  //
  const filterFunction = (search: string) => {
    search = search.toLowerCase();
    const filteredData = tableData.filter((each) => {
      for (let key in each) {
        if (
          each[key as keyof TableDataType]
            ?.toString()
            ?.toLowerCase()
            ?.includes(search)
        ) {
          return true;
        }
      }
      return false;
    });
    setFilteredData(filteredData);
  };
  //
  React.useEffect(() => {
    dataFetcher();
  }, []);
  return (
    <section>
      {loading ? (
        <div className="flex h-[250px] items-center justify-center">
          <Loader />
        </div>
      ) : (
        <DataTableComponent
          data={filteredData}
          columns={[
            {
              name: 'Tran.ID',
              selector: (row: TableDataType) => row.id,
              width: '80px',
              grow: 0,
              center: true,
            },
            {
              name: 'Prod.ID',
              selector: (row: TableDataType) => row.product_id,
              width: '80px',
              grow: 0,
              center: true,
            },
            {
              name: 'Product Name',
              selector: (row: TableDataType) => row.product_name,
            },
            {
              name: 'Manufacturer Name',
              selector: (row: TableDataType) => row.manufacturer_name,
            },
            {
              name: 'Tran.From',
              selector: (row: TableDataType) => row.location_from,
              width: '140px',
              grow: 0,
              center: true,
            },
            {
              name: 'Tran.To',
              selector: (row: TableDataType) => row.location_to,
              width: '140px',
              grow: 0,
              center: true,
            },
            {
              name: 'Created at',
              selector: (row: TableDataType) => row.created_at,
              width: '150px',
              grow: 0,
              center: true,
            },
            {
              name: 'Expected Delivery Date',
              selector: (row: TableDataType) => row.expected_arrival_date,
              width: '150px',
              grow: 0,
              center: true,
            },
            {
              name: 'Qty',
              selector: (row: TableDataType) => row.quantity,
              width: '80px',
              grow: 0,
              center: true,
            },
            {
              name: 'Status',
              selector: (row: TableDataType) => row.status,
              width: '80px',
              grow: 0,
              center: true,
            },
          ]}
        >
          <TableHeadComponent filterFunction={filterFunction} />
        </DataTableComponent>
      )}
    </section>
  );
}
