'use client';

import { Button, TextInput } from '@mantine/core';
import DataTableComponent from 'components/Shared/DataTableComponent';
import Loader from 'components/Shared/Loader';
import axiosFunction from 'functions/axiosFunction';
import moment from 'moment';
import React from 'react';
import { MdDownload, MdSearch } from 'react-icons/md';
//
interface TableDataType {
  created_at: string;
  expected_delivery_date: string;
  loc_name: string;
  manufacturer_name: string;
  order_status: string;
  order_type: string;
  po_id: string;
  product_id: string;
  product_name: string;
  total_amount: string;
  vendor_name: string;
  required_quantity: string;
  sales_tax_percentage: string;
  trade_discount_percentage: string;
  trade_price: string;
}
//
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
              urlPath: '/purchase_order/download-details',
              responseType: 'blob',
            }).then((response: any) => {
              console.log(response);

              const url = window.URL.createObjectURL(new Blob([response]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', 'purchase-order-detail.csv');
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
//
export default function PurchaseOrderDetail() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [tableData, setTableData] = React.useState<TableDataType[]>([]);
  const [filteredData, setFilteredData] = React.useState<TableDataType[]>([]);
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
      urlPath: '/purchase_order/find_details',
    });
    setTableData(response.data);
    setFilteredData(response.data);
    setLoading(false);
  };
  React.useEffect(() => {
    dataFetcher();
  }, []);
  //
  return (
    <main>
      {loading ? (
        <div className="flex h-[200px] items-center justify-center">
          <Loader />
        </div>
      ) : (
        <DataTableComponent
          data={filteredData}
          columns={[
            {
              name: 'PO ID',
              selector: (row: TableDataType) => row.po_id,
              grow: 0,
              center: true,
              width: '100px',
              sortable: true,
            },
            {
              name: 'Prod.ID',
              selector: (row: TableDataType) => row.product_id,
              grow: 0,
              center: true,
              width: '100px',
              sortable: true,
            },
            {
              name: 'Product',
              selector: (row: TableDataType) => row.product_name,
              grow: 1,
              sortable: true,
            },
            {
              name: 'Manufacturer',
              selector: (row: TableDataType) => row.manufacturer_name,
              grow: 1,
              sortable: true,
            },
            {
              name: 'Vendor',
              selector: (row: TableDataType) => row.vendor_name,
              grow: 1,
              sortable: true,
            },

            {
              name: 'Qty',
              selector: (row: TableDataType) => row.required_quantity,
              grow: 0,
              center: true,
              width: '100px',
              sortable: true,
            },
            {
              name: 'S.T.P',
              selector: (row: TableDataType) => row.sales_tax_percentage,
              grow: 0,
              center: true,
              width: '100px',
              sortable: true,
            },
            {
              name: 'Discount %',
              selector: (row: TableDataType) => row.trade_discount_percentage,
              grow: 0,
              center: true,
              width: '100px',
              sortable: true,
            },
            {
              name: 'Order Type',
              selector: (row: TableDataType) => row.order_type,
              grow: 0,
              center: true,
              width: '100px',
              sortable: true,
            },
            {
              name: 'Order Amount',
              selector: (row: TableDataType) =>
                (+(+row.total_amount).toFixed(2)).toLocaleString(),
              grow: 0,
              center: true,
              width: '120px',
              sortable: true,
            },
            {
              name: 'T.P',
              selector: (row: TableDataType) =>
                (+row.trade_price).toLocaleString(),
              grow: 0,
              center: true,
              width: '120px',
              sortable: true,
            },
            {
              name: 'Created By',
              selector: (row: TableDataType) => row.loc_name,
              grow: 0,
              center: true,
              width: '150px',
              sortable: true,
            },
            {
              name: 'Created at',
              selector: (row: TableDataType) => {
                const mom = moment(row.created_at);
                return mom.format('DD-MM-YYYY');
              },
              grow: 0,
              center: true,
              width: '150px',
              sortable: true,
            },
            {
              name: 'Exp. Delivery Date',
              selector: (row: TableDataType) => {
                const mom = moment(row.expected_delivery_date);
                return mom.format('DD-MM-YYYY');
              },
              grow: 0,
              center: true,
              width: '150px',
              sortable: true,
            },
            {
              name: 'Status',
              selector: (row: TableDataType) => row.order_status,
              grow: 0,
              center: true,
              width: '110px',
              sortable: true,
            },
          ]}
        >
          <TableHeadComponent filterFunction={filterFunction} />
        </DataTableComponent>
      )}
    </main>
  );
}
