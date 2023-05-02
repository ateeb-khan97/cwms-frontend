'use client';
//
import { useForm } from '@mantine/form';
import { ProductFormType } from 'modules/Products/productType';
import {
  Button,
  MultiSelect,
  Radio,
  Select,
  Switch,
  TextInput,
} from '@mantine/core';
import { ProductDropDownData } from 'modules/Products/productData';
import React, { useEffect } from 'react';
import RichTextComponent from 'components/Shared/RichTextComponent';
import { useRouter } from 'next/navigation';
import axiosFunction from 'functions/axiosFunction';
import DualListBoxComponent from 'components/Shared/DualListBoxComponent';
import customNotification from 'functions/customNotification';
import useProductData from 'modules/Products/useProductData';
import Loader from 'components/Shared/Loader';
//
//
export default function HandleProductPage({ isUpdate }: { isUpdate: boolean }) {
  const router = useRouter();
  const { setProductData } = useProductData();
  const [manufacturerData, setManufacturerData] = React.useState<any[]>([]);
  const [vendorData, setVendorData] = React.useState<any[]>([]);
  //
  const [categoryData, setCategoryData] = React.useState<any[]>([]);
  //
  const manufacturerFetcher = async () => {
    const manufacturer = await axiosFunction({
      urlPath: '/manufacturer/find_for_dd',
    }).then((res) => res.data);
    setManufacturerData(manufacturer);
  };
  const categoryFetcher = async () => {
    const category = await axiosFunction({
      urlPath: `/category/find_for_dd`,
    }).then((res) => res.data);
    setCategoryData(category);
  };
  const vendorFetcher = async () => {
    const vendor = await axiosFunction({
      urlPath: '/vendor/find_for_product',
    }).then((res) => res.data);
    setVendorData(vendor);
  };
  //
  React.useEffect(() => {
    manufacturerFetcher();
    categoryFetcher();
    vendorFetcher();
  }, []);
  //
  const [productTags, setProductTags]: any[] = React.useState([]);
  const [productGenericFormula, setProductGenericFormula]: any[] =
    React.useState([]);
  //
  var localData: any = {};
  const [myFlag, setMyFlag] = React.useState<boolean>(true);
  if (typeof window != 'undefined' && isUpdate) {
    if (myFlag) {
      localData = JSON.parse(localStorage.getItem('product_data')!);
      setProductTags(localData.productTags);
      setProductGenericFormula(localData.productGenericFormula);
      setMyFlag(false);
    }
  }
  //
  const form = useForm({
    initialValues: isUpdate
      ? {
          ...localData,
          margin: localData.margin == '' ? 0 : localData.margin,
        }
      : {
          status: false,
          product_name: '',
          sku_description: '',
          sku_department: '',
          item_nature: '',
          trade_discount: 0,
          manufacturer_id: '',
          tax_code: '',
          purchasing_unit: '',
          trade_price: 0,
          discounted_price: '',
          maximum_retail_price: 0,
          sku_minimum_level: '',
          sku_maximum_level: '',
          sku_reorder_level: '',
          sku_warehouse_lead_time: '',
          item_release_level: '',
          price_levels: '',
          stock_nature: '',
          bar_code: '',
          item_storage_location: '',
          selling_discount: '',
          item_tracking_level: '',
          product_lifecycle: '',
          sales_tax_group: '',
          sales_tax_percentage: '',
          quantity: 0,
          prescription_required: false,
          drap_id: '',
          dosage_instruction: '',
          side_effects: '',
          pct_code: '',
          discount_type: 'price',
          margin: 0,
          purchasing_price: 0,
          productTags: [],
          category: [],
          vendor: [],
          productGenericFormula: [],
          product_conversion_su_1: 'Carton',
          product_conversion_ic_1: '1',
          product_conversion_su_2: '',
          product_conversion_ic_2: '1',
          product_conversion_su_3: '',
          product_conversion_ic_3: '1',
          mrp_unit_price: 0,
          comment: '',
        },
  });
  // functions
  // const FormType ;
  async function submitHandler(values: ProductFormType) {
    if (values.category.length == 0) {
      customNotification({
        message: 'Please select at least one category!',
        title: 'Failed',
      });
      return;
    }
    if (values.vendor.length == 0) {
      customNotification({
        message: 'Please select at least one vendor!',
        title: 'Failed',
      });
      return;
    }

    //
    var productConversion: any[] = [];
    productConversion[0] = {
      selling_unit: values.product_conversion_su_1,
      item_conversion: values.product_conversion_ic_1,
    };
    productConversion[1] = {
      selling_unit: values.product_conversion_su_2,
      item_conversion: values.product_conversion_ic_2,
    };
    if (values.product_conversion_su_2 == 'Box') {
      productConversion.push({
        selling_unit: values.product_conversion_su_3,
        item_conversion: values.product_conversion_ic_3,
      });
    }
    //
    const url_temp = isUpdate ? '/product/update/' : '/product/create/';
    const data_to_send_temp = {
      ...values,
      product_tag: values.productTags,
      product_generic_formula: values.productGenericFormula,
      product_conversion: productConversion,
      sales_tax_percentage: values.sales_tax_group?.substring(0, 1),
      margin: +values.mrp_unit_price - +values.trade_price,
    };
    //
    const product_id_response = await axiosFunction({
      urlPath: url_temp,
      data: data_to_send_temp,
      method: 'POST',
    });
    //
    setProductData([]);
    //
    const new_product_id = product_id_response.data[0].id;
    customNotification({
      message: `Product with ID: ${[new_product_id]} ${
        isUpdate ? 'Updated' : 'Created'
      } successfully!`,
      title: 'Success',
    });
    //
    router.push('/dashboard/products');
  }
  //
  return (
    <>
      <form
        onSubmit={form.onSubmit(submitHandler)}
        className="flex flex-wrap justify-between gap-5 p-5"
      >
        <div className="flex h-[69px] w-[100%] justify-between">
          <Switch
            size="md"
            className={
              form.getInputProps('status').value ? 'w-[100%]' : 'w-[47%]'
            }
            label="Product Status"
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
        <Switch
          size="md"
          className="w-[100%]"
          label="Prescription Required"
          description="Yes / No"
          {...form.getInputProps('prescription_required', {
            type: 'checkbox',
          })}
        />
        <TextInput
          className="w-[47%]"
          placeholder="Enter Product Name"
          size="md"
          label="Product Name"
          required
          withAsterisk
          type={'text'}
          {...form.getInputProps('product_name')}
        />
        <Select
          className="w-[47%]"
          placeholder="Pick SKU Department"
          size="md"
          label="SKU Department"
          required
          withAsterisk
          searchable
          nothingFound="No options"
          data={ProductDropDownData.sku_department}
          {...form.getInputProps('sku_department')}
        />
        <Select
          className="w-[47%]"
          placeholder="Pick Item Nature"
          size="md"
          label="Item Nature"
          required
          withAsterisk
          searchable
          nothingFound="No options"
          data={ProductDropDownData.item_nature}
          {...form.getInputProps('item_nature')}
        />
        <TextInput
          className="w-[47%]"
          size="md"
          label="Trade Price"
          type={'text'}
          {...form.getInputProps('trade_price')}
          disabled
        />
        <TextInput
          className="w-[47%]"
          size="md"
          label="Maximum Retail Price"
          type={'text'}
          {...form.getInputProps('maximum_retail_price')}
          disabled
        />
        <TextInput
          className="w-[47%]"
          size="md"
          label="Trade Discount"
          type={'text'}
          {...form.getInputProps('trade_discount')}
          disabled
        />
        <TextInput
          className="w-full"
          size="md"
          label="PCT Code"
          placeholder="Enter PCT Code"
          type={'text'}
          {...form.getInputProps('pct_code')}
        />
        <div className="flex w-[100%] justify-between">
          <TextInput
            className="w-[31%]"
            size="md"
            label="Maximum Retail Unit Price"
            type={'text'}
            {...form.getInputProps('mrp_unit_price')}
            disabled
          />

          {form.getInputProps('discount_type').value == 'price' ? (
            <TextInput
              placeholder="Enter Discount Price"
              className="w-[31%]"
              size="md"
              label="Discount Price"
              type={'text'}
              {...form.getInputProps('discounted_price')}
            />
          ) : (
            <TextInput
              placeholder="Enter Discount Percentage"
              className="w-[31%]"
              size="md"
              label={`Discount Percentage ${(
                (+form.getInputProps('discounted_price').value / 100) *
                +form.getInputProps('mrp_unit_price').value
              ).toFixed(2)}`}
              type={'text'}
              {...form.getInputProps('discounted_price')}
            />
          )}

          <Radio.Group
            className="w-[31%]"
            orientation="vertical"
            label="Select Discount Type"
            spacing="xs"
            offset="md"
            size="md"
            {...form.getInputProps('discount_type')}
          >
            <Radio value="price" label="Discounted Price" />
            <Radio value="percentage" label="Discounted Percentage" />
          </Radio.Group>
        </div>
        <TextInput
          className="w-[47%]"
          size="md"
          label="Margins"
          type={'text'}
          {...form.getInputProps('margin')}
          disabled
        />
        <TextInput
          className="w-[47%]"
          size="md"
          label="Purchasing Price"
          type={'text'}
          {...form.getInputProps('purchasing_price')}
          disabled
        />
        <TextInput
          className="w-[47%]"
          placeholder="Enter SKU Minimum Level"
          size="md"
          label="SKU Minimum Level"
          type={'text'}
          {...form.getInputProps('sku_minimum_level')}
        />
        <TextInput
          className="w-[47%]"
          placeholder="Enter SKU Maximum Level"
          size="md"
          label="SKU Maximum Level"
          type={'text'}
          {...form.getInputProps('sku_maximum_level')}
        />
        <Select
          className="w-[47%]"
          placeholder="Pick Sales Tax Group"
          size="md"
          label="Sales Tax Group"
          required
          withAsterisk
          searchable
          nothingFound="No options"
          data={ProductDropDownData.sales_tax_group}
          {...form.getInputProps('sales_tax_group')}
        />
        <TextInput
          className="w-[47%]"
          size="md"
          label="Sales Tax Percentage"
          type={'text'}
          value={form.getInputProps('sales_tax_group').value?.substring(0, 1)}
          readOnly
        />
        <TextInput
          className="w-[47%]"
          placeholder="Enter SKU Reorder Level"
          size="md"
          label="SKU Reorder Level"
          type={'text'}
          {...form.getInputProps('sku_reorder_level')}
        />
        <TextInput
          className="w-[47%]"
          placeholder="Enter SKU Warehouse Lead Time"
          size="md"
          label="SKU Warehouse Lead Time"
          type={'text'}
          {...form.getInputProps('sku_warehouse_lead_time')}
        />

        <Select
          className="w-[47%]"
          placeholder="Pick Item Release Level"
          size="md"
          label="Item Release Level"
          searchable
          nothingFound="No options"
          data={ProductDropDownData.item_release_level}
          {...form.getInputProps('item_release_level')}
        />
        <Select
          className="w-[47%]"
          placeholder="Pick Price Level"
          size="md"
          label="Price Level"
          searchable
          nothingFound="No options"
          data={ProductDropDownData.price_levels}
          {...form.getInputProps('price_levels')}
        />
        <Select
          className="w-[47%]"
          placeholder="Pick Stock Nature"
          size="md"
          label="Stock Nature"
          required
          withAsterisk
          searchable
          nothingFound="No options"
          data={ProductDropDownData.stock_nature}
          {...form.getInputProps('stock_nature')}
        />
        <TextInput
          className="w-[47%]"
          placeholder="Enter Barcode"
          size="md"
          label="Barcode"
          type={'text'}
          {...form.getInputProps('bar_code')}
        />
        <TextInput
          className="w-[47%]"
          placeholder="Enter Drap ID"
          size="md"
          label="Drap ID"
          type={'text'}
          {...form.getInputProps('drap_id')}
        />
        <TextInput
          className="w-[47%]"
          placeholder="Enter Dosage Instructions"
          size="md"
          label="Dosage Instructions"
          type={'text'}
          {...form.getInputProps('dosage_instruction')}
        />
        <TextInput
          className="w-[100%]"
          placeholder="Enter Side Effects"
          size="md"
          label="Side Effects"
          type={'text'}
          {...form.getInputProps('side_effects')}
        />
        <div className="flex w-[100%] flex-col gap-2 rounded-md border p-5 shadow-md">
          <header className="flex justify-between">
            <label className="mantine-InputWrapper-label mantine-Select-label mantine-1js7218">
              Item Conversion
            </label>
            <div className="mantine-InputWrapper-label mantine-Select-label mantine-1js7218 flex flex-col">
              <span>
                1 Carton Contains{' '}
                {form.getInputProps('product_conversion_ic_2').value}{' '}
                {form.getInputProps('product_conversion_su_2').value}
              </span>
              <span
                className={`transition ${
                  form.getInputProps('product_conversion_su_2').value == 'Box'
                    ? 'scale-100'
                    : 'h-0 scale-0'
                }`}
              >
                1{' ' + form.getInputProps('product_conversion_su_2').value}{' '}
                Contains
                {' ' + form.getInputProps('product_conversion_ic_3').value}{' '}
                {form.getInputProps('product_conversion_su_3').value}
              </span>
            </div>
          </header>

          <div className="flex w-[100%] justify-between">
            <Select
              className="w-[47%]"
              placeholder="Pick Selling Unit"
              size="md"
              label="Selling Unit"
              required
              withAsterisk
              searchable
              nothingFound="No options"
              data={['Carton']}
              disabled
              {...form.getInputProps('product_conversion_su_1')}
            />
            <TextInput
              className="w-[47%]"
              placeholder="Enter Item Conversion"
              size="md"
              label="Item Conversion"
              required
              withAsterisk
              type={'text'}
              disabled
              {...form.getInputProps('product_conversion_ic_1')}
            />
          </div>
          <div className="flex w-[100%] justify-between">
            <Select
              className="w-[47%]"
              placeholder="Pick Selling Unit"
              size="md"
              // label="Selling Unit"
              required
              withAsterisk
              searchable
              nothingFound="No options"
              data={['Box', 'Pieces']}
              disabled={isUpdate}
              {...form.getInputProps('product_conversion_su_2')}
            />
            <TextInput
              className="w-[47%]"
              placeholder="Enter Item Conversion"
              size="md"
              // label="Item Conversion"
              required
              withAsterisk
              type={'text'}
              disabled={isUpdate}
              {...form.getInputProps('product_conversion_ic_2')}
            />
          </div>
          <div
            className={`flex w-[100%] justify-between transition-all ${
              form.getInputProps('product_conversion_su_2').value == 'Box'
                ? 'scale-100'
                : 'h-0 scale-0'
            }`}
          >
            <Select
              className="relative z-[999] w-[47%]"
              placeholder="Pick Selling Unit"
              size="md"
              // label="Selling Unit"
              required={
                form.getInputProps('product_conversion_su_2').value == 'Box'
              }
              withAsterisk
              searchable
              nothingFound="No options"
              data={['Pieces', 'Strips']}
              disabled={isUpdate}
              {...form.getInputProps('product_conversion_su_3')}
            />
            <TextInput
              className="w-[47%]"
              placeholder="Enter Item Conversion"
              size="md"
              // label="Item Conversion"
              required={
                form.getInputProps('product_conversion_su_2').value == 'Box'
              }
              withAsterisk
              type={'text'}
              disabled={isUpdate}
              {...form.getInputProps('product_conversion_ic_3')}
            />
          </div>
        </div>
        <Select
          className="w-[100%]"
          placeholder="Pick Manufacturer"
          size="md"
          label="Manufacturer"
          required
          withAsterisk
          searchable
          nothingFound="No options"
          data={
            manufacturerData.length == 0
              ? []
              : manufacturerData.map((each_manu) => {
                  return {
                    value: each_manu.id,
                    label: each_manu.manufacturer_name,
                  };
                })
          }
          {...form.getInputProps('manufacturer_id')}
        />

        <DualListBoxComponent
          label="Categories"
          data={
            categoryData.length == 0
              ? []
              : categoryData.map((each_cat: any) => {
                  return {
                    label: each_cat.category_name,
                    value: each_cat.id,
                  };
                })
          }
          {...form.getInputProps('category')}
        />
        <DualListBoxComponent
          label="Vendors"
          data={
            vendorData.length == 0
              ? []
              : vendorData.map((each_cat: any) => {
                  return {
                    label: each_cat.vendor_name,
                    value: each_cat.id,
                  };
                })
          }
          {...form.getInputProps('vendor')}
        />

        <MultiSelect
          className="w-[47%]"
          size="md"
          label="Product Tags"
          data={productTags}
          placeholder="Select Product Tags"
          searchable
          creatable
          required
          withAsterisk
          getCreateLabel={(query) => `+ Create ${query}`}
          onCreate={(query) => {
            const item = { value: query, label: query };
            setProductTags((current: any) => [...current, item]);
            return item;
          }}
          {...form.getInputProps('productTags')}
        />
        <MultiSelect
          className="w-[47%]"
          size="md"
          label="Product Generic Formula"
          data={productGenericFormula}
          placeholder="Select Generic Formula"
          searchable
          creatable
          getCreateLabel={(query) => `+ Create ${query}`}
          onCreate={(query) => {
            const item = { value: query, label: query };
            setProductGenericFormula((current: any) => [...current, item]);
            return item;
          }}
          {...form.getInputProps('productGenericFormula')}
        />
        <div className="w-[100%]">
          <label className="mantine-InputWrapper-label mantine-Select-label mantine-1js7218">
            SKU Description
          </label>
          <RichTextComponent {...form.getInputProps('sku_description')} />
        </div>
        <Button
          className="ml-auto w-56 bg-red-500 transition-all  hover:scale-110 hover:bg-red-900"
          type={'submit'}
        >
          {isUpdate ? 'Update' : 'Submit'}
        </Button>
      </form>
    </>
  );
}
