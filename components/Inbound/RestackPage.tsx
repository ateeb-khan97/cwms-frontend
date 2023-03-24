'use client';
import { Button, TextInput } from '@mantine/core';
//
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
      <h1 className="text-3xl font-semibold ">Restacking Process</h1>
      <p>Please see Stacking Process below all connected channels</p>
    </header>
  );
}
//
function Form({
  setFormData,
  scannedItems,
  inwardRef,
  bin,
  setBin,
}: {
  inwardRef: any;
  setFormData: Function;
  scannedItems: ScannedType[];
  bin: string;
  setBin: Function;
}) {
  //    refs
  // const binRef = React.useRef<HTMLInputElement>(null);
  // const inwardRef = React.useRef<HTMLInputElement>(null);
  //    function
  const binSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const bin_id = bin;
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
        bin_id: bin_id.trim(),
      };
    });
    inwardRef.current!.focus();
  };
  //
  const inwardSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const inward_id = inwardRef.current!.value;
    const bin_id: string = bin;
    //
    if (bin_id == '') {
      return customNotification({
        message: 'Bin ID Cannot be null',
        title: 'Failed',
      });
    }
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
    //
    if (bin == '') {
      return customNotification({
        title: 'Failed',
        message: 'Scan Bin ID first!',
      });
    }
    //
    const id = scannedItems.findIndex(
      (eachScanned) => eachScanned.inward_id.trim() == inward_id.trim(),
    );
    if (id != -1) {
      customNotification({
        message: 'Inward ID already exists in Items Scanned!',
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
    //
    setFormData((pre: any) => {
      return {
        ...pre,
        inward_id: inward_id.trim(),
      };
    });
    inwardRef.current!.value = '';
    inwardRef.current!.focus();
  };
  //
  return (
    <>
      <section className="flex flex-col gap-5 p-5">
        <form onSubmit={binSubmit} className="flex w-[100%] items-end gap-5">
          <TextInput
            className="w-96"
            value={bin}
            onChange={(e) => {
              if (scannedItems.length > 0) {
                customNotification({
                  message: 'Submit first before changing the BIN',
                  title: 'Failed',
                });
              } else {
                setBin(e.target.value);
              }
            }}
            required
            withAsterisk={false}
            label="Scan Bin ID"
            placeholder="Scan here..."
          />
          <span>(Press Enter...)</span>
        </form>
        <form onSubmit={inwardSubmit} className="flex w-[100%] items-end gap-5">
          <TextInput
            className="w-96"
            ref={inwardRef}
            required
            withAsterisk={false}
            label="Scan Inward ID"
            placeholder="Scan here..."
          />
          <span>(Press Enter...)</span>
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
export default function RestackPage() {
  //    refs
  const [bin, setBin] = React.useState<string>('');
  const inwardRef = React.useRef<HTMLInputElement>(null);

  //
  const [formData, setFormData] = React.useState<ScannedType>({
    bin_id: '',
    inward_id: '',
  });
  const [scannedItems, setScannedItems] = React.useState<ScannedType[]>([]);
  React.useEffect(() => {
    if (formData.bin_id != '' && formData.inward_id != '') {
      setScannedItems((pre) => [...pre, formData]);
    }
  }, [formData]);
  //  functions
  const submitHandler = async () => {
    const { status, message } = await axiosFunction({
      urlPath: '/inward/restacking',
      method: 'POST',
      data: { scannedItems },
    }).then((res) => {
      return {
        status: res.status,
        message: res.message,
      };
    });
    //
    const title = status == 200 ? 'Success' : 'Failed';
    customNotification({
      message,
      title,
    });
    //
    setFormData({
      bin_id: '',
      inward_id: '',
    });
    inwardRef.current!.value = '';
    setBin('');
    setScannedItems([]);
  };
  //
  return (
    <section className="flex min-h-[100%] flex-col gap-10 p-7">
      <Header />
      <div className="rounded-md border border-gray-100 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b-[1px] p-5">
          <p className="py-2 font-semibold text-gray-500">
            Here you can manage your all Restacking Process!
          </p>
        </div>
        <Form
          inwardRef={inwardRef}
          scannedItems={scannedItems}
          setFormData={setFormData}
          bin={bin}
          setBin={setBin}
        />
        <Table scannedItems={scannedItems} />
        <div className="flex justify-end p-5">
          <Button
            onClick={submitHandler}
            disabled={scannedItems.length == 0}
            className="w-56 bg-red-500 transition-all hover:scale-110 hover:bg-red-900"
          >
            Submit
          </Button>
        </div>
      </div>
    </section>
  );
}
