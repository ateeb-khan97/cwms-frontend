'use client';
import { Button, Select, Switch, TextInput } from '@mantine/core';
import DataTableComponent from 'components/Shared/DataTableComponent';
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
};
export default function OrderCart(props: {
  tableData: RowType[];
  setTableData: Function;
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
    if (name == 'required_quantity' || name == 'trade_discount') {
      isUpdate = Validator.numberValidator(value);
    }
    if (name == 'trade_price') {
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
    const data = props.tableData.filter((each_elem) => {
      return !each_elem.disabled;
    });
    console.log(data);
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
          {
            name: 'UOM',
            cell: (row: RowType) => (
              <Select
                key={row.id}
                className=""
                placeholder={'Select UOM'}
                data={['Box', 'Pieces']}
                size={'xs'}
                disabled={true}
                value={row.selling_unit}
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
      />
    </>
  );
}
