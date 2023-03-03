'use client';

import { Button } from '@mantine/core';
import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
import DataTableComponent from 'components/Shared/DataTableComponent';
import Loader from 'components/Shared/Loader';
import { ReceiveType } from 'modules/Inbound/receiveType';
import useReceiveData from 'modules/Inbound/useReceivedData';
import { TableColumn } from 'react-data-table-component';
import { AiFillEdit } from 'react-icons/ai';

//
function Header() {
  return (
    <header className="select-none text-[#3b3e66]">
      <BreadcrumbComponent />
      <h1 className="text-3xl font-semibold ">Receive Items</h1>
      <p>Please see Receive Items below all connected channels</p>
    </header>
  );
}
//
function Table() {
  const { loading, receiveData } = useReceiveData();
  //
  async function receiveHandler(id: number) {
    console.log(id);
  }
  //
  return (
    <>
      {loading ? (
        <div className="flex w-[100%] justify-center p-28">
          <Loader />
        </div>
      ) : (
        <DataTableComponent
          data={receiveData}
          columns={[
            {
              name: 'PO. ID',
              selector: (row: ReceiveType) => row.id,
              grow: 0,
              center: true,
              width: '70px',
            },
            {
              name: 'Prod. ID',
              selector: (row: ReceiveType) => row.product_id,
              grow: 0,
              center: true,
              width: '70px',
            },
            {
              name: 'Prod. Name',
              selector: (row: ReceiveType) => row.product_name,
              grow: 1,
            },
            {
              name: 'Rec. Qty',
              selector: (row: ReceiveType) => row.received_quantity,
              grow: 0,
              center: true,
              width: '80px',
            },
            {
              name: 'MRP',
              selector: (row: ReceiveType) => row.maximum_retail_price,
              grow: 0,
              center: true,
              width: '80px',
            },
            {
              name: 'T. P.',
              selector: (row: ReceiveType) => row.trade_price,
              grow: 0,
              center: true,
              width: '80px',
            },
            {
              name: 'Disc. %',
              selector: (row: ReceiveType) => row.discount_percentage,
              grow: 0,
              center: true,
              width: '80px',
            },
            {
              name: 'Batch. No.',
              selector: (row: ReceiveType) =>
                row.batch_number ? row.batch_number : '-',
              grow: 0,
              center: true,
              width: '100px',
            },
            {
              name: 'Batch. Exp.',
              selector: (row: ReceiveType) => row.batch_expiry.substring(0, 10),
              grow: 0,
              center: true,
              width: '100px',
            },
            {
              name: 'FOC',
              selector: (row: ReceiveType) => (row.foc ? 'Yes' : 'No'),
              grow: 0,
              center: true,
              width: '70px',
            },
            {
              name: 'Actions',
              cell: (row: ReceiveType) => (
                <>
                  <Button
                    className="bg-red-500 transition-all hover:bg-red-900"
                    compact
                    onClick={() => receiveHandler(row.id)}
                  >
                    Receive
                  </Button>
                </>
              ),
              ignoreRowClick: true,
              allowOverflow: true,
              center: true,
              width: '90px',
              grow: 0,
            },
          ]}
        />
      )}
    </>
  );
}
//
export default function ReceiveItemsPage() {
  return (
    <>
      <section className="flex min-h-[100%] flex-col gap-10 p-7">
        <Header />
        <div className="rounded-md border border-gray-100 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b-[1px] p-5">
            <p className="py-2 font-semibold text-gray-500">
              Here you can manage your all Receive Items!
            </p>
          </div>
          <Table />
        </div>
      </section>
    </>
  );
}
