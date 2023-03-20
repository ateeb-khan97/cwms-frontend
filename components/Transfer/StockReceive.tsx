'use client';

import { Button, TextInput } from '@mantine/core';
import DataTableComponent from 'components/Shared/DataTableComponent';
import Loader from 'components/Shared/Loader';
import axiosFunction from 'functions/axiosFunction';
import customNotification from 'functions/customNotification';
import TransferType from 'modules/Transfer/transfer.type';
import React from 'react';
//
interface ScannedProductsType {
  transfer_id: number;
  product_id: number;
  product_name: string;
  sku_child: string;
  quantity?: number;
}
//
function IssuanceTable({
  scannedProducts,
}: {
  scannedProducts: ScannedProductsType[];
}) {
  const totalQuantity = scannedProducts.reduce(
    (acc, obj) => acc + obj.quantity!,
    0,
  );
  return (
    <>
      <section className=" w-[49%] border-l">
        <div className="border-b p-5 text-xl font-semibold text-gray-500 ">
          <h1>Issuance List</h1>
        </div>
        <div className="w-[100%]">
          <DataTableComponent
            columns={[
              {
                name: 'Prod.ID',
                selector: (row: ScannedProductsType) => row.product_id,
                grow: 0,
                center: true,
                width: '100px',
              },
              {
                name: 'Product Name',
                selector: (row: ScannedProductsType) => row.product_name,
                grow: 1,
              },

              {
                name: 'Qty',
                selector: (row: ScannedProductsType) => row.quantity,
                grow: 0,
                center: true,
                width: '100px',
              },
            ]}
            data={scannedProducts}
          />
          <div className="flex justify-end border-y py-2 text-gray-500">
            <span>Total Quantity: </span>
            <span className="w-[100px] text-center">{totalQuantity}</span>
          </div>
        </div>
      </section>
    </>
  );
}
//
function StockReceiveCart({
  scannedProducts,
}: {
  scannedProducts: ScannedProductsType[];
}) {
  return (
    <section className="w-[100%]">
      <div className="border-y p-5 text-xl font-semibold text-gray-500 ">
        <h1>Stock Receive Cart</h1>
      </div>
      <DataTableComponent
        columns={[
          {
            name: 'Prod.ID',
            selector: (row: ScannedProductsType) => row.product_id,
            grow: 0,
            center: true,
            width: '100px',
          },
          {
            name: 'Product Name',
            selector: (row: ScannedProductsType) => row.product_name,
            grow: 1,
          },
          {
            name: 'BarCode',
            selector: (row: ScannedProductsType) => row.sku_child,
            grow: 0,
            center: true,
            width: '190px',
          },
        ]}
        data={scannedProducts}
      />
    </section>
  );
}
//
export default function StockReceive() {
  // refs
  const scanProductsRef = React.useRef<HTMLInputElement>(null);
  //
  // states
  const [loading, setLoading] = React.useState<boolean>(true);
  const [transferData, setTransferData] = React.useState<TransferType>({
    expected_arrival_date: new Date(),
    id: 0,
    loc_name: '',
    location_from: '',
    location_to: '',
    transfer_detail: [],
    transfer_status: '',
    stock_receive_date: '',
  });
  const [issuanceData, setIssuanceData] = React.useState<ScannedProductsType[]>(
    [],
  );
  const [scannedProducts, setScannedProducts] = React.useState<
    ScannedProductsType[]
  >([]);
  const lengthRef = React.useRef(scannedProducts.length);
  //
  // functions
  const scannedProductsFunction = () => {
    const scannedProduct = scanProductsRef.current!.value;
    scanProductsRef.current!.value = '';
    // check_if_empty
    if (scannedProduct == '') {
      return customNotification({
        message: 'Scan a product first!',
        title: 'Failed',
      });
    }
    // check_if_doesn't_exists
    const index_1 = transferData.transfer_detail.findIndex(
      (each_detail) => each_detail.sku_child == scannedProduct,
    );
    if (index_1 == -1) {
      return customNotification({
        message: 'Product does not exists!',
        title: 'Failed',
      });
    }
    // check_if_already_scanned
    const index_2 = scannedProducts.findIndex(
      (each_detail) => each_detail.sku_child == scannedProduct,
    );
    if (index_2 != -1) {
      return customNotification({
        message: 'Product already scanned!',
        title: 'Failed',
      });
    }
    //
    const filtered_data = transferData.transfer_detail[index_1];
    transferData.transfer_detail.splice(index_1, 1);
    //
    if (transferData.transfer_detail.length == 0) {
      customNotification({
        message: 'Transfer Order Completely Received',
        title: 'Success',
      });
    }
    //
    setScannedProducts((pre) => [...pre, filtered_data]);
  };
  //
  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const transfer_status =
      transferData.transfer_detail.length == 0 ? 'Received' : 'Par-Received';
    const transfer_id = transferData.id;
    const location_id = transferData.location_to;
    const { message, status } = await axiosFunction({
      urlPath: '/transfer/receive',
      method: 'POST',
      data: {
        transfer_id,
        transfer_status,
        location_id,
        scannedProducts,
      },
    }).then((res) => res);
    const title = status == 200 ? 'Success' : 'Failed';
    customNotification({
      message,
      title,
    });
  };
  //
  // useEffect
  React.useEffect(() => {
    setLoading(true);
    const transferData = JSON.parse(localStorage.getItem('transfer_data')!);
    if (transferData != null) {
      setTransferData(transferData);
    }
    setLoading(false);
  }, []);
  //
  React.useEffect(() => {
    if (
      lengthRef.current !== scannedProducts.length &&
      scannedProducts.length === 0
    ) {
      setIssuanceData([]);
    } else if (scannedProducts.length !== 0) {
      const cloneData = [...scannedProducts];
      const mergedData: Record<string, ScannedProductsType> = cloneData.reduce(
        (acc: any, obj) => {
          if (!acc[obj.product_id]) {
            acc[obj.product_id] = { ...obj, quantity: 1 };
          } else {
            acc[obj.product_id].quantity++;
          }
          return acc;
        },
        {},
      );
      const temp_data: ScannedProductsType[] = [];
      Object.keys(mergedData).forEach((each_key: string) => {
        temp_data.push({
          ...mergedData[each_key],
        });
      });
      setIssuanceData(temp_data);
    }
    //
    lengthRef.current = scannedProducts.length;
  }, [scannedProducts.length, lengthRef]);
  //
  return (
    <>
      {loading ? (
        <div className="flex h-[150px] items-center justify-center">
          <Loader />
        </div>
      ) : (
        <section className="flex justify-between">
          <form
            onSubmit={submitHandler}
            className="flex w-[49%] flex-col gap-2 border-r"
          >
            <div className="p-5">
              <TextInput
                label="Transfer ID"
                value={transferData.id}
                readOnly
                size="xs"
              />
              <TextInput
                ref={scanProductsRef}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    scannedProductsFunction();
                  }
                }}
                label="Scan Products"
                placeholder="Scan Products Here"
                size="xs"
              />
            </div>
            <StockReceiveCart scannedProducts={scannedProducts} />
            <div className="flex p-5">
              <Button
                disabled={scannedProducts.length == 0}
                type={'submit'}
                className="ml-auto w-56 bg-red-500 transition-all hover:bg-red-900"
              >
                Receive
              </Button>
            </div>
          </form>
          <IssuanceTable scannedProducts={issuanceData} />
        </section>
      )}
    </>
  );
}
