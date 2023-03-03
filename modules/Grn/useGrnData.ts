'use client';
//
import axiosFunction from 'functions/axiosFunction';
import React from 'react';
import { atom, useRecoilState } from 'recoil';
import { GrnType } from './GrnType';
// types
type useGrnDataType = {
  grnData: GrnType[];
  setGrnData: (data: any) => void;
  loading: boolean;
};
// atom
const GrnRecoil = atom({
  key: 'grn_data',
  default: [],
});
//
export default function useGrnData(): useGrnDataType {
  const [data, setData]: any[] = useRecoilState(GrnRecoil);
  const [loading, setLoading] = React.useState<boolean>(false);
  //
  const dataFetcher = async () => {
    setLoading(true);
    const response = await axiosFunction({
      urlPath: '/grn/find_all/',
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
  return { grnData: data, setGrnData: setData, loading };
}
