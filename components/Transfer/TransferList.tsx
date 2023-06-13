'use client';
import { Button } from '@mantine/core';
//
import DataTableComponent from 'components/Shared/DataTableComponent';
import Loader from 'components/Shared/Loader';
import axiosFunction from 'functions/axiosFunction';
import TransferType from 'modules/Transfer/transfer.type';
import React from 'react';

export default function TransferList() {
  // states
  const [transferData, setTransferData] = React.useState<TransferType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  //
  // functions
  const transferFetcher = async () => {
    setLoading(true);
    const data = await axiosFunction({
      urlPath: '/transfer/find_all_transfer',
    }).then((res) => res.data);

    setTransferData(data);
    setLoading(false);
  };

  // useEffect
  React.useEffect(() => {
    transferFetcher();
  }, []);
  //
  // returned jsx
  return (
    <section>
      {loading ? (
        <div className="flex h-[250px] items-center justify-center">
          <Loader />
        </div>
      ) : (
        <DataTableComponent
          data={transferData}
          columns={[
            {
              name: 'Transfer.ID',
              cell: (row: TransferType) => <>{row.id}</>,
              center: true,
              grow: 0,
              width: '100px',
              compact: true,
              wrap: true,
            },
            {
              name: 'Transfer.To',
              cell: (row: TransferType) => <>{row.loc_to_name}</>,
              grow: 1,
            },
            {
              name: 'Transfer.From',
              cell: (row: TransferType) => <>{row.loc_from_name}</>,
              grow: 1,
            },
            {
              name: 'Expected Delivery Date',
              cell: (row: TransferType) => (
                <>{row.expected_arrival_date.toString().substring(0, 10)}</>
              ),
              center: true,
              grow: 0,
              width: '160px',
            },
            {
              name: 'Created At',
              cell: (row: TransferType) => (
                <>{row.created_at?.toString().substring(0, 10)}</>
              ),
              center: true,
              grow: 0,
              width: '150px',
            },
            {
              name: 'Transfer.Status',
              cell: (row: TransferType) => <>{row.transfer_status}</>,
              center: true,
              grow: 0,
              width: '120px',
            },
            {
              name: 'Created By',
              cell: (row: any) => row.user_name || '',
              center: true,
              grow: 0,
              width: '150px',
            },
          ]}
        />
      )}
    </section>
  );
}
