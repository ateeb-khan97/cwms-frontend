'use client';
import { Button, TextInput } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
import DataTableComponent from 'components/Shared/DataTableComponent';
import axiosFunction from 'functions/axiosFunction';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import React from 'react';
import { AiFillEdit, AiOutlineSearch } from 'react-icons/ai';
import { MdFileDownload } from 'react-icons/md';
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
type FilterProps = {
  value: string;
  setValue: (value: string) => void;
  downloadHandler: () => {};
};
const FilterComponent = ({ setValue, value, downloadHandler }: FilterProps) => {
  return (
    <div className="flex gap-5">
      <Button
        onClick={downloadHandler}
        rightIcon={<MdFileDownload />}
        className="bg-red-500 transition-all hover:bg-red-900"
      >
        Download
      </Button>
      <TextInput
        icon={<AiOutlineSearch />}
        type="text"
        placeholder={`Search`}
        defaultValue={value}
        onChange={(event) => setValue(event.currentTarget.value)}
      />
    </div>
  );
};
//
function Table({ downloadHandler }: { downloadHandler: () => {} }) {
  const router = useRouter();
  // const { productData, loading } = useProductData();
  const [value, setValue] = useDebouncedState('', 200);

  const [loading, setLoading] = React.useState<boolean>(true);
  const [productData, setProductData] = React.useState<any[]>([]);
  const [totalRows, setTotalRows] = React.useState<number>(0);
  const [perPage, setPerPage] = React.useState<number>(10);
  const [columnName, setColumnName] = React.useState<string>('id');
  const [orderBy, setOrderBy] = React.useState<string>('desc');
  //
  const fetchProduct = async (page: number) => {
    setLoading(true);
    const response = await axiosFunction({
      urlPath: '/product/data_table_search',
      method: 'POST',
      data: {
        page,
        perPage,
        searchValue: value,
        columnName,
        orderBy,
      },
    });
    setProductData(response.data[0].rows);
    setTotalRows(response.data[0].count);
    setLoading(false);
  };
  const handlePageChange = (page: number) => fetchProduct(page);
  //
  const handlePerRowsChange = async (newPerPage: number, page: number) => {
    setLoading(true);
    const response = await axiosFunction({
      urlPath: '/product/data_table_search',
      method: 'POST',
      data: {
        page,
        perPage: newPerPage,
        searchValue: value,
        columnName,
        orderBy,
      },
    });
    setProductData(response.data[0].rows);
    setPerPage(newPerPage);
    setLoading(false);
  };
  //
  React.useEffect(() => {
    fetchProduct(1);
  }, [value, columnName, orderBy]);
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
      <DataTableComponent
        onSort={(col, orderBy) => {
          setColumnName(col.alias);
          setOrderBy(orderBy);
        }}
        desc={true}
        progressPending={loading}
        paginationServer={true}
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        data={productData}
        columns={[
          {
            name: 'ID', //@ts-ignore
            alias: 'id',
            sortable: true,
            selector: (row: any) => row.id,
            grow: 0,
            center: true,
            width: '76px',
          },
          {
            name: 'Product Name', //@ts-ignore
            alias: 'product_name',
            selector: (row: any) => row.product_name,
            grow: 2,
            sortable: true,
          },
          {
            name: 'Manufacturer Name',
            selector: (row: any) => row.manufacturer.manufacturer_name,
            grow: 2,
          },

          {
            name: 'Trade Price', //@ts-ignore
            alias: 'trade_price',
            selector: (row: any) => row.trade_price,
            grow: 0,
            width: '96px',
            center: true,
            sortable: true,
          },
          {
            name: 'Discounted Price',
            selector: (row: any) => row.discounted_price,
            grow: 0,
            width: '96px',
            center: true,
          },
          {
            name: 'MRP', //@ts-ignore
            alias: 'maximum_retail_price',
            selector: (row: any) => row.maximum_retail_price,
            grow: 0,
            width: '80px',
            sortable: true,
            center: true,
          },
          {
            name: 'Stock Nature', //@ts-ignore
            alias: 'stock_nature',
            selector: (row: any) => row.stock_nature,
            grow: 0,
            width: '96px',
            center: true,
          },
          {
            name: 'Quantity',
            //@ts-ignore
            alias: 'quantity',
            selector: (row: any) => row.quantity,
            grow: 0,
            width: '86px',
            sortable: true,
            center: true,
          },
          {
            name: 'Status',
            cell: (row: any) => (
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
            name: 'User Name',
            selector: (row: any) => row.user_name,
            grow: 0,
            width: '86px',
            sortable: true,
            center: true,
          },
          {
            name: 'User ID',
            selector: (row: any) => row.user_id,
            grow: 0,
            width: '86px',
            sortable: true,
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
      >
        <FilterComponent
          downloadHandler={downloadHandler}
          setValue={setValue}
          value={value}
        />
      </DataTableComponent>
    </>
  );
}
//
export default function ShowProductPage({
  getDownloadData,
}: {
  getDownloadData: () => Promise<any[]>;
}) {
  async function downloadHandler() {
    const downloadData = new Set(await getDownloadData());
    const csvData = Papa.unparse(Array.from(downloadData));
    // Create a Blob containing the CSV data
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'data.csv');
  }
  return (
    <section className="flex min-h-[100%] flex-col gap-10 p-7">
      <Header />
      <div className="rounded-md border border-gray-100 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b-[1px] p-5">
          <p className="py-2 font-semibold text-gray-500">
            Here you can manage your all Products!
          </p>
          <Link
            className="rounded-md bg-red-500 px-5 py-2 text-white transition-all hover:scale-110 hover:bg-red-900"
            href={'/dashboard/products/add_product'}
          >
            Add Product
          </Link>
        </div>
        <Table downloadHandler={downloadHandler} />
      </div>
    </section>
  );
}
