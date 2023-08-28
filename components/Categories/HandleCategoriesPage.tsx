'use client';
import { Button, Select, Switch, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
import axiosFunction from 'functions/axiosFunction';
import customNotification from 'functions/customNotification';
import Validator from 'functions/validationFunctions';
import useCategoryData from 'modules/Category/useCategoryData';
import { useRouter } from 'next/navigation';
//
import React from 'react';
//
function Header({ isUpdate }: { isUpdate: boolean }) {
  return (
    <header className="select-none text-[#3b3e66]">
      <BreadcrumbComponent />
      <h1 className="text-3xl font-semibold ">
        {isUpdate ? 'Update Categories' : 'Add Categories'}
      </h1>
      <p>Please see Category form below all connected channels</p>
    </header>
  );
}
//
function Form({ isUpdate }: { isUpdate: boolean }) {
  const router = useRouter();
  const { categoryData, loading, setCategoryData } = useCategoryData();
  //
  var localData: any = {};
  if (typeof window != 'undefined' && isUpdate) {
    if (Object.keys(localData).length == 0) {
      const [local_data] = JSON.parse(localStorage.getItem('category_data')!);
      localData = local_data;
    }
  }
  // hooks
  const form = useForm({
    validateInputOnChange: true,
    initialValues: isUpdate
      ? { ...localData }
      : {
          category_level: 'Parent Level',
          category_name: '',
          comment: '',
          category_description: '',
          status: false,
          sorting: '999',
          category_image_url: '',
          parent_id: '',
        },
    //
    validate: (values: any) => {
      return {
        sorting: Validator.formValidator({
          name: 'sorting',
          type: 'number',
          values: values.sorting.toString(),
        }),
      };
    },
    //
  });
  // functions
  async function submitHandler(values: any) {
    const url_end_point = isUpdate ? '/category/update/' : '/category/create/';
    const response = await axiosFunction({
      urlPath: url_end_point,
      method: 'POST',
      data: {
        ...values,
        parent_id:
          form.getInputProps('category_level').value === 'Sub Level'
            ? values.parent_id
            : null,
      },
    });
    //
    customNotification({
      message:
        response.status == 200
          ? `Category with ID: ${response.data[0].id} ${
              isUpdate ? 'Updated' : 'Created'
            } successfully!`
          : response.message,
      title: response.status == 200 ? 'Success' : 'Failed',
    });
    setCategoryData([]);
    router.refresh();
    router.push('/dashboard/categories');
    //
  }
  // component
  return (
    <>
      <form
        className="flex flex-wrap justify-between gap-5 p-5"
        onSubmit={form.onSubmit(submitHandler)}
      >
        <div className="flex h-[69px] w-[100%] justify-between">
          <Switch
            size="md"
            className={
              form.getInputProps('status').value ? 'w-[100%]' : 'w-[47%]'
            }
            label="Category Status"
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
        <Select
          className={`transition-all ${
            form.getInputProps('category_level').value === 'Sub Level'
              ? ' w-[47%]'
              : ' w-[100%]'
          }`}
          disabled={isUpdate}
          placeholder="Pick Category Level"
          size="md"
          label="Category Level"
          required
          withAsterisk
          searchable
          nothingFound="No options"
          data={['Parent Level', 'Sub Level']}
          {...form.getInputProps('category_level')}
        />

        <Select
          className={`transition-all ${
            form.getInputProps('category_level').value === 'Sub Level'
              ? ' w-[47%]'
              : 'hidden translate-x-[999px]'
          }`}
          placeholder="Pick Parent Category"
          size="md"
          label="Parent Category"
          required={form.getInputProps('category_level').value === 'Sub Level'}
          withAsterisk
          searchable
          nothingFound="No options"
          data={
            categoryData.length > 0
              ? categoryData
                  .filter(
                    (each_cat) => each_cat.category_level == 'Parent Level',
                  )
                  .map((each_cat) => {
                    return loading
                      ? { value: '', label: 'Loading', disabled: true }
                      : {
                          value: each_cat.id.toString(),
                          label: each_cat.category_name,
                        };
                  })
              : []
          }
          {...form.getInputProps('parent_id')}
        />
        <TextInput
          className="w-[47%]"
          placeholder="Enter Category Name"
          size="md"
          label="Category Name"
          required
          withAsterisk
          type={'text'}
          {...form.getInputProps('category_name')}
        />
        <TextInput
          className="w-[47%]"
          placeholder="Enter Description"
          size="md"
          label="Description"
          type={'text'}
          {...form.getInputProps('category_description')}
        />
        <TextInput
          className="w-[47%]"
          placeholder="Enter Sorting Number"
          size="md"
          label="Sorting Number"
          required
          withAsterisk
          type={'text'}
          {...form.getInputProps('sorting')}
        />
        <TextInput
          className="w-[47%]"
          placeholder="Enter URL for Image"
          size="md"
          label="URL for Image"
          type={'text'}
          {...form.getInputProps('category_image_url')}
        />
        <Button
          size="md"
          className="ml-auto w-56 bg-red-500 transition-all hover:scale-110 hover:bg-red-900"
          type={'submit'}
        >
          {isUpdate ? 'Update' : 'Submit'}
        </Button>
      </form>
    </>
  );
}
//
export default function HandleCategoriesPage({
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
            Here you can manage your all Category!
          </p>
        </div>
        <Form isUpdate={isUpdate} />
      </div>
    </section>
  );
}
