'use client';

import { Button } from '@mantine/core';
import DataTableComponent from 'components/Shared/DataTableComponent';
import { RiDeleteBin7Line } from 'react-icons/ri';

//
export default function OrderCart({
  vendor_name,
  orderedProducts,
  setOrderedProducts,
  subtotal,
  subtotalDiscount,
  totalTax,
  po_id,
}: {
  subtotal: number;
  subtotalDiscount: number;
  totalTax: number;
  vendor_name: string;
  orderedProducts: any[];
  setOrderedProducts: Function;
  po_id: number;
}) {
  return (
    <>
      <div className="flex justify-between border-y p-5">
        <h5 className="text-2xl font-semibold text-[#3b3e66]">Order Cart</h5>
      </div>
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
            selector: () => vendor_name,
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
            selector: (row: any) => row.trade_discount_percentage + '%' || '0%',
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
      <section className="flex w-[100%] flex-col gap-5 p-5">
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
          className="ml-auto w-[300px] bg-red-500 transition-all hover:scale-110 hover:bg-red-900"
          type={'submit'}
          disabled={orderedProducts.length === 0 || po_id != 0}
        >
          Order
        </Button>
      </section>
    </>
  );
}
