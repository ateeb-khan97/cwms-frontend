'use client';

import { Autocomplete, Button, Select, TextInput } from '@mantine/core';
import DataTableComponent from 'components/Shared/DataTableComponent';
import Loader from 'components/Shared/Loader';
import axiosFunction from 'functions/axiosFunction';
import customNotification from 'functions/customNotification';
import React from 'react';
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
}: {
  demandProducts: DemandProductType[];
}) {
  return (
    <>
      <div className="border-y p-5 font-semibold text-gray-500 ">
        <h1 className="text-xl">Demand Cart</h1>
      </div>
      <DataTableComponent
        data={demandProducts}
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
                  className="bg-red-500 transition-all hover:bg-red-900"
                  compact
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
export default function DemandNotePage() {
  //
  // refs
  const productRef = React.useRef<HTMLInputElement>(null);
  const quantityRef = React.useRef<HTMLInputElement>(null);
  //
  // states
  const [locationTo, setLocationTo] = React.useState<string | null>('');
  const [locationData, setLocationData] = React.useState<any[]>([]);
  const [demandProducts, setDemandProducts] = React.useState<
    DemandProductType[]
  >([]);
  const [productData, setProductData] = React.useState<DemandProductType[]>([]);
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
  const submitHandler = async () => {
    const product = productRef.current!.value;
    const quantity = quantityRef.current!.value;
    // check if empty
    if (product == '' || quantity == '') {
      return customNotification({
        message: 'Select a product and enter the quantity!',
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
  //  useEffects
  React.useEffect(() => {
    productFetcher();
    locationFetcher();
  }, []);
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
            required
            ref={productRef}
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
                submitHandler();
              }
            }}
          />
          <TextInput
            ref={quantityRef}
            label="Quantity"
            placeholder="Enter Quantity"
            required
            size="xs"
            className="w-[47%]"
            onKeyDown={(e) => {
              if (e.key == 'Enter') {
                submitHandler();
              }
            }}
          />
          <Select
            className="w-[47%]"
            value={locationTo}
            onChange={setLocationTo}
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
      <DemandTable demandProducts={demandProducts} />
    </main>
  );
}
