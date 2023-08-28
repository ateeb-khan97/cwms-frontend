'use client';

import { Button, Select, TextInput } from '@mantine/core';
import axiosFunction from 'functions/axiosFunction';
import customNotification from 'functions/customNotification';
import { useEffect, useRef, useState } from 'react';
import ReturnTable from './ReturnTable';
//
interface TableType {
  product_name: string;
  product_id: string;
  inward_child: string;
}
//
export default function ReturnForm({
  vendorDropDownData,
}: {
  vendorDropDownData: any[];
}) {
  const [scannedProducts, setScannedProducts] = useState<TableType[]>([]);
  const [vendorId, setVendorId] = useState<string>('');
  const inwardRef = useRef<HTMLInputElement>(null);
  //
  useEffect(() => {
    inwardRef.current?.focus();
  }, []);
  //
  const deleteHandler = (id: string) => {
    const updatedArray = scannedProducts.filter(
      (obj) => obj.inward_child !== id,
    );
    setScannedProducts(updatedArray);
  };
  //
  const submitHandler = async () => {
    const inward_child = inwardRef.current!.value;
    inwardRef.current!.value = '';
    // if already exists
    const index = scannedProducts.findIndex(
      (scan_elem) => scan_elem.inward_child == inward_child,
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
      data: { scannedProduct: inward_child },
    });
    if (response.data.length == 0) {
      customNotification({
        message: 'Stock does not exists or already returned!',
        title: 'Failed',
      });
      return null;
    }
    const fetchedData: TableType = response.data[0];
    setScannedProducts((pre) => [
      ...pre,
      {
        inward_child: fetchedData.inward_child,
        product_id: fetchedData.product_id,
        product_name: fetchedData.product_name,
      },
    ]);
  };
  //
  const returnHandler = async () => {
    const vendor = vendorDropDownData.filter(
      (each) => each.value == vendorId,
    )[0];
    const response = await axiosFunction({
      urlPath: '/return/create',
      method: 'POST',
      data: {
        vendorName: vendor.label,
        vendorId,
        inward_child: scannedProducts,
      },
    });
    customNotification({
      message: response.message,
      title: response.status == 200 ? 'Success' : 'Failed',
    });
    setScannedProducts([]);
  };
  //
  return (
    <section className="flex flex-col p-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitHandler();
        }}
      >
        <TextInput
          ref={inwardRef}
          placeholder="Scan products"
          label="Scan Products to Return"
          required
          className="w-1/3"
          size="xs"
        />
      </form>
      <div>
        <Select
          label="Vendor"
          placeholder="Select Vendor"
          size="xs"
          className="w-1/3"
          value={vendorId}
          onChange={(e) => setVendorId(e!)}
          data={vendorDropDownData}
        />
      </div>
      <div className="flex justify-end p-5">
        <Button
          onClick={returnHandler}
          disabled={scannedProducts.length == 0}
          className="w-56 bg-red-500 transition-all hover:bg-red-900"
        >
          Return
        </Button>
      </div>
      <ReturnTable tableData={scannedProducts} deleteHandler={deleteHandler} />
    </section>
  );
}
