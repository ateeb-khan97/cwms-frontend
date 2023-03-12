'use client';
import { Button } from '@mantine/core';
import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
import DataTableComponent from 'components/Shared/DataTableComponent';
import Loader from 'components/Shared/Loader';
import axiosFunction from 'functions/axiosFunction';
import useProductData from 'modules/Products/useProductData';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const { productData, loading } = useProductData();
  //
  const updateHandler = async (id: number) => {
    var category: any[] = [];
    var vendor: any[] = [];
    var productTags: any[] = [];
    var productGenericFormula: any[] = [];
    var product_conversion_su_1 = 'Carton';
    var product_conversion_ic_1 = '1';
    var product_conversion_su_2 = '';
    var product_conversion_ic_2 = '1';
    var product_conversion_su_3 = '';
    var product_conversion_ic_3 = '1';
    //
    const [filtered_product] = await axiosFunction({
      urlPath: '/product/find/',
      method: 'POST',
      data: { id },
    }).then((res) => res.data);
    //
    if (filtered_product.product_conversions.length > 0) {
      var product_conversion = [...filtered_product.product_conversions];
      var sorted_conversion: any[] = product_conversion.sort(
        (obj1: any, obj2: any) => {
          if (obj1.sorting > obj2.sorting) {
            return 1;
          }
          if (obj1.sorting < obj2.sorting) {
            return -1;
          }
          return 0;
        },
      );

      if (sorted_conversion[1].selling_unit == 'Box') {
        product_conversion_su_3 = sorted_conversion[2].selling_unit;
        product_conversion_ic_3 = sorted_conversion[2].item_conversion;
      }
      product_conversion_ic_1 = sorted_conversion[0].item_conversion;
      product_conversion_ic_2 = sorted_conversion[1].item_conversion;
      product_conversion_su_1 = sorted_conversion[0].selling_unit;
      product_conversion_su_2 = sorted_conversion[1].selling_unit;
    }

    if (filtered_product.product_generic_formulas.length > 0) {
      productGenericFormula = filtered_product.product_generic_formulas.map(
        (each_formula: any) => {
          return each_formula.product_generic_formula;
        },
      );
    }
    if (filtered_product.product_tags.length > 0) {
      productTags = filtered_product.product_tags.map((each_tag: any) => {
        return each_tag.tag;
      });
    }
    if (filtered_product.categories.length > 0) {
      category = filtered_product.categories.map((each_category: any) => {
        return each_category.id;
      });
    }

    if (filtered_product.vendors.length > 0) {
      vendor = filtered_product.vendors.map((each_vendor: any) => {
        return each_vendor.id;
      });
    }
    //
    const data_to_send_temp = {
      ...filtered_product,
      category,
      productTags,
      vendor,
      productGenericFormula,
      product_conversion_su_1,
      product_conversion_ic_1,
      product_conversion_su_2,
      product_conversion_ic_2,
      product_conversion_su_3,
      product_conversion_ic_3,
    };
    localStorage.setItem('product_data', JSON.stringify(data_to_send_temp));
    router.push(`/dashboard/products/update_product`);
    //
  };
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
                  <Button
                    compact
                    className="h-6 w-6 bg-[#002884] p-0"
                    onClick={() => updateHandler(row.id)}
                  >
                    <AiFillEdit className="text-white" />
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
            href={'/dashboard/products/add_product'}
          >
            Add Product
          </Link>
        </div>
        <Table />
      </div>
    </section>
  );
}
