'use client';
//
import React from 'react';
import { Button, Select, TextInput } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
import customNotification from 'functions/customNotification';
import axiosFunction from 'functions/axiosFunction';
import DataTableComponent from 'components/Shared/DataTableComponent';
import { RiDeleteBin2Line } from 'react-icons/ri';
//
type ScannedType = {
  product_id: number;
  product_name: string;
  bar_code: string;
  quantity?: number;
};
//
function IssuanceTable({
  scannedProducts,
}: {
  scannedProducts: ScannedType[];
}) {
  const totalQuantity = scannedProducts.reduce(
    (acc, obj) => acc + obj.quantity!,
    0,
  );
  return (
    <>
      <section className=" w-[47%] ">
        <div className="border-b py-5 text-xl font-semibold text-gray-500 ">
          <h1>Issuance List</h1>
        </div>
        <div className="w-[100%]">
          <DataTableComponent
            columns={[
              {
                name: 'Prod.ID',
                selector: (row: ScannedType) => row.product_id,
                grow: 0,
                center: true,
                width: '100px',
              },
              {
                name: 'Product Name',
                selector: (row: ScannedType) => row.product_name,
                grow: 1,
              },

              {
                name: 'Qty',
                selector: (row: ScannedType) => row.quantity,
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
function Table({
  ScannedProducts,
  removeFunction,
}: {
  ScannedProducts: ScannedType[];
  removeFunction: (bar_code: string) => void;
}) {
  return (
    <>
      <div className="border-y py-5 text-xl font-semibold text-gray-500 ">
        <h1>Stock Transfer Cart</h1>
      </div>
      <DataTableComponent
        data={ScannedProducts}
        columns={[
          {
            name: 'Prod.ID',
            selector: (row: ScannedType) => row.product_id,
            grow: 0,
            center: true,
            width: '100px',
          },
          {
            name: 'Product Name',
            selector: (row: ScannedType) => row.product_name,
            grow: 1,
          },
          {
            name: 'BarCode',
            selector: (row: ScannedType) => row.bar_code,
            grow: 0,
            center: true,
            width: '190px',
          },
          {
            cell: (row: ScannedType) => (
              <Button
                onClick={() => removeFunction(row.bar_code)}
                type="button"
                className="bg-transparent text-xl text-red-500 transition-all hover:border-red-500 hover:bg-red-500 hover:text-white"
                compact
              >
                <RiDeleteBin2Line />
              </Button>
            ),
            width: '60px',
            grow: 0,
            center: true,
          },
        ]}
      />
    </>
  );
}
//
function From() {
  // Refs
  const [locationFrom, setLocationFrom] = React.useState<string | null>('');
  const [locationTo, setLocationTo] = React.useState<string | null>('');
  const expectedDeliveryRef = React.useRef<HTMLInputElement>(null);
  const scanProductsRef = React.useRef<HTMLInputElement>(null);
  //
  const [locationData, setLocationData] = React.useState<any[]>([]);
  const [scannedProducts, setScannedProducts] = React.useState<ScannedType[]>(
    [],
  );

  const lengthRef = React.useRef(scannedProducts.length);
  const [issuanceData, setIssuanceData] = React.useState<ScannedType[]>([]);
  //
  const locationFetcher = async () => {
    const location = await axiosFunction({ urlPath: '/location/find' }).then(
      (res) => res.data,
    );
    setLocationData(location);
  };
  //
  React.useEffect(() => {
    locationFetcher();
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
      const mergedData: Record<string, ScannedType> = cloneData.reduce(
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
      const temp_data: ScannedType[] = [];
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
  const removeFunction = (bar_code: string) => {
    const clone_array = [...scannedProducts];
    const filtered_array = clone_array.filter((each_scan) => {
      return each_scan.bar_code != bar_code;
    });
    setScannedProducts(filtered_array);
  };
  //
  const scannedProductsFunction = async () => {
    const scannedProduct = scanProductsRef.current!.value;
    scanProductsRef.current!.value = '';
    // if empty
    if (scannedProduct == '') {
      customNotification({
        message: 'Please Scan A Product First',
        title: 'Failed',
      });
      return;
    }
    //
    // if already exists
    const index = scannedProducts.findIndex(
      (scan_elem) => scan_elem.bar_code == scannedProduct,
    );
    if (index != -1) {
      return customNotification({
        message: 'Product Already Scanned!',
        title: 'Failed',
      });
    }
    //
    const response = await axiosFunction({
      urlPath: '/inward/find_by_sku_child',
      method: 'POST',
      data: { scannedProduct },
    });
    if (response.data.length == 0) {
      return customNotification({
        message: response.message,
        title: 'Failed',
      });
    }
    setScannedProducts((pre) => [
      ...pre,
      { ...response.data[0], bar_code: scannedProduct },
    ]);
  };
  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const location_from = locationFrom;
    const location_to = locationTo;
    const expected_delivery_date = expectedDeliveryRef.current!.value;
    //
    const response = await axiosFunction({
      urlPath: '/transfer/create',
      method: 'POST',
      data: {
        location_from,
        location_to,
        expected_delivery_date,
        scannedProducts,
      },
    });
    const title = response.status == 200 ? 'Success' : 'Failed';
    customNotification({
      title,
      message: response.message,
    });
    setIssuanceData([]);
    setScannedProducts([]);
    setLocationFrom('');
    setLocationTo('');
    expectedDeliveryRef.current!.value = '';
    scanProductsRef.current!.value = '';
  };
  return (
    <section className="flex justify-between">
      <form
        onSubmit={submitHandler}
        className="flex w-[47%] flex-col gap-2 p-5"
      >
        <Select
          value={locationFrom}
          onChange={setLocationFrom}
          searchable
          nothingFound="No options"
          required
          withAsterisk
          size="xs"
          label="Stock From"
          clearable
          placeholder="Select location from stock will be transferred"
          data={locationData.map((each_loc) => {
            return {
              value: each_loc.loc_code,
              label: each_loc.loc_name,
            };
          })}
        />
        <Select
          value={locationTo}
          onChange={setLocationTo}
          searchable
          nothingFound="No options"
          required
          withAsterisk
          size="xs"
          label="Stock To"
          clearable
          placeholder="Select location where stock will be transferred"
          data={locationData.map((each_loc) => {
            return {
              value: each_loc.loc_code,
              label: each_loc.loc_name,
            };
          })}
        />
        <DatePicker
          ref={expectedDeliveryRef}
          placeholder="Select Date"
          label="Expected Delivery Date"
          required
          withAsterisk
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
        <Table
          ScannedProducts={scannedProducts}
          removeFunction={removeFunction}
        />
        <Button
          type={'submit'}
          disabled={scannedProducts.length == 0}
          className="ml-auto w-56 bg-red-500 transition-all hover:bg-red-500"
        >
          Transfer
        </Button>
      </form>
      <IssuanceTable scannedProducts={issuanceData} />
    </section>
  );
}
//
function Header() {
  return (
    <header className="select-none text-[#3b3e66]">
      <BreadcrumbComponent />
      <h1 className="text-3xl font-semibold ">Stock Transfer</h1>
      <p>Please see Stock Transfer below all connected channels</p>
    </header>
  );
}
//
export default function StockTransfer() {
  return (
    <section className="flex min-h-[100%] flex-col gap-10 p-7">
      <Header />
      <div className="rounded-md border border-gray-100 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b-[1px] p-5">
          <p className="py-2 font-semibold text-gray-500">
            Here you can manage your all Stock Transfer!
          </p>
        </div>
        <From />
      </div>
    </section>
  );
}
