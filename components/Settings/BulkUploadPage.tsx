'use client';

import { Button, FileInput } from '@mantine/core';
import axiosFunction from 'functions/axiosFunction';
import customNotification from 'functions/customNotification';
import React from 'react';
import { HiUpload } from 'react-icons/hi';
import { MdDownload } from 'react-icons/md';
//
interface PropType {
  loading: boolean;
  setLoading: Function;
}
interface ConvertFileToBase64Result {
  status: boolean;
  message: string;
  base64String?: string;
}
//
const uploadValidation = (
  file: File | null,
): Promise<ConvertFileToBase64Result> => {
  if (!file) {
    return Promise.resolve({
      status: false,
      message: 'Please select a CSV file to upload!',
    });
  }
  //
  const fileType = file.name.substring(file.name.indexOf('.'));
  if (fileType !== '.csv') {
    return Promise.resolve({
      status: false,
      message: 'The selected file must be of .csv format!',
    });
  }
  //
  if (file.size > 10000000) {
    return Promise.resolve({
      status: false,
      message: 'File size must be under 10mb',
    });
  }
  //
  const reader = new FileReader();
  return new Promise<ConvertFileToBase64Result>((resolve, reject) => {
    try {
      reader.onload = () => {
        const base64String = reader.result?.toString().split(',')[1];
        if (base64String) {
          resolve({ status: true, base64String, message: '' });
        } else {
          reject({ status: false, message: '' });
        }
      };
      reader.onerror = () => {
        reject({ status: false, message: '' });
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      Promise.resolve({ status: false, message: 'There is an error!' });
    }
  });
};
//
const DemandNoteUpload = ({ loading, setLoading }: PropType) => {
  const [value, setValue] = React.useState<File | null>(null);
  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    //
    setLoading(true);
    const fileResponse = await uploadValidation(value);
    if (!fileResponse.status) {
      setLoading(false);
      return customNotification({
        title: 'Failed',
        message: fileResponse.message,
      });
    }
    const csv: string = fileResponse.base64String!;
    const { status } = await axiosFunction({
      urlPath: '/bulk_upload/demand_note',
      method: 'POST',
      data: { csv },
    });
    //
    if (status != 200) {
      setLoading(false);
      return customNotification({
        title: 'Failed',
        message: 'Failed to upload!',
      });
    }
    customNotification({ title: 'Success', message: 'Successfully Uploaded!' });
    //
    setLoading(false);
  };
  const downloadHandler = () => {
    const link = document.createElement('a');
    link.href = '/manufacturer.xlsx';
    link.download = 'manufacturer.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <form onSubmit={submitHandler} className="flex items-end gap-5">
      <FileInput
        className="w-[100%]"
        placeholder="Pick CSV File"
        label="Demand Note Upload"
        withAsterisk
        value={value}
        onChange={setValue}
        icon={<HiUpload />}
        accept=".csv"
        disabled={loading}
        clearable
      />
      <Button
        loading={loading}
        disabled={loading || value == null}
        type={'submit'}
        className="bg-red-500 transition hover:bg-red-900"
        rightIcon={<HiUpload />}
      >
        Upload
      </Button>
      <Button
        onClick={downloadHandler}
        rightIcon={<MdDownload />}
        type="submit"
        className="bg-blue-500 transition hover:bg-blue-900"
      >
        Template
      </Button>
    </form>
  );
};
//
const GrnUpload = ({ loading, setLoading }: PropType) => {
  const [value, setValue] = React.useState<File | null>(null);
  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    //
    setLoading(true);
    const fileResponse = await uploadValidation(value);
    if (!fileResponse.status) {
      setLoading(false);
      return customNotification({
        title: 'Failed',
        message: fileResponse.message,
      });
    }
    const csv: string = fileResponse.base64String!;
    const { status, message } = await axiosFunction({
      urlPath: '/bulk_upload/grn',
      method: 'POST',
      data: { csv },
    });
    //
    if (status != 200) {
      setLoading(false);
      return customNotification({
        title: 'Failed',
        message: 'Failed to upload!',
      });
    }
    customNotification({ title: 'Success', message });
    //
    setLoading(false);
  };
  const downloadHandler = () => {
    const link = document.createElement('a');
    link.href = '/manufacturer.xlsx';
    link.download = 'manufacturer.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <form onSubmit={submitHandler} className="flex items-end gap-5">
      <FileInput
        className="w-[100%]"
        placeholder="Pick CSV File"
        label="GRN Upload"
        withAsterisk
        value={value}
        onChange={setValue}
        icon={<HiUpload />}
        accept=".csv"
        disabled={loading}
        clearable
      />
      <Button
        loading={loading}
        disabled={loading || value == null}
        type={'submit'}
        className="bg-red-500 transition hover:bg-red-900"
        rightIcon={<HiUpload />}
      >
        Upload
      </Button>
      <Button
        onClick={downloadHandler}
        rightIcon={<MdDownload />}
        type="submit"
        className="bg-blue-500 transition hover:bg-blue-900"
      >
        Template
      </Button>
    </form>
  );
};
//
const ProductUpload = ({ loading, setLoading }: PropType) => {
  const [value, setValue] = React.useState<File | null>(null);
  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    //
    setLoading(true);
    const fileResponse = await uploadValidation(value);
    if (!fileResponse.status) {
      setLoading(false);
      return customNotification({
        title: 'Failed',
        message: fileResponse.message,
      });
    }
    const csv: string = fileResponse.base64String!;
    const { status } = await axiosFunction({
      urlPath: '/bulk_upload/product_upload',
      method: 'POST',
      data: { csv },
    });
    //

    //
    if (status != 200) {
      setLoading(false);
      return customNotification({
        title: 'Failed',
        message: 'Failed to upload!',
      });
    }
    customNotification({ title: 'Success', message: 'Successfully Uploaded!' });
    //
    setLoading(false);
  };

  const downloadHandler = () => {
    const link = document.createElement('a');
    link.href = '/product.xlsx';
    link.download = 'product.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <form onSubmit={submitHandler} className="flex items-end gap-5">
      <FileInput
        className="w-[100%]"
        placeholder="Pick CSV File"
        label="Product Upload"
        withAsterisk
        value={value}
        onChange={setValue}
        icon={<HiUpload />}
        accept=".csv"
        disabled={loading}
        clearable
      />
      <Button
        loading={loading}
        disabled={loading || value == null}
        type={'submit'}
        className="bg-red-500 transition hover:bg-red-900"
        rightIcon={<HiUpload />}
      >
        Upload
      </Button>
      <Button
        onClick={downloadHandler}
        rightIcon={<MdDownload />}
        type="submit"
        className="bg-blue-500 transition hover:bg-blue-900"
      >
        Template
      </Button>
    </form>
  );
};
//
const CategoryUpload = ({ loading, setLoading }: PropType) => {
  const [value, setValue] = React.useState<File | null>(null);
  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    //
    setLoading(true);
    const fileResponse = await uploadValidation(value);
    if (!fileResponse.status) {
      setLoading(false);
      return customNotification({
        title: 'Failed',
        message: fileResponse.message,
      });
    }
    const csv: string = fileResponse.base64String!;
    const { status } = await axiosFunction({
      urlPath: '/bulk_upload/category_upload',
      method: 'POST',
      data: { csv },
    });
    //
    if (status != 200) {
      setLoading(false);
      return customNotification({
        title: 'Failed',
        message: 'Failed to upload!',
      });
    }
    customNotification({ title: 'Success', message: 'Successfully Uploaded!' });
    //
    setLoading(false);
  };

  const downloadHandler = () => {
    const link = document.createElement('a');
    link.href = '/category.xlsx';
    link.download = 'category.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <form onSubmit={submitHandler} className="flex items-end gap-5">
      <FileInput
        className="w-[100%]"
        placeholder="Pick CSV File"
        label="Category Upload"
        withAsterisk
        value={value}
        onChange={setValue}
        icon={<HiUpload />}
        accept=".csv"
        disabled={loading}
        clearable
      />
      <Button
        loading={loading}
        disabled={loading || value == null}
        type={'submit'}
        className="bg-red-500 transition hover:bg-red-900"
        rightIcon={<HiUpload />}
      >
        Upload
      </Button>
      <Button
        onClick={downloadHandler}
        rightIcon={<MdDownload />}
        type="submit"
        className="bg-blue-500 transition hover:bg-blue-900"
      >
        Template
      </Button>
    </form>
  );
};
//
const ManufacturerUpload = ({ loading, setLoading }: PropType) => {
  const [value, setValue] = React.useState<File | null>(null);
  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    //
    setLoading(true);
    const fileResponse = await uploadValidation(value);
    if (!fileResponse.status) {
      setLoading(false);
      return customNotification({
        title: 'Failed',
        message: fileResponse.message,
      });
    }
    const csv: string = fileResponse.base64String!;
    const { status } = await axiosFunction({
      urlPath: '/bulk_upload/manufacturer_upload',
      method: 'POST',
      data: { csv },
    });
    //
    if (status != 200) {
      setLoading(false);
      return customNotification({
        title: 'Failed',
        message: 'Failed to upload!',
      });
    }
    customNotification({ title: 'Success', message: 'Successfully Uploaded!' });
    //
    setLoading(false);
  };

  const downloadHandler = () => {
    const link = document.createElement('a');
    link.href = '/manufacturer.xlsx';
    link.download = 'manufacturer.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <form onSubmit={submitHandler} className="flex items-end gap-5">
      <FileInput
        className="w-[100%]"
        placeholder="Pick CSV File"
        label="Manufacturer Upload"
        withAsterisk
        value={value}
        onChange={setValue}
        icon={<HiUpload />}
        accept=".csv"
        disabled={loading}
        clearable
      />
      <Button
        loading={loading}
        disabled={loading || value == null}
        type={'submit'}
        className="bg-red-500 transition hover:bg-red-900"
        rightIcon={<HiUpload />}
      >
        Upload
      </Button>
      <Button
        onClick={downloadHandler}
        rightIcon={<MdDownload />}
        type="submit"
        className="bg-blue-500 transition hover:bg-blue-900"
      >
        Template
      </Button>
    </form>
  );
};
//
const VendorUpload = ({ loading, setLoading }: PropType) => {
  const [value, setValue] = React.useState<File | null>(null);
  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    //
    setLoading(true);
    const fileResponse = await uploadValidation(value);
    if (!fileResponse.status) {
      setLoading(false);
      return customNotification({
        title: 'Failed',
        message: fileResponse.message,
      });
    }
    const csv: string = fileResponse.base64String!;
    const { status } = await axiosFunction({
      urlPath: '/bulk_upload/vendor_upload',
      method: 'POST',
      data: { csv },
    });
    //
    if (status != 200) {
      setLoading(false);
      return customNotification({
        title: 'Failed',
        message: 'Failed to upload!',
      });
    }
    customNotification({ title: 'Success', message: 'Successfully Uploaded!' });
    //
    setLoading(false);
  };
  const downloadHandler = () => {
    const link = document.createElement('a');
    link.href = '/manufacturer.xlsx';
    link.download = 'manufacturer.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <form onSubmit={submitHandler} className="flex items-end gap-5">
      <FileInput
        className="w-[100%]"
        placeholder="Pick CSV File"
        label="Vendor Upload"
        withAsterisk
        value={value}
        onChange={setValue}
        icon={<HiUpload />}
        accept=".csv"
        disabled={loading}
        clearable
      />
      <Button
        loading={loading}
        disabled={loading || value == null}
        type={'submit'}
        className="bg-red-500 transition hover:bg-red-900"
        rightIcon={<HiUpload />}
      >
        Upload
      </Button>
      <Button
        onClick={downloadHandler}
        rightIcon={<MdDownload />}
        type="submit"
        className="bg-blue-500 transition hover:bg-blue-900"
      >
        Template
      </Button>
    </form>
  );
};
//
const PurchaseOrderUpload = ({ loading, setLoading }: PropType) => {
  const [value, setValue] = React.useState<File | null>(null);
  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    //
    setLoading(true);
    const fileResponse = await uploadValidation(value);
    if (!fileResponse.status) {
      setLoading(false);
      return customNotification({
        title: 'Failed',
        message: fileResponse.message,
      });
    }
    const csv: string = fileResponse.base64String!;
    const { status } = await axiosFunction({
      urlPath: '/bulk_upload/purchase_upload',
      method: 'POST',
      data: { csv },
    });
    //
    if (status != 200) {
      setLoading(false);
      return customNotification({
        title: 'Failed',
        message: 'Failed to upload!',
      });
    }
    customNotification({ title: 'Success', message: 'Successfully Uploaded!' });
    //
    setLoading(false);
  };
  const downloadHandler = () => {
    const link = document.createElement('a');
    link.href = '/manufacturer.xlsx';
    link.download = 'manufacturer.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <form onSubmit={submitHandler} className="flex items-end gap-5">
      <FileInput
        className="w-[100%]"
        placeholder="Pick CSV File"
        label="PurchaseOrder Upload"
        withAsterisk
        value={value}
        onChange={setValue}
        icon={<HiUpload />}
        accept=".csv"
        disabled={loading}
        clearable
      />
      <Button
        loading={loading}
        disabled={loading || value == null}
        type={'submit'}
        className="bg-red-500 transition hover:bg-red-900"
        rightIcon={<HiUpload />}
      >
        Upload
      </Button>
      <Button
        onClick={downloadHandler}
        rightIcon={<MdDownload />}
        type="submit"
        className="bg-blue-500 transition hover:bg-blue-900"
      >
        Template
      </Button>
    </form>
  );
};
//
export default function BulkUploadPage() {
  const [loading, setLoading] = React.useState<boolean>(false);
  return (
    <main className="flex w-[500px] max-w-[100%] flex-col gap-5 p-5">
      <ProductUpload loading={loading} setLoading={setLoading} />
      <CategoryUpload loading={loading} setLoading={setLoading} />
      <ManufacturerUpload loading={loading} setLoading={setLoading} />
      <VendorUpload loading={loading} setLoading={setLoading} />
      <PurchaseOrderUpload loading={loading} setLoading={setLoading} />
      <DemandNoteUpload loading={loading} setLoading={setLoading} />
      <GrnUpload loading={loading} setLoading={setLoading} />
    </main>
  );
}
