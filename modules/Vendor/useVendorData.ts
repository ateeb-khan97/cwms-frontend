'use client';
//
import axiosFunction from 'functions/axiosFunction';
import React from 'react';
import { atom, useRecoilState } from 'recoil';
import { VendorType } from './vendorType';
// types
type useVendorDataType = {
  vendorData: VendorType[];
  setVendorData: (data: any) => void;
  loading: boolean;
};
// atom
const VendorRecoil = atom({
  key: 'vendor_data',
  default: [],
});
//
export default function useVendorData(): useVendorDataType {
  const [data, setData]: any[] = useRecoilState(VendorRecoil);
  const [loading, setLoading] = React.useState<boolean>(false);
  //
  const dataFetcher = async () => {
    setLoading(true);
    const response = await axiosFunction({ urlPath: '/vendor/find_for_dt' });
    setData(response.data);
    setLoading(false);
  };
  //
  React.useEffect(() => {
    if (data.length == 0) {
      dataFetcher();
    }
  }, [data]);
  return { vendorData: data, setVendorData: setData, loading };
}
