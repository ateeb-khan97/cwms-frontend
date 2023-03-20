'use client';

import { Button } from '@mantine/core';
import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
import DataTableComponent from 'components/Shared/DataTableComponent';
import Loader from 'components/Shared/Loader';
import axiosFunction from 'functions/axiosFunction';
import customNotification from 'functions/customNotification';
import { ReceiveType } from 'modules/Inbound/receiveType';
import useReceiveData from 'modules/Inbound/useReceivedData';
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
  const { loading, receiveData, setReceiveData } = useReceiveData();
  //
  async function receiveHandler(id: number) {
    const response = await axiosFunction({
      urlPath: '/inward/create_child',
      method: 'POST',
      data: { id },
    }).then((res) => {
      setReceiveData([]);
      return res;
    });
    const message = response.status == 200 ? 'Success' : 'Failed';
    customNotification({
      message: response.message,
      title: message,
    });
  }
  //
  const qrGenerateFunction = async (row: ReceiveType) => {
    const inward_id = row.inward_id;
    const inward_child = await axiosFunction({
      urlPath: '/inward/find_child',
      method: 'POST',
      data: { inward_id },
    }).then((res) => res.data);
    localStorage.setItem('bar_code_value', JSON.stringify(inward_child));
    window.open('/barcode');
  };
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
              selector: (row: ReceiveType) => row.po_id,
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
              name: 'Inward Date',
              center: true,
              width: '170px',
              grow: 0,
              cell: (row: ReceiveType) =>
                row.inward_date == null ? '-' : row.inward_date,
            },
            {
              name: 'Actions',
              cell: (row: ReceiveType) => (
                <>
                  {row.inward_id == null ? (
                    <Button
                      className="bg-red-500 transition-all hover:bg-red-900"
                      compact
                      onClick={() => receiveHandler(row.id)}
                    >
                      Receive
                    </Button>
                  ) : (
                    <>{row.inward_id}</>
                  )}
                </>
              ),
              ignoreRowClick: true,
              allowOverflow: true,
              center: true,
              width: '150px',
              grow: 0,
            },
            {
              name: 'Barcode',
              selector: (row: ReceiveType) => (
                <>
                  <Button
                    onClick={() => qrGenerateFunction(row)}
                    disabled={row.inward_id == null}
                    className="bg-red-500 transition-all hover:bg-red-900"
                    compact
                  >
                    QR Gen.
                  </Button>
                </>
              ),
              ignoreRowClick: true,
              allowOverflow: true,
              center: true,
              width: '100px',
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
