'use client';

import { Button, Select, Switch, TextInput } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
import DataTableComponent from 'components/Shared/DataTableComponent';
import axiosFunction from 'functions/axiosFunction';
import customNotification from 'functions/customNotification';
import Validator from 'functions/validationFunctions';
import { useRouter } from 'next/navigation';
import React from 'react';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { RiDeleteBin7Line } from 'react-icons/ri';

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
var addToCartDisabler = true;
var purchase_order_id: number = 0;
function BodyComp() {
  const router = useRouter();

  // States
  const [orderedProducts, setOrderedProducts]: Array<any> = React.useState([]);
  const [selectedProducts, setSelectedProducts]: Array<any> = React.useState(
    [],
  );
  const [subtotal, setSubtotal] = React.useState(0);
  const [subtotalDiscount, setSubtotalDiscount] = React.useState(0);
  const [totalTax, setTotalTax] = React.useState(0);
  //
  const [selectedVendor, setSelectedVendor]: any = React.useState({});
  const [tableFresher, setTableFresher] = React.useState(false);
  const tableFresherToggler = () => {
    setTableFresher((pre: boolean) => !pre);
  };
  //
  const form = useForm({
    initialValues: {
      vendor_id: '',
      expected_delivery_date: new Date(),
      delivery_location: '',
      order_type: '',
    },
  });

  // tableInputHandler
  const tableInputHandler = (row: any, name: string, value: any) => {
    if (name === 'foc') {
      var temp_data_variable = [...selectedProducts];
      temp_data_variable[row.index] = {
        ...temp_data_variable[row.index],
        [name]: value,
        trade_price: 0,
        trade_discount: 0,
      };
      setSelectedProducts(temp_data_variable);
      return;
    }
    if (name === 'required_quantity') {
      Validator.numberValidator(value, (number_value: any) => {
        var temp_data_variable = [...selectedProducts];
        temp_data_variable[row.index] = {
          ...temp_data_variable[row.index],
          [name]: number_value,
        };
        setSelectedProducts(temp_data_variable);
      });
      return '';
    }
    Validator.decimalValidator(value, (number_value: any) => {
      var temp_data_variable = [...selectedProducts];
      temp_data_variable[row.index] = {
        ...temp_data_variable[row.index],
        [name]: number_value,
      };
      setSelectedProducts(temp_data_variable);
    });
  };
  const productFinder = async (ids: any[]) => {
    setSelectedProducts([]);
    const filtered_product_response = await axiosFunction({
      urlPath: '/product/find_in_ids',
      method: 'POST',
      data: { ids: ids },
    });
    const filtered_product: any[] = [];
    var index = 0;
    filtered_product_response.data.forEach((each_elem: any) => {
      filtered_product.push({
        id: each_elem.id,
        index: index++,
        product_name: each_elem.product_name,
        sales_tax_percentage: each_elem.sales_tax_percentage,
        required_quantity: each_elem.quantity ?? 0,
        unit_of_measurement: each_elem.product_conversions[1].selling_unit,
        disabled: true,
        foc: false,
        trade_price: 0,
        trade_discount: 0,
        product_conversion: each_elem.product_conversions,
        manufacturer: each_elem.manufacturer,
      });
    });
    setSelectedProducts(filtered_product);
  };
  React.useEffect(() => {
    if (form.getInputProps('vendor_id').value != '') {
      const product_ids: any[] = [];
      const selected_vendor = JSON.parse(form.getInputProps('vendor_id').value);
      selected_vendor.products.forEach((each_product: any) => {
        product_ids.push(each_product.id);
      });
      setSelectedVendor(selected_vendor);
      productFinder(product_ids);
    }
  }, [form.getInputProps('vendor_id').value]);

  // Row Select Function
  const rowSelectFunction = (row: any) => {
    const selected_row: any[] = row.selectedRows;
    var temp_data_variable = [...selectedProducts];
    //
    temp_data_variable = temp_data_variable.map((each_data: any) => {
      return {
        ...each_data,
        disabled: true,
      };
    });
    //
    selected_row.forEach((each_selected: any) => {
      const index = temp_data_variable.findIndex(
        (obj) => obj.index === each_selected.index,
      );
      if (index !== -1) {
        temp_data_variable[index] = {
          ...temp_data_variable[index],
          disabled: false,
        };
      }
    });
    //
    setSelectedProducts(temp_data_variable);
    //
    if (row.selectedCount > 0) {
      addToCartDisabler = false;
    } else {
      addToCartDisabler = true;
    }
  };
  // Add to Cart Function
  const addToCartFunction = () => {
    var previous_data: any[] = [...orderedProducts];
    var selected_products_temp: any[] = [];
    //
    //
    selectedProducts.forEach((each_product: any) => {
      if (!each_product.disabled) {
        if (each_product.required_quantity == 0) {
          customNotification({
            message: 'Required Quantity cannot be empty or zero!',
            title: 'Failed',
          });

          return;
        }
        var key = `${each_product.id}-${each_product.foc ? '1' : '0'}`;
        selected_products_temp.push({
          key,
          ...each_product,
        });
      }
    });
    if (selected_products_temp.length == 0) return;
    //
    var total_price = 0;
    var trade_price_after_trade_discount = 0;
    var trade_price_after_applying_gst = 0;
    //
    selected_products_temp.forEach(
      (each_selected_product: any, key: number) => {
        //

        total_price = +(
          +each_selected_product.required_quantity *
          +each_selected_product.trade_price
        ).toFixed(3);
        //
        trade_price_after_trade_discount = +(
          +(+each_selected_product.trade_discount / 100) * +total_price
        ).toFixed(3);

        //
        trade_price_after_applying_gst = +(
          +(+each_selected_product.sales_tax_percentage / 100) *
          +(+total_price - +trade_price_after_trade_discount)
        ).toFixed(3);

        var { item_conversion, selling_unit } =
          each_selected_product.product_conversion[
            each_selected_product.product_conversion.length - 1
          ];
        //
        var isOld = previous_data.findIndex(
          (each_pre: any) => each_pre['key'] === each_selected_product['key'],
        );
        if (isOld !== -1) {
          previous_data[isOld] = {
            key: each_selected_product.key,
            product_id: each_selected_product.id,
            product_name: each_selected_product.product_name,
            sales_tax_percentage: each_selected_product.sales_tax_percentage,
            required_quantity: each_selected_product.required_quantity,
            item_conversion:
              each_selected_product.unit_of_measurement == selling_unit
                ? each_selected_product.required_quantity
                : +item_conversion * +each_selected_product.required_quantity,
            last_selling_unit: selling_unit,
            manufacturer_name:
              each_selected_product.manufacturer.manufacturer_name,
            manufacturer_id: each_selected_product.manufacturer.id,
            uom: each_selected_product.unit_of_measurement,
            trade_price: each_selected_product.trade_price,
            trade_discount_percentage: each_selected_product.trade_discount,
            gst_percentage: each_selected_product.sales_tax_percentage,
            foc: each_selected_product.foc,
            status: true,
            total_price: total_price,
            trade_price_after_trade_discount: trade_price_after_trade_discount,
            trade_price_after_applying_gst: +trade_price_after_applying_gst,
          };
        } else {
          previous_data.push({
            key: each_selected_product.key,
            product_id: each_selected_product.id,
            product_name: each_selected_product.product_name,
            sales_tax_percentage: each_selected_product.sales_tax_percentage,
            required_quantity: each_selected_product.required_quantity,
            item_conversion:
              each_selected_product.unit_of_measurement == selling_unit
                ? each_selected_product.required_quantity
                : +item_conversion * +each_selected_product.required_quantity,
            last_selling_unit: selling_unit,
            manufacturer_name:
              each_selected_product.manufacturer.manufacturer_name,
            manufacturer_id: each_selected_product.manufacturer.id,
            uom: each_selected_product.unit_of_measurement,
            trade_price: each_selected_product.trade_price,
            trade_discount_percentage: each_selected_product.trade_discount,
            gst_percentage: each_selected_product.sales_tax_percentage,
            foc: each_selected_product.foc,
            status: true,
            total_price: total_price,
            trade_price_after_trade_discount: trade_price_after_trade_discount,
            trade_price_after_applying_gst: +trade_price_after_applying_gst,
          });
        }
        //
      },
    );
    //

    setOrderedProducts(previous_data);
  };
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
  const tableResetFunction = () => {
    form.reset();
    setSelectedVendor({});
    setSelectedProducts([]);
    setOrderedProducts([]);
    tableFresherToggler();
    setSubtotal(0);
    setSubtotalDiscount(0);
    setTotalTax(0);
    addToCartDisabler = true;
  };
  // submit Function
  const submitHandler = async () => {
    const dataToSend = {
      vendor_id: selectedVendor.id,
      vendor_name: selectedVendor.vendor_name,
      address: selectedVendor.business_address,
      city: selectedVendor.city,
      ntn: selectedVendor.ntn,
      advance_income: selectedVendor.tax_status === 'Filer' ? '0.25' : '0.5',
      strn: selectedVendor.strn,
      payment_terms: selectedVendor.payment_terms,
      po_type: selectedVendor.vendor_classification,
      po_date: new Date(),
      expected_delivery_date: form.getInputProps('expected_delivery_date')
        .value,
      order_type: form.getInputProps('order_type').value,
      delivery_location: form.getInputProps('delivery_location').value,
      orders: orderedProducts,
      total_amount: subtotal,
      total_discount: subtotalDiscount,
      sales_tax: totalTax,
      net_amount: subtotal + totalTax - subtotalDiscount,
    };

    const response = await axiosFunction({
      data: dataToSend,
      method: 'POST',
      urlPath: '/purchase_order/create/',
    });

    purchase_order_id = response.data[0].dataValues.id;
    // setPurchaseOrderData([]);
    customNotification({
      message: `Purchase Order ID:${purchase_order_id} created successfully!`,
      title: 'Success',
    });

    setTimeout(() => {
      router.push('/dashboard/purchase_order/');
    }, 3000);
  };
  // Modal Work
  const [modalStatus, setModalStatus] = React.useState(false);
  const modalHandler = () => {
    setModalStatus((pre) => !pre);
  };

  return (
    <>
      <form
        onSubmit={form.onSubmit(() => submitHandler())}
        className="flex flex-col gap-5 p-5"
      >
        <div className="flex gap-5">
          <Button
            type={'button'}
            onClick={modalHandler}
            className="text-md w-56 bg-[#ee2a54] font-light text-white transition-all  hover:bg-[#ef0639]"
            disabled={form.getInputProps('vendor_id').value != ''}
          >
            Search Product
          </Button>
          <Button
            style={{
              display:
                form.getInputProps('vendor_id').value === '' ? 'none' : 'block',
            }}
            type={'reset'}
            onClick={tableResetFunction}
            className="text-md w-40 bg-[#002884] font-light text-white transition-all  hover:bg-[#002884]"
          >
            Clear
          </Button>
        </div>

        <div className="flex flex-wrap justify-between gap-5">
          <Select
            className="w-[47%]"
            label="Vendor"
            placeholder="Select Vendor"
            searchable
            nothingFound="No options"
            required
            withAsterisk
            size="md"
            disabled={form.getInputProps('vendor_id').value != ''}
            data={[]}
            {...form.getInputProps('vendor_id')}
          />
          <DatePicker
            className="w-[47%]"
            placeholder="Select Date"
            label="Expected Delivery Date"
            required
            withAsterisk
            size="md"
            {...form.getInputProps('expected_delivery_date')}
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
            data={[]}
            {...form.getInputProps('delivery_location')}
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
            {...form.getInputProps('order_type')}
          />
        </div>
        <div
          className={`rounded-md shadow-md transition-all ${
            selectedProducts.length != 0
              ? 'scale-100'
              : 'h-0 scale-0 overflow-hidden'
          }`}
        >
          <div className="flex items-center justify-between border-b-2 p-5">
            <h2 className="text-[1.2rem] font-semibold text-[#3b3e66] ">
              Product Table
            </h2>
            <Button
              className="flex items-center justify-center bg-red-500"
              color={'red'}
              type={'button'}
              onClick={addToCartFunction}
              disabled={addToCartDisabler}
            >
              <span className="mr-2">Add To Cart</span>
              <span>
                <AiOutlineShoppingCart className="text-2xl" />
              </span>
            </Button>
          </div>
          <DataTableComponent
            clearSelectedRows={tableFresher}
            selectableRows={true}
            onSelectedRowsChange={rowSelectFunction}
            columns={[
              {
                name: 'ID',
                selector: (row: any) => row.id,
                grow: 0,
                center: true,
                width: '70px',
              },
              {
                name: 'Product Name',
                selector: (row: any) => row.product_name,
                grow: 2,
                sortable: true,
              },
              {
                name: 'Sales Tax Percentage',
                selector: (row: any) => <>{row.sales_tax_percentage || '0'}%</>,
                grow: 0,
                center: true,
                width: '150px',
              },
              {
                name: 'Required Quantity',
                cell: (row: any) => (
                  <TextInput
                    key={row.id}
                    placeholder={'Enter Required Quantity'}
                    size={'xs'}
                    disabled={row.disabled}
                    value={row.required_quantity}
                    onChange={(event: React.FormEvent<HTMLInputElement>) =>
                      tableInputHandler(
                        row,
                        'required_quantity',
                        event.currentTarget.value,
                      )
                    }
                  />
                ),
                ignoreRowClick: true,
                allowOverflow: true,
                center: true,
                width: '150px',
                grow: 0,
              },
              {
                name: 'UOM',
                cell: (row: any) => (
                  <Select
                    key={row.id}
                    className=""
                    placeholder={'Select UOM'}
                    data={['Box', 'Pieces']}
                    size={'xs'}
                    disabled={true}
                    value={row.unit_of_measurement}
                    onChange={(event: any) =>
                      tableInputHandler(row, 'unit_of_measurement', event)
                    }
                  />
                ),
                ignoreRowClick: true,
                allowOverflow: true,
                center: true,
                width: '150px',
                grow: 0,
              },
              {
                name: 'Trade Price',
                cell: (row: any) => (
                  <TextInput
                    key={row.id}
                    placeholder={'Enter Trade Price'}
                    size={'xs'}
                    disabled={row.disabled || row.foc}
                    value={row.trade_price}
                    onChange={(event: React.FormEvent<HTMLInputElement>) =>
                      tableInputHandler(
                        row,
                        'trade_price',
                        event.currentTarget.value,
                      )
                    }
                  />
                ),
                ignoreRowClick: true,
                allowOverflow: true,
                center: true,
                width: '150px',
                grow: 0,
              },
              {
                name: 'Trade Discount',
                cell: (row: any) => (
                  <TextInput
                    key={row.id}
                    placeholder={'Enter Trade Discount'}
                    size={'xs'}
                    disabled={row.disabled || row.foc}
                    value={row.trade_discount}
                    onChange={(event: React.FormEvent<HTMLInputElement>) =>
                      tableInputHandler(
                        row,
                        'trade_discount',
                        event.currentTarget.value,
                      )
                    }
                  />
                ),
                ignoreRowClick: true,
                allowOverflow: true,
                center: true,
                width: '150px',
                grow: 0,
              },
              {
                name: 'FOC',
                cell: (row: any) => (
                  <Switch
                    size="md"
                    color="green"
                    className="cursor-pointer"
                    disabled={row.disabled}
                    checked={row.foc}
                    onChange={(event: any) =>
                      tableInputHandler(row, 'foc', event.currentTarget.checked)
                    }
                  />
                ),
                allowOverflow: true,
                center: true,
                width: '90px',
                grow: 0,
              },
            ]}
            data={selectedProducts}
          />
        </div>
        <div className="rounded-md shadow-md">
          <h2 className="border-b-2 p-5 text-[1.2rem] font-semibold text-[#3b3e66]">
            Order Cart
          </h2>
          {/* paste here */}
          <DataTableComponent
            columns={[
              {
                name: 'ID',
                selector: (row: any) => <>{row.product_id}</>,
                grow: 0,
                center: true,
                width: '70px',
              },
              {
                name: 'Product Name',
                selector: (row: any) => row.product_name,
                grow: 1,
              },
              {
                name: 'Vendor Name',
                selector: () => selectedVendor.vendor_name,
                grow: 1,
              },
              {
                name: 'Sales Tax Percentage',
                selector: (row: any) => <>{row.sales_tax_percentage || '0'}%</>,
                grow: 0,
                center: true,
                width: '100px',
              },
              {
                name: 'Quantity',
                selector: (row: any) => row.required_quantity,
                grow: 0,
                center: true,
                width: '100px',
              },
              {
                name: 'Pack Size',
                selector: (row: any) => row.item_conversion,
                grow: 0,
                center: true,
                width: '90px',
              },
              {
                name: 'UOM',
                selector: (row: any) => row.uom,
                grow: 0,
                center: true,
                width: '80px',
              },
              {
                name: 'Trade Price',
                selector: (row: any) => row.trade_price || '0',
                grow: 0,
                center: true,
                width: '120px',
              },
              {
                name: 'Trade Discount',
                selector: (row: any) =>
                  row.trade_discount_percentage + '%' || '0%',
                grow: 0,
                center: true,
                width: '130px',
              },
              {
                name: 'FOC',
                selector: (row: any) => (row.foc ? 'Yes' : 'No'),
                grow: 0,
                center: true,
                width: '60px',
              },
              {
                name: 'Total Price',
                selector: (row: any) => row.total_price,
                grow: 0,
                center: true,
                width: '140px',
              },
              {
                name: 'Total Disc',
                selector: (row: any) => row.trade_price_after_trade_discount,
                grow: 0,
                center: true,
                width: '100px',
              },
              {
                name: 'Tax',
                selector: (row: any) => row.trade_price_after_applying_gst,
                grow: 0,
                center: true,
                width: '100px',
              },
              {
                cell: (row: any) => (
                  <>
                    <Button
                      onClick={() => {
                        var temp_data = orderedProducts.filter(
                          (each_ordered_product: any) => {
                            return each_ordered_product.key != row.key;
                          },
                        );
                        setOrderedProducts(temp_data);
                      }}
                      compact
                      bg={'red'}
                      className="w-[100%] bg-red-500 transition-all hover:bg-red-700"
                    >
                      <RiDeleteBin7Line />
                    </Button>
                  </>
                ),
                ignoreRowClick: true,
                allowOverflow: true,
                center: true,
                width: '80px',
                grow: 0,
              },
            ]}
            data={orderedProducts}
          />
        </div>
        <div className="ml-auto min-w-[400px]">
          <div className="flex justify-between">
            <span className="font-semibold">SubTotal:</span>
            <span>{subtotal.toFixed(3)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Total Discounted Price:</span>
            <span>{subtotalDiscount.toFixed(3)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Tax:</span>
            <span>{totalTax.toFixed(3)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Grand Total:</span>
            <span>{(subtotal + totalTax - subtotalDiscount).toFixed(3)}</span>
          </div>
        </div>
        <Button
          className="ml-auto w-[300px] bg-[#002884] hover:bg-[#0e2762]"
          type={'submit'}
          disabled={orderedProducts.length === 0 || purchase_order_id != 0}
        >
          Order
        </Button>
      </form>
    </>
  );
}
//
export default function AddPurchaseOrder() {
  const [tableData, setTableData] = React.useState<any>([]);
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
        <BodyComp />
      </div>
    </section>
  );
}
