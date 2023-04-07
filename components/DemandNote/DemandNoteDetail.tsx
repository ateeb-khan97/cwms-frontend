'use client';

import DataTableComponent from 'components/Shared/DataTableComponent';
import Loader from 'components/Shared/Loader';
import axiosFunction from 'functions/axiosFunction';
import moment from 'moment';
import React from 'react';
//
interface TableData {
  created_at: string;
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
export default function DemandNoteDetail() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [tableData, setTableData] = React.useState<TableData[]>([]);
  const dataFetcher = async () => {
    setLoading(true);
    const response = await axiosFunction({
      urlPath: '/demand_note/find_detail',
    });
    setTableData(response.data);
    setLoading(false);
  };
  //
  React.useEffect(() => {
    dataFetcher();
  }, []);
  //
  return (
    <main>
      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <Loader />
        </div>
      ) : (
        <DataTableComponent
          data={tableData}
          columns={[
            {
              name: 'Dem.ID',
              selector: (row: TableData) => row.id,
              center: true,
              grow: 0,
              width: '80px',
            },
            {
              name: 'Prod.ID',
              selector: (row: TableData) => row.product_id,
              center: true,
              grow: 0,
              width: '80px',
            },
            {
              name: 'Product Name',
              selector: (row: TableData) => row.product_name,
              grow: 1,
            },
            {
              name: 'Manufacturer Name',
              selector: (row: TableData) => row.manufacturer_name,
              grow: 1,
            },
            {
              name: 'Qty',
              selector: (row: TableData) => row.quantity,
              center: true,
              grow: 0,
              width: '70px',
            },
            {
              name: 'Created Date',
              selector: (row: TableData) => {
                const momentDate = moment(row.created_at);
                return momentDate.format('DD-MM-YYYY | HH:mm:ss');
              },
              center: true,
              grow: 0,
              width: '160px',
            },
            {
              name: 'Status',
              selector: (row: TableData) => row.status,
              center: true,
              grow: 0,
              width: '100px',
            },
            {
              name: 'Loc From',
              selector: (row: TableData) => row.location_from,
              center: true,
              grow: 0,
              width: '135px',
            },
            {
              name: 'Loc To',
              selector: (row: TableData) => row.location_to,
              center: true,
              grow: 0,
              width: '135px',
            },
          ]}
        />
      )}
    </main>
  );
}
