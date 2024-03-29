'use client';
import { Button, MultiSelect, Switch, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
import axiosFunction from 'functions/axiosFunction';
import customNotification from 'functions/customNotification';
import { ManufacturerDropDownValues } from 'modules/Manufacturer/manufacturerdata';
import useManufacturerData from 'modules/Manufacturer/useManufacturerData';
import { useRouter } from 'next/navigation';
//
import React from 'react';
//
function Header({ isUpdate }: { isUpdate: boolean }) {
  return (
    <header className="select-none text-[#3b3e66]">
      <BreadcrumbComponent />
      <h1 className="text-3xl font-semibold ">
        {isUpdate ? 'Update Manufacturer' : 'Add Manufacturer'}
      </h1>
      <p>Please see Manufacturer form below all connected channels</p>
    </header>
  );
}
//
function Form({ isUpdate }: { isUpdate: boolean }) {
  const router = useRouter();
  const { setManufacturerData } = useManufacturerData();
  //
  var localData: any = {};
  if (typeof window != 'undefined' && isUpdate) {
    localData = JSON.parse(localStorage.getItem('manufacturer_data')!);
    var line_of_business =
      localData.line_of_business != ''
        ? JSON.parse(localData.line_of_business)
        : [];
    line_of_business = line_of_business.map((each_line: string) => {
      return each_line.trim();
    });
    localData = {
      ...localData,
      line_of_business,
    };
  }
  //
  const form = useForm({
    initialValues: isUpdate
      ? { ...localData }
      : {
          manufacturer_name: '',
          line_of_business: [],
          status: false,
          comment: '',
        },
  });
  //
  async function submitHandler(values: any) {
    const url_temp = isUpdate
      ? '/manufacturer/update/'
      : '/manufacturer/create/';
    const manufacturer_response = await axiosFunction({
      urlPath: url_temp,
      data: {
        ...values,
        line_of_business: JSON.stringify(values.line_of_business),
      },
      method: 'POST',
    });
    setManufacturerData([]);

    const new_manufacturer_id = manufacturer_response.data[0].id;
    customNotification({
      message: `Manufacturer with ID: ${[new_manufacturer_id]} ${
        isUpdate ? 'Updated' : 'Created'
      } successfully!`,
      title: 'Success',
    });

    router.push('/dashboard/manufacturers');
  }
  //
  return (
    <form
      onSubmit={form.onSubmit((values: any) => submitHandler(values))}
      className="flex flex-wrap justify-between gap-5 p-5"
    >
      <div className="flex h-[69px] w-[100%] justify-between">
        <Switch
          size="md"
          className={
            form.getInputProps('status').value ? 'w-[100%]' : 'w-[47%]'
          }
          label="Manufacturer Status"
          description="Active / In-Active"
          {...form.getInputProps('status', { type: 'checkbox' })}
        />

        <TextInput
          className={`${
            form.getInputProps('status').value ? 'w-[0%]' : 'w-[47%]'
          } overflow-hidden transition-all`}
          placeholder="Enter Comment"
          size="md"
          label="Comment"
          type={'text'}
          {...form.getInputProps('comment')}
        />
      </div>

      <TextInput
        className="w-[47%]"
        placeholder="Enter Manufacturer Name"
        size="md"
        label="Manufacturer Name"
        required
        withAsterisk
        type={'text'}
        {...form.getInputProps('manufacturer_name')}
      />
      <MultiSelect
        className="w-[47%]"
        placeholder="Pick Line Of Business"
        size="md"
        label="Line Of Business"
        required
        withAsterisk
        searchable
        clearable
        nothingFound="No options"
        data={ManufacturerDropDownValues.line_of_business}
        {...form.getInputProps('line_of_business')}
      />

      <Button
        size="md"
        className="ml-auto w-56 bg-red-500 transition-all hover:scale-110 hover:bg-red-900"
        type={'submit'}
      >
        {isUpdate ? 'Update' : 'Submit'}
      </Button>
    </form>
  );
}
//
export default function HandleManufacturersPage({
  isUpdate,
}: {
  isUpdate: boolean;
}) {
  return (
    <section className="flex min-h-[100%] flex-col gap-10 p-7">
      <Header isUpdate={isUpdate} />
      <div className="rounded-md border border-gray-100 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b-[1px] p-5">
          <p className="py-2 font-semibold text-gray-500">
            Here you can manage your all Manufacturers!
          </p>
        </div>
        <Form isUpdate={isUpdate} />
      </div>
    </section>
  );
}
