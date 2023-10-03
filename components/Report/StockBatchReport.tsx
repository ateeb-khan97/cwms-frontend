'use client';

import { Button, TextInput } from '@mantine/core';
import DataTableComponent from 'components/Shared/DataTableComponent';
import Loader from 'components/Shared/Loader';
import axiosFunction from 'functions/axiosFunction';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { MdDownload, MdSearch } from 'react-icons/md';
//
interface TableType {
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
  second_level: string;
  tax_code: string;
  aging_time: string;
}
//
const TableHeadComponent = ({
  filterFunction,
}: {
  filterFunction: (e: string) => void;
}) => {
  const [search, setSearch] = useState<string>('');
  return (
    <>
      <div className="flex items-center gap-5">
        <Button
          onClick={async () => {
            await axiosFunction({
              urlPath: '/inward/batch-report-download',
              responseType: 'blob',
            }).then((response: any) => {
              const url = window.URL.createObjectURL(new Blob([response]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', 'barcode-detail.csv');
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
export default function StockBatchReport({
  tableData,
}: {
  tableData: () => Promise<TableType[]>;
}) {
  const [data, setData] = useState<TableType[]>([]);
  const [filData, setFilData] = useState<TableType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
    setData(filteredData);
  };
  //
  async function getData() {
    setLoading(true);
    const dt = await tableData();
    setData(dt);
    setFilData(dt);
    setLoading(false);
  }
  //
  useEffect(() => {
    getData();
  }, []);
  //
  return (
    <>
      {loading ? (
        <div className="flex h-56 w-full items-center justify-center">
          <Loader />
        </div>
      ) : (
        <DataTableComponent
          columns={[
            {
              name: 'Prod.ID',
              selector: (row: TableType) => row.product_id,
              center: true,
              grow: 0,
              width: '80px',
            },
            {
              name: 'Product',
              selector: (row: TableType) => row.product_name,
            },
            {
              name: 'Manufacturer',
              selector: (row: TableType) => row.manufacturer_name,
            },
            {
              name: 'Category',
              selector: (row: TableType) => row.category_name,
            },
            {
              name: 'Batch No',
              cell: (row: TableType) => row.batch_number,
              grow: 0,
              center: true,
            },
            {
              name: 'Loc.Name',
              selector: (row: TableType) => row.loc_name,
              center: true,
              grow: 0,
              width: '150px',
            },
            {
              name: 'Box Qty',
              selector: (row: TableType) => row.second_level,
              center: true,
              grow: 0,
              width: '100px',
            },
            {
              name: 'Inventory',
              selector: (row: TableType) => row.total_inventory,
              center: true,
              grow: 0,
              width: '100px',
            },

            {
              name: 'Pur.Price',
              selector: (row: TableType) => row.purchasing_price,
              center: true,
              grow: 0,
              width: '100px',
            },
            {
              name: 'Tot Pur.Price',
              selector: (row: TableType) => row.total_purchasing_price,
              center: true,
              grow: 0,
              width: '100px',
            },
            {
              name: 'Tax Code',
              selector: (row: TableType) => (row.tax_code ? row.tax_code : '-'),
              center: true,
              grow: 0,
              width: '100px',
            },
            {
              name: 'T.P',
              selector: (row: TableType) =>
                row.trade_price ? row.trade_price : '-',
              center: true,
              grow: 0,
              width: '80px',
            },
            {
              name: 'MRP',
              selector: (row: TableType) =>
                row.mrp_unit_price ? row.mrp_unit_price : '-',
              center: true,
              grow: 0,
              width: '80px',
            },
            {
              name: 'Aging',
              selector: (row: TableType) => {
                const mom = moment(row.aging_time);
                return row.aging_time
                  ? mom.format('DD-MM-YYYY | HH:mm:ss')
                  : '-';
              },
              center: true,
              grow: 0,
              width: '170px',
            },
          ]}
          data={data}
        >
          <TableHeadComponent filterFunction={filterFunction} />
        </DataTableComponent>
      )}
    </>
  );
}
