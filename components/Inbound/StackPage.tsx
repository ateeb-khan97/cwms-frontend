'use client';

import { TextInput } from '@mantine/core';
import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
import DataTableComponent from 'components/Shared/DataTableComponent';
import axiosFunction from 'functions/axiosFunction';
import customNotification from 'functions/customNotification';
import React from 'react';
//
type ScannedType = {
  bin_id: string;
  inward_id: string;
};
//
function Header() {
  return (
    <header className="select-none text-[#3b3e66]">
      <BreadcrumbComponent />
      <h1 className="text-3xl font-semibold ">Stacking Process</h1>
      <p>Please see Stacking Process below all connected channels</p>
    </header>
  );
}
//
function Form({ setFormData }: { setFormData: Function }) {
  //    refs
  const binRef = React.useRef<HTMLInputElement>(null);
  const inwardRef = React.useRef<HTMLInputElement>(null);
  //    function
  const binSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const bin_id = binRef.current!.value;
    const [is_exists] = await axiosFunction({
      urlPath: '/wms/bin/find_by_id',
      method: 'POST',
      data: { bin_id },
    }).then((res) => res.data);
    //
    if (!is_exists) {
      customNotification({
        message: 'Bin ID does not exists!',
        title: 'Failed',
      });
      setFormData((pre: any) => {
        return {
          ...pre,
          bin_id: '',
        };
      });
      return;
    }
    setFormData((pre: any) => {
      return {
        ...pre,
        bin_id,
      };
    });
  };
  //
  const inwardSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const inward_id = inwardRef.current!.value;
    //
    const [does_exists] = await axiosFunction({
      urlPath: '/inward/does_exists',
      method: 'POST',
      data: { inward_id },
    }).then((res) => res.data);
    if (!does_exists) {
      customNotification({
        message: 'Inward ID does not exists!',
        title: 'Failed',
      });
      setFormData((pre: any) => {
        return {
          ...pre,
          inward_id: '',
        };
      });
      return;
    }
    setFormData((pre: any) => {
      return {
        ...pre,
        inward_id,
      };
    });
  };
  //
  return (
    <>
      <section className="flex w-96 flex-col gap-5 p-5">
        <form onSubmit={binSubmit}>
          <TextInput
            ref={binRef}
            required
            withAsterisk={false}
            label="Scan Bin ID"
            placeholder="Scan here..."
          />
        </form>
        <form onSubmit={inwardSubmit}>
          <TextInput
            ref={inwardRef}
            required
            withAsterisk={false}
            label="Scan Inward ID"
            placeholder="Scan here..."
          />
        </form>
      </section>
    </>
  );
}
//
function Table({ scannedItems }: { scannedItems: ScannedType[] }) {
  return (
    <section>
      <div className="select-none p-5">
        <h1 className="text-xl font-semibold text-gray-500">Items Scanned</h1>
      </div>
      <DataTableComponent
        data={scannedItems}
        columns={[
          {
            name: 'Bin ID',
            center: true,
            cell: (row: ScannedType) => <>{row.bin_id}</>,
          },
          {
            name: 'Inward ID',
            center: true,
            cell: (row: ScannedType) => <>{row.inward_id}</>,
          },
        ]}
      />
    </section>
  );
}
//
export default function StackPage() {
  const [formData, setFormData] = React.useState<ScannedType>({
    bin_id: '',
    inward_id: 'te',
  });
  const [scannedItems, setScannedItems] = React.useState<ScannedType[]>([]);
  React.useEffect(() => {
    if (formData.bin_id != '' && formData.inward_id != '') {
      setScannedItems((pre) => [...pre, formData]);
    }
  }, [formData]);
  //
  return (
    <section className="flex min-h-[100%] select-none flex-col gap-10 p-7">
      <Header />
      <div className="rounded-md border border-gray-100 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b-[1px] p-5">
          <p className="py-2 font-semibold text-gray-500">
            Here you can manage your all Stacking Process!
          </p>
        </div>
        <Form setFormData={setFormData} />
        <Table scannedItems={scannedItems} />
      </div>
    </section>
  );
}
