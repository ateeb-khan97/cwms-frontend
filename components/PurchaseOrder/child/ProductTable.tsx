'use client';
import { Button, Select, Switch, TextInput } from '@mantine/core';
import DataTableComponent from 'components/Shared/DataTableComponent';
import customNotification from 'functions/customNotification';
import Validator from 'functions/validationFunctions';
import React from 'react';
//
type RowType = {
  disabled: boolean;
  foc: boolean;
  id: number;
  index: number;
  item_conversion: string;
  manufacturer_id: number;
  manufacturer_name: string;
  product_name: string;
  required_quantity: string;
  sales_tax_percentage: string;
  selling_unit: string;
  trade_discount: string;
  trade_price: string;
  key?: string;
};
export default function ProductTable(props: {
  tableData: RowType[];
  setTableData: Function;
  setSubtotal: Function;
  setSubtotalDiscount: Function;
  setTotalTax: Function;
  orderedProducts: any[];
  setOrderedProducts: Function;
}) {
  //   states
  const [tableFresher, setTableFresher] = React.useState<boolean>(false);
  const [addToCartDisabler, setAddToCartDisabler] =
    React.useState<boolean>(true);
  //   functions
  const tableFresherToggler = () => setTableFresher((pre) => !pre);
  //
  const rowSelectFunction = (value: boolean, row: RowType) => {
    const oldArray = [...props.tableData];
    const oldIndex = oldArray.findIndex((obj) => obj.id == row.id);
    if (oldIndex != -1) {
      oldArray.splice(oldIndex, 1, {
        ...row,
        disabled: !row.disabled,
      });
    }
    props.setTableData(oldArray);
  };
  //
  const tableInputHandler = (row: RowType, name: string, value: string) => {
    const oldArray = [...props.tableData];

    var isUpdate = true;
    if (name == 'required_quantity') {
      isUpdate = Validator.numberValidator(value);
    }
    if (name == 'trade_price' || name == 'trade_discount') {
      isUpdate = Validator.decimalValidator(value);
    }

    if (isUpdate) {
      const index = oldArray.findIndex((obj) => obj.id == row.id);
      if (index != -1) {
        oldArray.splice(index, 1, {
          ...row,
          [name]: value,
        });
      }
      props.setTableData(oldArray);
    }
  };
  //
  const addToCart = () => {
    var previous_data: any[] = [...props.orderedProducts];
    var req_quantity_flag = false;
    var selected_data = props.tableData.filter((each_data) => {
      return !each_data.disabled;
    });
    for (let i = 0; i < selected_data.length; i++) {
      if (selected_data[i].required_quantity == '') {
        req_quantity_flag = true;
        break;
      }
      var key = `${selected_data[i].id}-${selected_data[i].foc ? '1' : '0'}`;
      selected_data[i] = {
        ...selected_data[i],
        key,
      };
    }
    if (req_quantity_flag) {
      return customNotification({
        message: 'Required Quantity cannot be Empty',
        title: 'Failed',
      });
    }
    var total_price = 0;
    var trade_price_after_trade_discount = 0;
    var trade_price_after_applying_gst = 0;
    //
    selected_data.forEach((each_selected_product, key) => {
      //
      total_price = +(
        +each_selected_product.required_quantity *
        +each_selected_product.trade_price
      ).toFixed(3);

      trade_price_after_trade_discount = +(
        +(+each_selected_product.trade_discount / 100) * +total_price
      ).toFixed(3);
      trade_price_after_applying_gst = +(
        +(+each_selected_product.sales_tax_percentage / 100) *
        +(+total_price - +trade_price_after_trade_discount)
      ).toFixed(3);
      //
      var isOld = previous_data.findIndex(
        (each_pre: any) => each_pre.key === each_selected_product.key,
      );
      if (isOld !== -1) {
        previous_data[isOld] = {
          key: each_selected_product.key,
          product_id: each_selected_product.id,
          product_name: each_selected_product.product_name,
          sales_tax_percentage: each_selected_product.sales_tax_percentage,
          required_quantity: each_selected_product.required_quantity,
          item_conversion: each_selected_product.item_conversion,
          last_selling_unit: each_selected_product.selling_unit,
          manufacturer_name: each_selected_product.manufacturer_name,
          manufacturer_id: each_selected_product.manufacturer_id,
          uom: each_selected_product.selling_unit,
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
          item_conversion: each_selected_product.item_conversion,
          last_selling_unit: each_selected_product.selling_unit,
          manufacturer_name: each_selected_product.manufacturer_name,
          manufacturer_id: each_selected_product.manufacturer_id,
          uom: each_selected_product.selling_unit,
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
    });
    //

    props.setSubtotal(+total_price);
    props.setSubtotalDiscount(+trade_price_after_trade_discount);
    props.setTotalTax(+trade_price_after_applying_gst);
    props.setOrderedProducts(previous_data);
    //
  };
  //
  React.useEffect(() => {
    for (let i = 0; i < props.tableData.length; i++) {
      if (props.tableData[i].disabled) {
        setAddToCartDisabler(true);
      } else {
        setAddToCartDisabler(false);
        break;
      }
    }
  }, [props.tableData]);
  //
  return (
    <>
      <div className="flex justify-between border-y p-5">
        <h5 className="text-2xl font-semibold text-[#3b3e66]">
          Products Table
        </h5>
        <Button
          type={'button'}
          onClick={addToCart}
          disabled={addToCartDisabler}
          className="bg-red-500 transition-all hover:scale-110 hover:bg-red-900"
        >
          Add to cart
        </Button>
      </div>

      <DataTableComponent
        clearSelectedRows={tableFresher}
        data={props.tableData}
        columns={[
          {
            cell: (row: RowType) => (
              <>
                <input
                  type={'checkbox'}
                  checked={!row.disabled}
                  onChange={(e) => rowSelectFunction(e.target.checked, row)}
                />
              </>
            ),
            width: '50px',
            grow: 0,
            center: true,
          },
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
          // {
          //   name: 'UOM',
          //   cell: (row: RowType) => (
          //     <Select
          //       key={row.id}
          //       className=""
          //       placeholder={'Select UOM'}
          //       data={['Box', 'Pieces']}
          //       size={'xs'}
          //       disabled={true}
          //       value={row.selling_unit}
          //       onChange={(event: any) =>
          //         tableInputHandler(row, 'unit_of_measurement', event)
          //       }
          //     />
          //   ),
          //   ignoreRowClick: true,
          //   allowOverflow: true,
          //   center: true,
          //   width: '150px',
          //   grow: 0,
          // },
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
      />
    </>
  );
}
