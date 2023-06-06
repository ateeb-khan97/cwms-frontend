'use client';

import {
  Button,
  FileInput,
  MultiSelect,
  Radio,
  Select,
  Switch,
  TextInput,
  TransferList,
} from '@mantine/core';
import { DateInput, DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
import DualListBoxComponent from 'components/Shared/DualListBoxComponent';
import axiosFunction from 'functions/axiosFunction';
import customNotification from 'functions/customNotification';
import Validator from 'functions/validationFunctions';
import useVendorData from 'modules/Vendor/useVendorData';
import { VendorDropDownValues } from 'modules/Vendor/vendorData';
import { useRouter } from 'next/navigation';
import React from 'react';

//
function Header({ isUpdate }: { isUpdate: boolean }) {
  return (
    <header className="select-none text-[#3b3e66]">
      <BreadcrumbComponent />
      <h1 className="text-3xl font-semibold ">
        {isUpdate ? 'Update Vendors' : 'Add Vendors'}
      </h1>
      <p>Please see Vendors form below all connected channels</p>
    </header>
  );
}
//
function Form({ isUpdate }: { isUpdate: boolean }) {
  const router = useRouter();
  //
  const { setVendorData } = useVendorData();
  const [manufacturerData, setManufacturerData] = React.useState<any[]>([]);
  const manufacturerFetcher = async () => {
    const manufacturer = await axiosFunction({
      urlPath: '/manufacturer/find_for_dd',
    }).then((res) => res.data);
    setManufacturerData(manufacturer);
  };
  React.useEffect(() => {
    manufacturerFetcher();
  }, []);
  //
  var localData: any = {};
  if (typeof window != 'undefined' && isUpdate) {
    localData = JSON.parse(localStorage.getItem('vendor_data')!);
  }
  const form = useForm({
    validateInputOnChange: true,
    initialValues: isUpdate
      ? { ...localData }
      : {
          status: false,
          vendor_name: '',
          procurement_category: [],
          vendor_classification: '',
          manufacturer: [],
          ntn: '',
          cnic: '',
          cnic_expiry_date: new Date(),
          line_of_business: '',
          tax_exemption_validity: new Date(),
          with_hold_tax_group: '',
          with_hold_tax_percentage: '',
          sales_tax_group: '',
          sales_tax_percentage: '',
          strn: '',
          drug_license_no: '',
          tax_status: 'filer',
          drug_sales_license: 'yes',
          tax_exemption: 'yes',
          contact_person: '',
          poc_phone_number: '',
          poc_email: '',
          business_address: '',
          city: '',
          business_phone_number: '',
          email_address: '',
          payment_terms: '',
          payment_method: '',
          vendor_credit_limit: '',
          delivery_lead_time: '',
          bank_name: '',
          bank_branch_code: '',
          branch_city: '',
          account_ibn_number: '',
          vendor_wise_discount: '',
          stock_return_policy: '',
          advance_income_tax: '',
          gst: '',
          minimum_order_quantity: '',
          file_attachment: null,
          comment: '',
        },
    // validate: (values: any) => {
    //   return {
    //     vendor_credit_limit: Validator.formValidator({
    //       name: 'vendor_credit_limit',
    //       type: 'double',
    //       values: values.vendor_credit_limit.toString(),
    //     }),
    //     ntn: Validator.formValidator({
    //       name: 'ntn',
    //       type: 'number',
    //       values: values.ntn.toString(),
    //     }),
    //     cnic: Validator.formValidator({
    //       name: 'cnic',
    //       type: 'number',
    //       values: values.ntn.toString(),
    //     }),
    //     strn: Validator.formValidator({
    //       name: 'strn',
    //       type: 'number',
    //       values: values.ntn.toString(),
    //     }),
    //     drug_license_no: Validator.formValidator({
    //       name: 'drug_license_no',
    //       type: 'number',
    //       values: values.ntn.toString(),
    //     }),
    //     poc_phone_number: Validator.formValidator({
    //       name: 'poc_phone_number',
    //       type: 'phone',
    //       values: values.ntn.toString(),
    //     }),
    //     business_phone_number: Validator.formValidator({
    //       name: 'business_phone_number',
    //       type: 'phone',
    //       values: values.ntn.toString(),
    //     }),
    //     poc_email: Validator.formValidator({
    //       name: 'poc_email',
    //       type: 'email',
    //       values: values.ntn.toString(),
    //     }),
    //     email_address: Validator.formValidator({
    //       name: 'email_address',
    //       type: 'email',
    //       values: values.ntn.toString(),
    //     }),
    //   };
    // },
  });
  //
  async function submitHandler(values: any) {
    if (values.manufacturer.length === 0) {
      customNotification({
        message: 'Select at least one manufacturer!',
        title: 'Failed',
      });

      return;
    }
    const url_temp = isUpdate ? '/vendor/update/' : '/vendor/create/';
    var procurement_category = JSON.stringify(values.procurement_category);
    //
    const vendor_id_response = await axiosFunction({
      urlPath: url_temp,
      data: {
        ...values,
        procurement_category,
      },
      method: 'POST',
    });

    router.push('/dashboard/vendors/');
    setVendorData([]);
    const new_vendor_id = vendor_id_response.data[0].id;
    customNotification({
      message: `Vendor with ID: ${[new_vendor_id]} ${
        isUpdate ? 'Updated' : 'Created'
      } successfully!`,
      title: 'Success',
    });
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
          label="Vendor Status"
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
        placeholder="Enter Vendor Name"
        size="md"
        label="Vendor Name"
        required
        withAsterisk
        type={'text'}
        {...form.getInputProps('vendor_name')}
      />
      <MultiSelect
        className="w-[47%]"
        data={VendorDropDownValues.procurement_category}
        placeholder="Pick Procurement Category"
        size="md"
        label="Procurement Category"
        withAsterisk
        required
        searchable
        nothingFound="Nothing found"
        clearable
        {...form.getInputProps('procurement_category')}
      />

      <DualListBoxComponent
        label="Manufacturer"
        data={manufacturerData.map((each_cat: any) => {
          return {
            label: each_cat.manufacturer_name,
            value: each_cat.id,
          };
        })}
        {...form.getInputProps('manufacturer')}
      />
      <Select
        className="w-[100%]"
        placeholder="Pick Vendor Classification"
        size="md"
        label="Vendor Classification"
        required
        withAsterisk
        searchable
        nothingFound="No options"
        data={VendorDropDownValues.vendor_classification}
        {...form.getInputProps('vendor_classification')}
      />
      <TextInput
        className="w-[31%]"
        placeholder="Enter NTN"
        size="md"
        label="NTN"
        // required
        // withAsterisk
        type={'text'}
        {...form.getInputProps('ntn')}
      />
      <TextInput
        className="w-[31%]"
        placeholder="Enter CNIC No"
        size="md"
        label="CNIC No"
        // required
        // withAsterisk
        type={'text'}
        {...form.getInputProps('cnic')}
      />
      <DateInput
        className="w-[31%]"
        placeholder="Pick CNIC Expiry Date"
        size="md"
        label="CNIC Expiry Date"
        // required
        // withAsterisk
        {...form.getInputProps('cnic_expiry_date')}
      />
      <Radio.Group
        className="w-[31%]"
        name="tax_status"
        label="Select Tax Status"
        size="md"
        withAsterisk
        {...form.getInputProps('tax_status')}
      >
        <Radio value="filer" label="Filer" />
        <Radio value="non-filer" label="Non-Filer" />
      </Radio.Group>
      <Radio.Group
        className="w-[31%]"
        name="drug_sales_license"
        label="Select Drug Sale License"
        size="md"
        withAsterisk
        {...form.getInputProps('drug_sales_license')}
      >
        <Radio value="yes" label="Yes" />
        <Radio value="no" label="No" />
      </Radio.Group>
      <Radio.Group
        className="w-[31%]"
        name="tax_exemption"
        label="Select Tax Exemption"
        size="md"
        withAsterisk
        {...form.getInputProps('tax_exemption')}
      >
        <Radio value="yes" label="Yes" />
        <Radio value="no" label="No" />
      </Radio.Group>
      <DateInput
        className="w-[47%]"
        placeholder="Pick Tax Exemption Validity"
        size="md"
        label="Tax Exemption Validity"
        disabled={form.getInputProps('tax_exemption').value === 'no'}
        required={form.getInputProps('tax_exemption').value === 'yes'}
        withAsterisk={form.getInputProps('tax_exemption').value === 'yes'}
        {...form.getInputProps('tax_exemption_validity')}
      />
      <Select
        className="w-[47%]"
        placeholder="Pick With Hold Tax Group"
        size="md"
        label="With Hold Tax Group"
        // required
        // withAsterisk
        searchable
        nothingFound="No options"
        data={[]}
        {...form.getInputProps('with_hold_tax_group')}
      />
      <Select
        className="w-[47%]"
        placeholder="Pick With Hold Tax Percentage"
        size="md"
        label="With Hold Tax Percentage"
        // required
        // withAsterisk
        searchable
        nothingFound="No options"
        data={[]}
        {...form.getInputProps('with_hold_tax_percentage')}
      />
      <TextInput
        className="w-[47%]"
        placeholder="Enter STRN"
        size="md"
        label="STRN"
        // required
        // withAsterisk
        type={'text'}
        {...form.getInputProps('strn')}
      />
      <TextInput
        className="w-[100%]"
        placeholder="Enter Drug License No"
        size="md"
        label="Drug License No"
        // required
        // withAsterisk
        type={'text'}
        {...form.getInputProps('drug_license_no')}
      />
      <TextInput
        className="w-[31%]"
        placeholder="Enter Contact Person"
        size="md"
        label="Contact Person"
        // required
        // withAsterisk
        type={'text'}
        {...form.getInputProps('contact_person')}
      />
      <TextInput
        className="w-[31%]"
        placeholder="Enter POC Phone Number"
        size="md"
        label="POC Phone Number"
        // required
        // withAsterisk
        type={'text'}
        {...form.getInputProps('poc_phone_number')}
      />
      <TextInput
        className="w-[31%]"
        placeholder="Enter POC Email Address"
        size="md"
        label="POC Email Address"
        // required
        // withAsterisk
        type={'text'}
        {...form.getInputProps('poc_email')}
      />
      <TextInput
        className="w-[47%]"
        placeholder="Enter Business Address"
        size="md"
        label="Business Address"
        // required
        // withAsterisk
        type={'text'}
        {...form.getInputProps('business_address')}
      />
      <Select
        className="w-[47%]"
        placeholder="Pick City"
        size="md"
        label="City"
        // required
        // withAsterisk
        searchable
        nothingFound="No options"
        data={VendorDropDownValues.city}
        {...form.getInputProps('city')}
      />
      <TextInput
        className="w-[47%]"
        placeholder="Enter Business Phone Number"
        size="md"
        label="Business Phone Number"
        // required
        // withAsterisk
        type={'text'}
        {...form.getInputProps('business_phone_number')}
      />
      <TextInput
        className="w-[47%]"
        placeholder="Enter Email Address"
        size="md"
        label="Email Address"
        required
        withAsterisk
        type={'text'}
        {...form.getInputProps('email_address')}
      />
      <Select
        className="w-[47%]"
        placeholder="Pick Payment Terms"
        size="md"
        label="Payment Terms"
        required
        withAsterisk
        searchable
        nothingFound="No options"
        data={VendorDropDownValues.payment_terms}
        {...form.getInputProps('payment_terms')}
      />
      <Select
        className="w-[47%]"
        placeholder="Pick Payment Method"
        size="md"
        label="Payment Method"
        // required
        // withAsterisk
        searchable
        nothingFound="No options"
        data={VendorDropDownValues.method_of_payment}
        {...form.getInputProps('payment_method')}
      />
      <TextInput
        className="w-[47%]"
        placeholder="Enter Vendor Credit Limit"
        size="md"
        label="Vendor Credit Limit"
        // required
        // withAsterisk
        type={'text'}
        {...form.getInputProps('vendor_credit_limit')}
      />
      <TextInput
        className="w-[47%]"
        placeholder="Enter Lead Time"
        size="md"
        label="Lead Time"
        // required
        // withAsterisk
        type={'text'}
        {...form.getInputProps('delivery_lead_time')}
      />
      <Select
        className="w-[31%]"
        placeholder="Pick Bank Name"
        size="md"
        label="Bank Name"
        // required
        // withAsterisk
        searchable
        nothingFound="No options"
        data={VendorDropDownValues.bank_name}
        {...form.getInputProps('bank_name')}
      />
      <TextInput
        className="w-[31%]"
        placeholder="Enter Branch Code"
        size="md"
        label="Branch Code"
        // required
        // withAsterisk
        type={'text'}
        {...form.getInputProps('bank_branch_code')}
      />
      <Select
        className="w-[31%]"
        placeholder="Pick Branch City"
        size="md"
        label="Branch City"
        // required
        // withAsterisk
        searchable
        nothingFound="No options"
        data={VendorDropDownValues.city}
        {...form.getInputProps('branch_city')}
      />
      <TextInput
        className="w-[47%]"
        placeholder="Enter IBAN Number"
        size="md"
        label="IBAN Number"
        // required
        // withAsterisk
        type={'text'}
        {...form.getInputProps('account_ibn_number')}
      />
      <Select
        className="w-[47%]"
        placeholder="Pick Stock Return Policy"
        size="md"
        label="Stock Return Policy"
        // required
        // withAsterisk
        searchable
        nothingFound="No options"
        data={VendorDropDownValues.stock_return_policy}
        {...form.getInputProps('stock_return_policy')}
      />
      <FileInput
        placeholder="Select your document"
        label="Document"
        size="md"
        className="w-full"
      />
      <Button
        // disabled={submitButtonDisabler}
        size="md"
        className="ml-auto w-56 bg-red-500"
        type={'submit'}
      >
        {isUpdate ? 'Update' : 'Submit'}
      </Button>
    </form>
  );
}
//
export default function HandleVendorsPage({ isUpdate }: { isUpdate: boolean }) {
  return (
    <section className="flex min-h-[100%] flex-col gap-5 p-7">
      <Header isUpdate={isUpdate} />
      <div className="rounded-md border border-gray-100 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b-[1px] p-5">
          <p className="py-2 font-semibold text-gray-500">
            Here you can manage your all Add and Update Vendors!
          </p>
        </div>
        <Form isUpdate={isUpdate} />
      </div>
    </section>
  );
}
