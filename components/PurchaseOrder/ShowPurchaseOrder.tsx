'use client';

import { Button, TextInput } from '@mantine/core';
import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
import DataTableComponent from 'components/Shared/DataTableComponent';
import Loader from 'components/Shared/Loader';
import usePurchaseOrderData from 'modules/PurchaseOrder/usePurchaseOrder';
import Link from 'next/link';
import { ImBin2 } from 'react-icons/im';
import { modals } from '@mantine/modals';
import axiosFunction from 'functions/axiosFunction';
import React, { useEffect, useState } from 'react';
import { MdPrint } from 'react-icons/md';

//
function Header() {
  return (
    <header className="select-none text-[#3b3e66]">
      <BreadcrumbComponent />
      <h1 className="text-3xl font-semibold ">Show Purchase Order</h1>
      <p>Please see Purchase Order below all connected channels</p>
    </header>
  );
}
//
function Table({ userDesignation }: { userDesignation: string | null }) {
  const commentRef = React.useRef<HTMLInputElement>(null);
  const { loading, purchaseOrderData, setPurchaseOrderData } =
    usePurchaseOrderData();

  //
  const actionFunction = async (row: any) => {
    await axiosFunction({
      urlPath: '/purchase_order/approve/',
      data: {
        id: row.id,
      },
      method: 'POST',
    }).then(() => setPurchaseOrderData([]));
  };
  //
  const invoiceGenerator = async (row: any) => {
    localStorage.setItem('purchase_order', JSON.stringify(row.id));
    window.open('/invoice');
  };
  //
  const modalConfirmHandler = (id: number) => {
    const submitHandler = async (e: React.SyntheticEvent) => {
      e.preventDefault();
      await axiosFunction({
        urlPath: '/purchase_order/cancel/',
        method: 'POST',
        data: {
          id: id,
          comment: commentRef.current!.value,
        },
      }).then(() => setPurchaseOrderData([]));
      modals.close('po_confirm');
    };
    modals.open({
      modalId: 'po_confirm',
      size: 'lg',
      title: `Are you sure you want to cancel Purchase Order ID: ${id}`,
      children: (
        <>
          <form onSubmit={submitHandler}>
            <TextInput
              ref={commentRef}
              label="Comment"
              placeholder="Enter Here..."
            />
          </form>
        </>
      ),
    });
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
          data={purchaseOrderData}
          columns={[
            {
              name: 'Order #',
              selector: (row: any) => row.id,
              grow: 0,
              center: true,
              width: '100px',
              sortable: true,
            },
            {
              name: 'Vendor Name',
              selector: (row: any) => row.vendor_name,
              grow: 2,
              sortable: true,
            },
            {
              name: 'Delivery Location',
              selector: (row: any) => row.loc_name,
              grow: 0,
              width: '150px',
              center: true,
            },
            {
              name: 'Order Type',
              selector: (row: any) => row.order_type,
              grow: 0,
              width: '126px',
              center: true,
            },
            {
              name: 'Grand Total',
              selector: (row: any) => row.total_amount,
              grow: 0,
              width: '126px',
              center: true,
            },
            {
              name: 'Expected Date',
              selector: (row: any) =>
                row.expected_delivery_date.substring(0, 10),
              grow: 0,
              sortable: false,
              center: true,
              width: '156px',
            },
            {
              name: 'User',
              selector: (row: any) => row.user_name,
              grow: 0,
              center: true,
              sortable: false,
            },
            {
              name: 'User ID',
              selector: (row: any) => row.user_id,
              grow: 0,
              center: true,
              sortable: false,
            },
            {
              name: 'Status',
              selector: (row: any) => row.order_status,
              grow: 0,
              center: true,
              sortable: false,
            },
            {
              name: 'Approve',
              cell: (row: any) => {
                let disableApproveBtn = true;

                if (row.total_amount <= 300000 && userDesignation == 'DMP') {
                  disableApproveBtn = false;
                }
                if (
                  row.total_amount > 300000 &&
                  row.total_amount <= 1500000 &&
                  userDesignation == 'LSC'
                ) {
                  disableApproveBtn = false;
                }
                if (
                  row.total_amount > 1500000 &&
                  row.total_amount <= 2000000 &&
                  userDesignation == 'HOF'
                ) {
                  disableApproveBtn = false;
                }
                if (row.total_amount > 2000000 && userDesignation == 'CD') {
                  disableApproveBtn = false;
                }
                if (row.order_status != 'Pending') {
                  disableApproveBtn = true;
                }

                if (userDesignation == null) {
                  disableApproveBtn = true;
                }
                return (
                  <>
                    <Button
                      disabled={disableApproveBtn}
                      compact
                      className="bg-[#002884]"
                      onClick={() => actionFunction(row)}
                    >
                      Approve
                    </Button>
                  </>
                );
              },
              ignoreRowClick: true,
              allowOverflow: true,
              center: true,
              grow: 0,
            },
            {
              name: 'Invoice',
              cell: (row: any) => {
                return (
                  <>
                    <Button
                      disabled={row.order_status == 'Pending'}
                      // disabled={row.is_cancelled}
                      compact
                      className="bg-[#002884]"
                      onClick={() => invoiceGenerator(row)}
                      rightIcon={<MdPrint />}
                    >
                      Print
                    </Button>
                  </>
                );
              },
              ignoreRowClick: true,
              allowOverflow: true,
              center: true,
              grow: 0,
            },
            {
              center: true,
              ignoreRowClick: true,
              allowOverflow: true,
              grow: 0,
              width: '70px',
              cell: (row: any) => {
                var isDisabled = false;
                if (row.is_cancelled) {
                  isDisabled = true;
                }
                //
                if (
                  row.order_status == 'Received' ||
                  row.order_status == 'Par-Received'
                ) {
                  isDisabled = true;
                }
                //
                if (row.grn_count != 0) {
                  isDisabled = true;
                }
                //
                return (
                  <>
                    <Button
                      disabled={isDisabled}
                      onClick={() => modalConfirmHandler(row.id)}
                      className="flex h-6 w-4 items-center justify-center rounded-md bg-red-500"
                    >
                      <ImBin2 className="flex items-center justify-center text-white" />
                    </Button>
                  </>
                );
              },
            },
          ]}
        />
      )}
    </>
  );
}
//
export default function ShowPurchaseOrder() {
  const [userDesignation, setUserDesignation] = useState<string | null>(null);
  const userDesignationFetch = async () => {
    const response = await axiosFunction({ urlPath: '/user/find_designation' });
    setUserDesignation(response.data[0]);
  };
  useEffect(() => {
    userDesignationFetch();
  }, []);
  return (
    <section className="flex min-h-[100%] flex-col gap-10 p-7">
      <Header />
      <div className="rounded-md border border-gray-100 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b-[1px] p-5">
          <p className="py-2 font-semibold text-gray-500">
            Here you can manage your all Purchase Order!
          </p>
          <Link
            className="rounded-md bg-red-500 px-5 py-2 text-white transition-all hover:scale-110 hover:bg-red-900"
            href={'/dashboard/purchase_order/add_purchase_order'}
          >
            Add Purchase Order
          </Link>
        </div>
        <Table userDesignation={userDesignation} />
      </div>
    </section>
  );
}
