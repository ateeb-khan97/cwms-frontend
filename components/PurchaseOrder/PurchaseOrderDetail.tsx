'use client';

import DataTableComponent from 'components/Shared/DataTableComponent';
import Loader from 'components/Shared/Loader';
import axiosFunction from 'functions/axiosFunction';
import moment from 'moment';
import React from 'react';
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
export default function PurchaseOrderDetail() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [tableData, setTableData] = React.useState<TableDataType[]>([]);
  //
  const dataFetcher = async () => {
    setLoading(true);
    const response = await axiosFunction({
      urlPath: '/purchase_order/find_details',
    });
    setTableData(response.data);
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
          data={tableData}
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
        />
      )}
    </main>
  );
}
