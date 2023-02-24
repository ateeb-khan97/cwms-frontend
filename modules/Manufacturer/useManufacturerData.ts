'use client';
//
import axiosFunction from 'functions/axiosFunction';
import React from 'react';
import { atom, useRecoilState } from 'recoil';
import { ManufacturerType } from './ManufacturerType';
// import { ProductType } from './productType';
// types
type useManufacturerDataType = {
  manufacturerData: ManufacturerType[];
  setManufacturerData: (data: any) => void;
  loading: boolean;
};
// atom
const ManufacturerRecoil = atom({
  key: 'manufacturer_data',
  default: [],
});
//
export default function useManufacturerData(): useManufacturerDataType {
  const [data, setData]: any[] = useRecoilState(ManufacturerRecoil);
  const [loading, setLoading] = React.useState<boolean>(false);
  //
  const dataFetcher = async () => {
    setLoading(true);
    const response = await axiosFunction({
      urlPath: '/manufacturer/find_all/',
    });
    setData(response.data);
    setLoading(false);
  };
  //
  React.useEffect(() => {
    if (data.length == 0) {
      dataFetcher();
    }
  }, [data]);
  return { manufacturerData: data, setManufacturerData: setData, loading };
}
