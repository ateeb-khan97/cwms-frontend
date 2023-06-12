'use client';

import { Autocomplete, Button, Select, TextInput } from '@mantine/core';
import DataTableComponent from 'components/Shared/DataTableComponent';
import Loader from 'components/Shared/Loader';
import { setCookie } from 'cookies-next';
import axiosFunction from 'functions/axiosFunction';
import customNotification from 'functions/customNotification';
import Validator from 'functions/validationFunctions';
import Link from 'next/link';
import React from 'react';
import { BiSearch } from 'react-icons/bi';
import { BsFilePdfFill } from 'react-icons/bs';
import { MdOutlineDeleteOutline } from 'react-icons/md';

//
type DemandProductType = {
  id: string;
  product_name: string;
  quantity?: string;
};
//
function DemandTable({
  demandProducts,
  deleteHandler,
  isDetails,
}: {
  isDetails: boolean;
  demandProducts: DemandProductType[];
  deleteHandler: (id: string) => void;
}) {
  //
  const [filteredData, setFilteredData] = React.useState(demandProducts);
  const [searchTerm, setSearchTerm] = React.useState('');
  React.useEffect(() => {
    setFilteredData(demandProducts);
  }, [demandProducts.length]);
  //
  const filterData = (value: string) => {
    const filtered = demandProducts.filter((item) => {
      return Object.values(item).some(
        (val) =>
          typeof val === 'string' &&
          val.toLowerCase().includes(value.toLowerCase()),
      );
    });
    setFilteredData(filtered);
  };
  //
  const handleInputChange = (event: any) => {
    setSearchTerm(event.target.value);
    filterData(event.target.value);
  };
  //
  return (
    <>
      <div className="border-y p-5 font-semibold text-gray-500 ">
        <h1 className="text-xl">Demand Cart</h1>
      </div>
      <header className="ml-auto flex w-96 gap-5 p-5">
        <Link
          onClick={() => {
            setCookie('demandNoteDate', JSON.stringify(demandProducts));
          }}
          target="_blank"
          href={'/invoice/demandnote-invoice'}
        >
          <Button
            className="bg-red-500 transition-all hover:bg-red-900"
            leftIcon={<BsFilePdfFill />}
          >
            PDF
          </Button>
        </Link>
        <TextInput
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search"
          icon={<BiSearch />}
        />
      </header>
      <DataTableComponent
        children={<></>}
        data={filteredData}
        columns={[
          {
            name: 'Prod.ID',
            selector: (row: DemandProductType) => <>{row.id}</>,
            center: true,
            grow: 0,
            width: '100px',
          },
          {
            name: 'Prod.Name',
            selector: (row: DemandProductType) => <>{row.product_name}</>,
            grow: 1,
          },
          {
            name: 'Qty',
            selector: (row: DemandProductType) => <>{row.quantity}</>,
            center: true,
            grow: 0,
            width: '100px',
          },
          {
            name: 'Action',
            selector: (row: DemandProductType) => (
              <>
                <Button
                  disabled={isDetails}
                  className="bg-red-500 transition-all hover:bg-red-900"
                  compact
                  onClick={() => deleteHandler(row.id)}
                >
                  <MdOutlineDeleteOutline size={20} />
                </Button>
              </>
            ),
            grow: 0,
            center: true,
          },
        ]}
      />
    </>
  );
}
//
export default function AddDemandNotePage({
  isDetails,
}: {
  isDetails: boolean;
}) {
  // refs
  const quantityRef = React.useRef<HTMLInputElement>(null);
  //
  // states
  const [product, setProduct] = React.useState<string>('');
  const [location, setLocation] = React.useState<string | null>('');
  const [locationData, setLocationData] = React.useState<any[]>([]);
  const [demandProducts, setDemandProducts] = React.useState<
    DemandProductType[]
  >([]);
  const [productData, setProductData] = React.useState<DemandProductType[]>([]);
  const [disabler, setDisabler] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);
  //
  //  functions
  const productFetcher = async () => {
    setLoading(true);
    const products = await axiosFunction({
      urlPath: '/product/find_for_demand_note',
    }).then((res) => res.data);
    setProductData(products);
    setLoading(false);
  };
  //
  const locationFetcher = async () => {
    const location = await axiosFunction({ urlPath: '/location/find' }).then(
      (res) => res.data,
    );
    setLocationData(location);
  };
  //
  const addProductFunction = async () => {
    const quantity = quantityRef.current!.value;
    // check if empty
    if (product == '' || quantity == '') {
      return customNotification({
        message: 'Select a product and enter the quantity!',
        title: 'Failed',
      });
    }
    //
    if (!Validator.numberValidator(quantity)) {
      quantityRef.current!.value = '';
      return customNotification({
        message: 'Quantity must be a number!',
        title: 'Failed',
      });
    }
    //
    const foundIndex = demandProducts.findIndex(
      (each_prod) =>
        each_prod.product_name.toLowerCase() == product.toLowerCase(),
    );
    if (foundIndex != -1) {
      return customNotification({
        message: 'Product already exists in the table',
        title: 'Failed',
      });
    }
    //
    const [filteredProduct] = productData.filter(
      (each_prod) =>
        each_prod.product_name.toLowerCase() == product.toLowerCase(),
    );
    //
    if (filteredProduct == undefined) {
      return customNotification({
        message: 'No such product found!',
        title: 'Failed',
      });
    }
    setDemandProducts((pre) => [...pre, { ...filteredProduct, quantity }]);
  };
  //
  const deleteHandler = (id: string) => {
    const filteredList = demandProducts.filter(
      (each_prod) => each_prod.id != id,
    );
    setDemandProducts(filteredList);
  };
  //
  const submitHandler = async () => {
    if (demandProducts.length == 0) {
      return customNotification({
        title: 'Failed',
        message: 'Select at least one product',
      });
    }
    //
    if (location == null || location == '') {
      return customNotification({
        title: 'Failed',
        message: 'Select location From',
      });
    }
    //
    const { message, status } = await axiosFunction({
      urlPath: '/demand_note/create',
      method: 'POST',
      data: {
        location,
        demandProducts,
      },
    });
    //
    const title = status == 200 ? 'Success' : 'Failed';
    customNotification({
      title,
      message,
    });
    //
    setDemandProducts([]);
    setProduct('');
    quantityRef.current!.value = '';
    setLocation('');
  };
  //
  const detailsFetcher = async (id: number) => {
    setLoading(true);
    const [data] = await axiosFunction({
      urlPath: '/demand_note/find_by_id',
      method: 'POST',
      data: { id },
    }).then((res) => res.data);
    setLocation(data.location_from);
    setDemandProducts(data.demand_note_detail);
    setDisabler(true);
    setLoading(false);
  };
  //  useEffects
  React.useEffect(() => {
    if (isDetails) {
      locationFetcher();
      const id = +localStorage.getItem('demand_id')!;
      if (id != 0) {
        detailsFetcher(id);
      }
      localStorage.removeItem('demand_id');
    } else {
      productFetcher();
      locationFetcher();
    }
  }, []);
  //
  //
  return (
    <main>
      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="flex flex-wrap justify-between gap-3 p-5">
          <Autocomplete
            disabled={disabler}
            required
            value={product}
            onChange={setProduct}
            className="w-[47%]"
            size="xs"
            label="Select Product"
            placeholder="Pick Products from here"
            data={productData.map((each_prod) => {
              return {
                // value: each_prod.id.toString(),
                value: each_prod.product_name,
              };
            })}
            onKeyDown={(e) => {
              if (e.key == 'Enter') {
                addProductFunction();
              }
            }}
          />
          <TextInput
            disabled={disabler}
            ref={quantityRef}
            label="Quantity"
            placeholder="Enter Quantity"
            required
            size="xs"
            className="w-[47%]"
            onKeyDown={(e) => {
              if (e.key == 'Enter') {
                addProductFunction();
              }
            }}
          />
          <Select
            disabled={disabler}
            className="w-[47%]"
            value={location}
            onChange={setLocation}
            searchable
            nothingFound="No options"
            required
            withAsterisk
            size="xs"
            label="Location"
            clearable
            placeholder="Select location"
            data={locationData.map((each_loc) => {
              return {
                value: each_loc.loc_code,
                label: each_loc.loc_name,
              };
            })}
          />
        </div>
      )}
      <DemandTable
        isDetails={isDetails}
        demandProducts={demandProducts}
        deleteHandler={deleteHandler}
      />
      <div className="flex w-[100%] p-5">
        <Button
          disabled={demandProducts.length == 0 || disabler}
          onClick={submitHandler}
          className="ml-auto w-56 bg-red-500 transition hover:bg-red-900"
        >
          Submit
        </Button>
      </div>
    </main>
  );
}
