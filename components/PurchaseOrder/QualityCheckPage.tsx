'use client';

import { Button, TextInput } from '@mantine/core';
import { modals } from '@mantine/modals';
import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
import DataTableComponent from 'components/Shared/DataTableComponent';
import Loader from 'components/Shared/Loader';
import axiosFunction from 'functions/axiosFunction';
import customNotification from 'functions/customNotification';
import useGrnData from 'modules/Grn/useGrnData';
import useReceiveData from 'modules/Inbound/useReceivedData';
import React, { useRef } from 'react';

//
function Header() {
  return (
    <header className="select-none text-[#3b3e66]">
      <BreadcrumbComponent />
      <h1 className="text-3xl font-semibold ">Quality Check</h1>
      <p>Please see Quality Check below from all connected channels</p>
    </header>
  );
}
//
var loading = false;
function Table() {
  const commentRef = useRef<HTMLInputElement>(null);

  const { setReceiveData } = useReceiveData();
  const [grnData, setGrnData] = React.useState<any[]>([]);
  const [btnDisable, setBtnDisable] = React.useState<boolean>(false);
  //
  const grnFetcher = async () => {
    loading = true;
    const grn = await axiosFunction({ urlPath: '/grn/find_for_qc' }).then(
      (res) => res.data,
    );
    setGrnData(grn);
    loading = false;
  };
  React.useEffect(() => {
    grnFetcher();
  }, []);
  // functions
  const actionHandler = async (row: any, status: boolean) => {
    setBtnDisable(true);
    var url = status ? '/grn/approve/' : '/grn/reject/';
    //
    await axiosFunction({
      method: 'POST',
      urlPath: url,
      data: { ...row, reject_comment: commentRef.current?.value },
    });
    //
    customNotification({
      message: status ? 'Successfully Approved!' : 'Successfully Rejected!',
    });
    grnFetcher();
    setBtnDisable(false);
    status ? setReceiveData([]) : null;
  };
  //
  function RejectSubmit(row: any) {
    actionHandler(row, false);
    modals.closeAll();
  }
  const openRejectModal = (row: any) => {
    modals.open({
      id: 'good-receive-modal',
      title: 'Enter Comment',
      centered: true,
      children: (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              RejectSubmit(row);
            }}
            className="flex items-center gap-5"
          >
            <TextInput
              placeholder="Enter Comment..."
              required
              autoFocus
              ref={commentRef}
              className="w-full"
              size="xs"
            />
            <Button
              compact
              type="submit"
              className="bg-red-500 hover:bg-red-900"
            >
              Reject
            </Button>
          </form>
        </>
      ),
    });
    setTimeout(() => {
      commentRef.current?.focus();
    }, 100);
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
          data={grnData}
          columns={[
            {
              name: 'PO. ID',
              selector: (row: any) => row.po_id,
              grow: 0,
              center: true,
              width: '70px',
            },
            {
              name: 'Prod. ID',
              selector: (row: any) => row.product_id,
              grow: 0,
              center: true,
              width: '80px',
            },
            {
              name: 'Product Name',
              selector: (row: any) => row.product_name,
              grow: 2,
              sortable: true,
            },
            {
              name: 'UOM',
              selector: (row: any) => row.uom,
              grow: 0,
              center: true,
              width: '80px',
            },
            {
              name: 'Req. Qty',
              selector: (row: any) => row.required_quantity,
              grow: 0,
              center: true,
              width: '100px',
            },
            {
              name: 'Rec. Qty',
              selector: (row: any) => row.received_quantity,
              grow: 0,
              center: true,
              width: '100px',
            },
            {
              name: 'MRP.',
              selector: (row: any) => row.maximum_retail_price,
              grow: 0,
              center: true,
              width: '100px',
            },
            {
              name: 'T.P',
              selector: (row: any) => row.trade_price,
              grow: 0,
              center: true,
              width: '100px',
            },
            {
              name: 'Disc %',
              selector: (row: any) => row.discount_percentage,
              grow: 0,
              center: true,
              width: '100px',
            },
            {
              name: 'Batch No.',
              selector: (row: any) =>
                row.batch_number ? row.batch_number : '-',
              grow: 0,
              center: true,
              width: '100px',
            },
            {
              name: 'Batch Expiry',
              selector: (row: any) => row.batch_expiry.substring(0, 10),
              grow: 0,
              center: true,
              width: '120px',
            },

            {
              name: 'Comments',
              selector: (row: any) => (row.comments ? row.comments : '-'),
              grow: 0,
              center: true,
              width: '100px',
            },
            {
              name: 'FOC',
              selector: (row: any) => (row.foc ? 'Yes' : 'No'),
              grow: 0,
              center: true,
              width: '100px',
            },
            {
              cell: (row: any) => (
                <>
                  <Button
                    disabled={btnDisable}
                    className="bg-green-500 transition-all hover:bg-green-900"
                    radius={'xs'}
                    color={'green'}
                    compact
                    onClick={() => actionHandler(row, true)}
                  >
                    Approve
                  </Button>
                </>
              ),

              grow: 0,
              button: true,
              center: true,
              width: '100px',
            },
            {
              cell: (row: any) => (
                <>
                  <Button
                    disabled={btnDisable}
                    className="bg-red-500 transition-all hover:bg-red-900"
                    radius={'xs'}
                    color={'red'}
                    compact
                    onClick={() => openRejectModal(row)}
                  >
                    Reject
                  </Button>
                </>
              ),
              grow: 0,
              button: true,
              center: true,
              width: '100px',
            },
          ]}
        />
      )}
    </>
  );
}
//
export default function QualityCheckPage() {
  return (
    <section className="flex min-h-[100%] flex-col gap-10 p-7">
      <Header />
      <div className="rounded-md border border-gray-100 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b-[1px] p-5">
          <p className="py-2 font-semibold text-gray-500">
            Here you can manage your all quality checks!
          </p>
        </div>
        <Table />
      </div>
    </section>
  );
}
