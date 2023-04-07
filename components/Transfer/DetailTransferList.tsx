'use client';

import DataTableComponent from 'components/Shared/DataTableComponent';
import Loader from 'components/Shared/Loader';
import axiosFunction from 'functions/axiosFunction';
import moment from 'moment';
import React from 'react';
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
export default function DetailTransferList() {
  const [tableData, setTableData] = React.useState<TableDataType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const dataFetcher = async () => {
    setLoading(true);
    const response = await axiosFunction({
      urlPath: '/transfer/transfer_detail',
    });
    setTableData(response.data);
    setLoading(false);
  };
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
          data={tableData}
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
              selector: (row: TableDataType) => {
                const mom = moment(row.created_at);
                return mom.format('DD-MM-YYYY | HH:mm:ss');
              },
              width: '150px',
              grow: 0,
              center: true,
            },
            {
              name: 'Expected Delivery Date',
              selector: (row: TableDataType) => {
                const mom = moment(row.expected_arrival_date);
                return mom.format('DD-MM-YYYY | HH:mm:ss');
              },
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
        />
      )}
    </section>
  );
}
