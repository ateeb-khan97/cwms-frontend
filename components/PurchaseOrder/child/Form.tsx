'use client';
import { Select } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import axiosFunction from 'functions/axiosFunction';
//
import React from 'react';
//
type formDataType = {
  vendor: string;
  expected_delivery_data: string;
  delivery_location: string;
  order_type: string;
};
//
export default function Form({ setTableData }: { setTableData: Function }) {
  const [formData, setFormData] = React.useState<formDataType>({
    delivery_location: '',
    expected_delivery_data: new Date().toString(),
    order_type: '',
    vendor: '',
  });
  const [vendorData, setVendorData] = React.useState<any[]>([]);
  const [locationData, setLocationData] = React.useState<any[]>([]);
  //functions
  const inputHandler = (name: string, value: string) => {
    setFormData((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });
  };
  //
  const vendorFetcher = async () => {
    const vendor = await axiosFunction({ urlPath: '/vendor/find_for_po' }).then(
      (res) => res.data,
    );
    setVendorData(vendor);
  };
  const locationFetcher = async () => {
    const location = await axiosFunction({ urlPath: '/location/find' }).then(
      (res) => res.data,
    );
    setLocationData(location);
  };
  const productFetcher = async (ids: any[]) => {
    setTableData([]);
    const response = await axiosFunction({
      urlPath: '/product/find_in_ids',
      method: 'POST',
      data: { ids },
    }).then((res) => res.data);
    const product = response.map((each_prod, index) => {
      return {
        id: each_prod.id,
        product_name: each_prod.product_name,
        sales_tax_percentage: each_prod.sales_tax_percentage,
        index,
        disabled: true,
        foc: false,
        trade_price: '0',
        trade_discount: '0',
        selling_unit: each_prod.product_conversions[1].selling_unit,
        item_conversion: each_prod.product_conversions[1].item_conversion,
        manufacturer_name: each_prod.manufacturer.manufacturer_name,
        manufacturer_id: each_prod.manufacturer.id,
        required_quantity: each_prod.quantity == '' ? each_prod.quantity : '0',
      };
    });
    setTableData(product);
  };
  //
  React.useEffect(() => {
    vendorFetcher();
    locationFetcher();
  }, []);
  React.useEffect(() => {
    if (formData.vendor != '') {
      const vendor = JSON.parse(formData.vendor);
      const product_ids = vendor.products.map((each_prod: any) => {
        return each_prod.id;
      });
      productFetcher(product_ids);
    }
  }, [formData.vendor]);
  //
  return (
    <>
      <div className="flex flex-wrap justify-between gap-5 p-5">
        <Select
          className="w-[47%]"
          label="Vendor"
          placeholder="Select Vendor"
          searchable
          nothingFound="No options"
          required
          withAsterisk
          size="md"
          value={formData.vendor}
          onChange={(value) => inputHandler('vendor', value!)}
          data={vendorData.map((each_vendor) => {
            return {
              value: JSON.stringify(each_vendor),
              label: each_vendor.vendor_name,
            };
          })}
        />
        <DatePicker
          className="w-[47%]"
          placeholder="Select Date"
          label="Expected Delivery Date"
          required
          withAsterisk
          size="md"
          value={new Date(formData.expected_delivery_data)}
          onChange={(value) =>
            inputHandler('expected_delivery_data', value!.toString())
          }
        />
        <Select
          className="w-[47%]"
          label="Delivery Location"
          placeholder="Select Delivery Location"
          searchable
          nothingFound="No options"
          required
          withAsterisk
          size="md"
          data={locationData.map((each_loc) => {
            return {
              value: each_loc.loc_code,
              label: each_loc.loc_name,
            };
          })}
          value={formData.delivery_location}
          onChange={(value) => inputHandler('delivery_location', value!)}
        />
        <Select
          className="w-[47%]"
          label="Order Type"
          placeholder="Select Order Type"
          searchable
          nothingFound="No options"
          required
          withAsterisk
          size="md"
          data={['Normal', 'Advance']}
          value={formData.order_type}
          onChange={(value) => inputHandler('order_type', value!)}
        />
      </div>
    </>
  );
}
