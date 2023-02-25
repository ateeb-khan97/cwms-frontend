'use client';
import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
import DataTableComponent from 'components/Shared/DataTableComponent';
import Loader from 'components/Shared/Loader';
import useProductData from 'modules/Products/useProductData';
import Link from 'next/link';
//
import React from 'react';
import { AiFillEdit } from 'react-icons/ai';
//
function Header() {
  return (
    <header className="select-none text-[#3b3e66]">
      <BreadcrumbComponent />
      <h1 className="text-3xl font-semibold ">Products</h1>
      <p>Please see Products below all connected channels</p>
    </header>
  );
}
//
function Table() {
  const { productData, loading } = useProductData();
  //
  const updateHandler = (id: number) => {};
  //
  return (
    <>
      {loading ? (
        <div className="flex w-[100%] justify-center p-28">
          <Loader />
        </div>
      ) : (
        <DataTableComponent
          data={productData}
          columns={[
            {
              name: 'ID',
              selector: (row: any) => row.id,
              grow: 0,
              center: true,
              width: '76px',
            },
            {
              name: 'Product Name',
              selector: (row: any) => row.product_name,
              grow: 2,
              sortable: true,
            },
            {
              name: 'Manufacturer Name',
              selector: (row: any) => row.manufacturer.manufacturer_name,
              grow: 2,
              sortable: true,
            },

            {
              name: 'Trade Price',
              selector: (row: any) => row.trade_price,
              grow: 0,
              width: '96px',
              center: true,
            },
            {
              name: 'Discounted Price',
              selector: (row: any) => row.discounted_price,
              grow: 0,
              width: '96px',
              center: true,
            },
            {
              name: 'MRP',
              selector: (row: any) => row.maximum_retail_price,
              grow: 0,
              width: '80px',
              center: true,
            },
            {
              name: 'Stock Nature',
              selector: (row: any) => row.stock_nature,
              grow: 0,
              width: '96px',
              center: true,
            },
            {
              name: 'Quantity',
              selector: (row: any) => row.quantity,
              grow: 0,
              width: '86px',
              center: true,
            },
            {
              name: 'Status',
              selector: (row: any) => (
                <span
                  className={`font-semibold ${
                    row.status ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {row.status ? 'Active' : 'In-Active'}
                </span>
              ),
              grow: 0,
              width: '100px',
              center: true,
            },
            {
              name: 'Action',
              cell: (row: any) => (
                <>
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-md bg-[#002884]"
                    onClick={() => updateHandler(row.id)}
                  >
                    <AiFillEdit className="text-white" />
                  </span>
                </>
              ),
              ignoreRowClick: true,
              allowOverflow: true,
              center: true,
              width: '80px',
              grow: 0,
            },
          ]}
        />
      )}
    </>
  );
}
//
export default function ShowProductPage() {
  return (
    <section className="flex min-h-[100%] flex-col gap-10 p-7">
      <Header />
      <div className="rounded-md border border-gray-100 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b-[1px] p-5">
          <p className="py-2 font-semibold text-gray-500">
            Here you can manage your all Products!
          </p>
          <Link
            className="rounded-md bg-red-500 py-2 px-5 text-white transition-all hover:scale-110 hover:bg-red-900"
            href={'/dashboard/categories/add_category'}
          >
            Add Product
          </Link>
        </div>
        <Table />
      </div>
    </section>
  );
}
