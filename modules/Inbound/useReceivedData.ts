'use client';
//
import axiosFunction from 'functions/axiosFunction';
import React from 'react';
import { atom, useRecoilState } from 'recoil';
import { ReceiveType } from './receiveType';
// types
type useProductDataType = {
  receiveData: ReceiveType[];
  setReceiveData: (data: any) => void;
  loading: boolean;
};
// atom
const ReceiveItems = atom({
  key: 'receive_items_data',
  default: [],
});
//
export default function useReceiveData(): useProductDataType {
  const [data, setData]: any[] = useRecoilState(ReceiveItems);
  const [loading, setLoading] = React.useState<boolean>(false);
  //
  const dataFetcher = async () => {
    setLoading(true);
    const response = await axiosFunction({ urlPath: '/inward/find_all/' });
    setData(response.data);
    setLoading(false);
  };
  //
  React.useEffect(() => {
    if (data.length == 0) {
      dataFetcher();
    }
  }, [data.length]);
  return { receiveData: data, setReceiveData: setData, loading };
}
