'use client';

import { Button } from '@mantine/core';
import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
import axiosFunction from 'functions/axiosFunction';
import customNotification from 'functions/customNotification';
import { useRouter } from 'next/navigation';

import React from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { MdClearAll } from 'react-icons/md';
import Form from './child/Form';
import OrderCart from './child/OrderCart';
import { modals } from '@mantine/modals';
import ProductTable from './child/ProductTable';
import DataTableComponent from 'components/Shared/DataTableComponent';

//
function Header() {
  return (
    <header className="select-none text-[#3b3e66]">
      <BreadcrumbComponent />
      <h1 className="text-3xl font-semibold ">Create New Purchase Order</h1>
      <p>
        Please see Create New Purchase Order form below all connected channels
      </p>
    </header>
  );
}
//
type formDataType = {
  vendor: string;
  expected_delivery_data: string;
  delivery_location: string;
  order_type: string;
};
//
export default function AddPurchaseOrder() {
  const router = useRouter();
  const [formData, setFormData] = React.useState<formDataType>({
    delivery_location: '',
    expected_delivery_data: new Date().toString(),
    order_type: '',
    vendor: '',
  });
  const [tableData, setTableData] = React.useState([]);
  const [orderedProducts, setOrderedProducts] = React.useState<any[]>([]);
  //
  const [subtotal, setSubtotal] = React.useState(0);
  const [subtotalDiscount, setSubtotalDiscount] = React.useState(0);
  const [totalTax, setTotalTax] = React.useState(0);
  const [po_id, set_po_id] = React.useState<number>(0);
  //

  React.useEffect(() => {
    var total_temp = 0;
    var total_discount_temp = 0;
    var tax_temp = 0;
    orderedProducts.length > 0
      ? orderedProducts.forEach((each_product: any) => {
          total_temp = total_temp + +each_product.total_price;
          total_discount_temp =
            total_discount_temp +
            +each_product.trade_price_after_trade_discount;
          tax_temp = tax_temp + +each_product.trade_price_after_applying_gst;
        })
      : null;
    setSubtotal(+total_temp);
    setSubtotalDiscount(+total_discount_temp);
    setTotalTax(+tax_temp);
  }, [orderedProducts.length]);
  //
  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const [vendor] = await axiosFunction({
      urlPath: '/vendor/find_for_creation',
      method: 'POST',
      data: { id: JSON.parse(formData.vendor).id },
    }).then((res) => res.data);
    //
    const dataToSend = {
      vendor_id: vendor.id,
      vendor_name: vendor.vendor_name,
      address: vendor.business_address,
      city: vendor.city,
      ntn: vendor.ntn,
      advance_income: vendor.tax_status === 'Filer' ? '0.25' : '0.5',
      strn: vendor.strn,
      payment_terms: vendor.payment_terms,
      po_type: vendor.vendor_classification,
      po_date: new Date(),
      expected_delivery_date: formData.expected_delivery_data,
      order_type: formData.order_type,
      delivery_location: formData.delivery_location,
      orders: orderedProducts,
      total_amount: subtotal,
      total_discount: subtotalDiscount,
      sales_tax: totalTax,
      net_amount: subtotal + totalTax - subtotalDiscount,
    };
    //
    const [response] = await axiosFunction({
      data: dataToSend,
      method: 'POST',
      urlPath: '/purchase_order/create/',
    }).then((res) => res.data);
    set_po_id(response.po_id);
    customNotification({
      message: `Purchase Order ID:${response.po_id} created successfully!`,
    });
    setTimeout(() => {
      router.push('/dashboard/purchase_order/');
    }, 3000);
  };
  //
  const vendorFetcher = async (id: number) => {
    const [vendor] = await axiosFunction({
      urlPath: '/vendor/find_for_po',
      method: 'POST',
      data: { id },
    }).then((res) => res.data);

    setFormData((pre) => {
      return {
        ...pre,
        vendor: JSON.stringify(vendor),
      };
    });
    modals.close('modal_id');
  };
  //
  const modalOpen = async () => {
    const vendor = await axiosFunction({
      urlPath: '/product/find_for_search_table',
    }).then((res) => res.data);
    modals.open({
      modalId: 'modal_id',
      title: 'Search Product',
      size: 'xl',
      children: (
        <DataTableComponent
          data={vendor}
          onRowClick={(row) => {
            vendorFetcher(row.vendors[0].id);
          }}
          columns={[
            {
              name: 'Prod. ID',
              selector: (row: any) => row.id,
              grow: 0,
              center: true,
              width: '70px',
            },
            {
              name: 'Product',
              selector: (row: any) => row.product_name,
              grow: 1,
              center: true,
            },
            {
              name: 'Vendor. ID',
              selector: (row: any) => row.vendors[0].id,
              grow: 0,
              center: true,
              width: '70px',
            },
            {
              name: 'Vendor. ID',
              selector: (row: any) => row.vendors[0].vendor_name,
              grow: 1,
              center: true,
            },
          ]}
        />
      ),
    });
  };
  //
  const clearFunction = () => {
    setFormData({
      delivery_location: '',
      expected_delivery_data: new Date().toString(),
      order_type: '',
      vendor: '',
    });
    setTableData([]);
    setOrderedProducts([]);
    setSubtotal(0);
    setSubtotalDiscount(0);
    setTotalTax(0);
    set_po_id(0);
  };
  //
  return (
    <section className="flex min-h-[100%] flex-col gap-10 p-7">
      <Header />
      <div className="rounded-md border border-gray-100 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b-[1px] p-5">
          <p className="py-2 font-semibold text-gray-500">
            Here you can manage your all Create Purchase Order!
          </p>
        </div>
        <form onSubmit={submitHandler} className="flex flex-col gap-5">
          <div className="flex gap-5 p-5">
            <Button
              type={'button'}
              onClick={modalOpen}
              leftIcon={<AiOutlineSearch />}
              disabled={formData.vendor != ''}
              className="bg-red-500 transition-all hover:scale-110 hover:bg-red-900"
            >
              Search Product
            </Button>
            <Button
              type={'button'}
              leftIcon={<MdClearAll />}
              onClick={clearFunction}
              disabled={formData.vendor == ''}
              className="bg-blue-500 transition-all hover:scale-110 hover:bg-blue-900"
            >
              Clear
            </Button>
          </div>
          <Form
            setTableData={setTableData}
            setFormData={setFormData}
            formData={formData}
          />
          <ProductTable
            tableData={tableData}
            setTableData={setTableData}
            setSubtotal={setSubtotal}
            setSubtotalDiscount={setSubtotalDiscount}
            setTotalTax={setTotalTax}
            orderedProducts={orderedProducts}
            setOrderedProducts={setOrderedProducts}
          />
          <OrderCart
            vendor_name={
              formData.vendor != ''
                ? JSON.parse(formData.vendor).vendor_name
                : ''
            }
            orderedProducts={orderedProducts}
            setOrderedProducts={setOrderedProducts}
            subtotal={subtotal}
            subtotalDiscount={subtotalDiscount}
            totalTax={totalTax}
            po_id={po_id}
          />
        </form>
      </div>
    </section>
  );
}
