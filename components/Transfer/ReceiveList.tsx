'use client';
import { Button } from '@mantine/core';
import { modals } from '@mantine/modals';
//
import DataTableComponent from 'components/Shared/DataTableComponent';
import Loader from 'components/Shared/Loader';
import { setCookie } from 'cookies-next';
import axiosFunction from 'functions/axiosFunction';
import TransferType from 'modules/Transfer/transfer.type';
import Link from 'next/link';
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
  const receiveAllHandler = async (row: TransferType) => {
    modals.openConfirmModal({
      title: 'Please confirm you action!',
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      confirmProps: { className: 'bg-red-500 hover:bg-red-900 transition-all' },
      onConfirm: async () => {
        const response = await axiosFunction({
          urlPath: '/transfer/receive-all',
          method: 'POST',
          data: row,
        });
        if (response.status == 200) {
          transferFetcher();
        }
      },
    });
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
            },
            {
              name: 'Transfer.From',
              cell: (row: TransferType) => <>{row.loc_name}</>,
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
              name: 'Actions',
              cell: (row: TransferType) => {
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
            {
              name: 'Receive',
              cell: (row: TransferType) => {
                return (
                  <>
                    <Button
                      disabled={row.transfer_status == 'Received'}
                      onClick={() => receiveAllHandler(row)}
                      compact
                      className="bg-red-500 transition-all hover:bg-red-900"
                    >
                      Receive All
                    </Button>
                  </>
                );
              },
              center: true,
              width: '100px',
            },
            {
              name: 'PDF',
              cell: (row: TransferType) => {
                return (
                  <>
                    <Link
                      onClick={() => {
                        localStorage.setItem(
                          'invoice-receive',
                          JSON.stringify(row),
                        );
                      }}
                      target="_blank"
                      href={'/invoice/receive-list'}
                      className="rounded-md bg-red-500 px-3 py-1 text-white transition-all hover:bg-red-900"
                    >
                      PDF
                    </Link>
                  </>
                );
              },
              center: true,
              width: '80px',
            },
          ]}
        />
      )}
    </section>
  );
}
