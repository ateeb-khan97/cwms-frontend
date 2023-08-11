'use client';

import { Button, TextInput } from '@mantine/core';
import DataTableComponent from 'components/Shared/DataTableComponent';
import Loader from 'components/Shared/Loader';
import axiosFunction from 'functions/axiosFunction';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { MdDownload, MdSearch } from 'react-icons/md';
//
interface TableDataType {
  aging_time: string;
  category_name: string;
  item_conversion: string;
  loc_name: string;
  manufacturer_name: string;
  mrp_unit_price: string;
  product_id: string;
  product_name: string;
  purchasing_price: string;
  tax_code: string;
  total_inventory: string;
  total_purchasing_price: string;
  trade_price: string;
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
              urlPath: '/inward/stock-detail-report-download/',
              responseType: 'blob',
            }).then((response: any) => {
              console.log(response);

              const url = window.URL.createObjectURL(new Blob([response]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', 'stock-detail-report.csv');
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
export default function StockDetailReport() {
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<TableDataType[]>([]);
  const [filteredData, setFilteredData] = useState<TableDataType[]>([]);
  //
  const filterFunction = (search: string) => {
    search = search.toLowerCase();
    const filteredDataTemp = tableData.filter((each) => {
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
    setFilteredData(filteredDataTemp);
  };
  //
  const dataFetcher = async () => {
    setLoading(true);
    const response = await axiosFunction({
      urlPath: '/inward/find_for_detail_report',
    });
    setTableData(response.data);
    setLoading(false);
  };
  useEffect(() => {
    dataFetcher();
  }, []);
  return (
    <section>
      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <Loader />
        </div>
      ) : (
        <DataTableComponent
          data={filteredData}
          columns={[
            {
              name: 'Prod.ID',
              selector: (row: TableDataType) => row.product_id,
              center: true,
              grow: 0,
              width: '80px',
            },
            {
              name: 'Product',
              selector: (row: TableDataType) => row.product_name,
            },
            {
              name: 'Manufacturer',
              selector: (row: TableDataType) => row.manufacturer_name,
            },
            {
              name: 'Category',
              selector: (row: TableDataType) => row.category_name,
            },
            {
              name: 'Loc.Name',
              selector: (row: TableDataType) => row.loc_name,
              center: true,
              grow: 0,
              width: '150px',
            },
            {
              name: 'Inventory',
              selector: (row: TableDataType) => row.total_inventory,
              center: true,
              grow: 0,
              width: '100px',
            },
            {
              name: 'Pur.Price',
              selector: (row: TableDataType) => row.purchasing_price,
              center: true,
              grow: 0,
              width: '100px',
            },
            {
              name: 'Tot Pur.Price',
              selector: (row: TableDataType) => row.total_purchasing_price,
              center: true,
              grow: 0,
              width: '100px',
            },
            {
              name: 'Tax Code',
              selector: (row: TableDataType) =>
                row.tax_code ? row.tax_code : '-',
              center: true,
              grow: 0,
              width: '100px',
            },
            {
              name: 'T.P',
              selector: (row: TableDataType) =>
                row.trade_price ? row.trade_price : '-',
              center: true,
              grow: 0,
              width: '80px',
            },
            {
              name: 'MRP',
              selector: (row: TableDataType) =>
                row.mrp_unit_price ? row.mrp_unit_price : '-',
              center: true,
              grow: 0,
              width: '80px',
            },
            {
              name: 'Aging',
              selector: (row: TableDataType) => {
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
        >
          <TableHeadComponent filterFunction={filterFunction} />
        </DataTableComponent>
      )}
    </section>
  );
}
