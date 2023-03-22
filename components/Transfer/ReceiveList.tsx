'use client';
import { Button } from '@mantine/core';
//
import DataTableComponent from 'components/Shared/DataTableComponent';
import Loader from 'components/Shared/Loader';
import axiosFunction from 'functions/axiosFunction';
import TransferType from 'modules/Transfer/transfer.type';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function ReceiveList() {
  // router
  const router = useRouter();
  // states
  const [transferData, setTransferData] = React.useState<TransferType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  //
  // functions
  const transferFetcher = async () => {
    setLoading(true);
    const data = await axiosFunction({ urlPath: '/transfer/find_all' }).then(
      (res) => res.data,
    );
    setTransferData(data);
    setLoading(false);
  };
  //
  const receiveHandler = async (row: TransferType) => {
    localStorage.setItem('transfer_data', JSON.stringify(row));
    router.push('/dashboard/transfer/stock_receive');
  };
  //
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
              selector: (row: TransferType) => <>{row.id}</>,
              center: true,
              grow: 0,
              width: '100px',
            },
            {
              name: 'Transfer.From',
              selector: (row: TransferType) => <>{row.loc_name}</>,
              grow: 1,
            },
            {
              name: 'Expected Delivery Date',
              selector: (row: TransferType) => (
                <>{row.expected_arrival_date.toString().substring(0, 10)}</>
              ),
              center: true,
              grow: 0,
              width: '160px',
            },
            {
              name: 'Created At',
              selector: (row: TransferType) => (
                <>{row.created_at?.toString().substring(0, 10)}</>
              ),
              center: true,
              grow: 0,
              width: '150px',
            },
            {
              name: 'Transfer.Status',
              selector: (row: TransferType) => <>{row.transfer_status}</>,
              center: true,
              grow: 0,
              width: '120px',
            },
            {
              name: 'Actions',
              selector: (row: TransferType) => {
                return (
                  <>
                    <Button
                      disabled={row.transfer_status == 'Received'}
                      onClick={() => receiveHandler(row)}
                      compact
                      className="bg-red-500 transition-all hover:bg-red-900"
                    >
                      Receive
                    </Button>
                  </>
                );
              },
              center: true,
              width: '100px',
            },
          ]}
        />
      )}
    </section>
  );
}
