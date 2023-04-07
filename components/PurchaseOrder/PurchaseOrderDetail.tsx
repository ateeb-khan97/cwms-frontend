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
            },
            {
              name: 'Prod.ID',
              selector: (row: TableDataType) => row.product_id,
              grow: 0,
              center: true,
              width: '100px',
            },
            {
              name: 'Product',
              selector: (row: TableDataType) => row.product_name,
              grow: 1,
            },
            {
              name: 'Manufacturer',
              selector: (row: TableDataType) => row.manufacturer_name,
              grow: 1,
            },
            {
              name: 'Vendor',
              selector: (row: TableDataType) => row.vendor_name,
              grow: 1,
            },
            {
              name: 'Order Type',
              selector: (row: TableDataType) => row.order_type,
              grow: 0,
              center: true,
              width: '100px',
            },
            {
              name: 'Order Amount',
              selector: (row: TableDataType) => row.total_amount,
              grow: 0,
              center: true,
              width: '120px',
            },
            {
              name: 'Created By',
              selector: (row: TableDataType) => row.loc_name,
              grow: 0,
              center: true,
              width: '150px',
            },
            {
              name: 'Created at',
              selector: (row: TableDataType) => {
                const mom = moment(row.created_at);
                return mom.format('DD-MM-YYYY | HH:mm:ss');
              },
              grow: 0,
              center: true,
              width: '150px',
            },
            {
              name: 'Exp. Delivery Date',
              selector: (row: TableDataType) => {
                const mom = moment(row.expected_delivery_date);
                return mom.format('DD-MM-YYYY | HH:mm:ss');
              },
              grow: 0,
              center: true,
              width: '150px',
            },
            {
              name: 'Status',
              selector: (row: TableDataType) => row.order_status,
              grow: 0,
              center: true,
              width: '110px',
            },
          ]}
        />
      )}
    </main>
  );
}
