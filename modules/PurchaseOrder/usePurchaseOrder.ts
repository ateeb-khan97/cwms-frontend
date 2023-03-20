'use client';
//
import axiosFunction from 'functions/axiosFunction';
import React from 'react';
import { atom, useRecoilState } from 'recoil';
import { PurchaseOrderType } from './purchaseOrderType';
// types
type usePurchaseOrderDataType = {
  purchaseOrderData: PurchaseOrderType[];
  setPurchaseOrderData: (data: any) => void;
  loading: boolean;
};
// atom
const PurchaseOrderRecoil = atom({
  key: 'purchase_order_data',
  default: [],
});
//
export default function usePurchaseOrderData(): usePurchaseOrderDataType {
  const [data, setData]: any[] = useRecoilState(PurchaseOrderRecoil);
  const [loading, setLoading] = React.useState<boolean>(false);
  //
  const dataFetcher = async () => {
    setLoading(true);
    const response = await axiosFunction({
      urlPath: '/purchase_order/find_all/',
    });
    console.log(response.data[0]);

    setData(response.data);
    setLoading(false);
  };
  //
  React.useEffect(() => {
    if (data.length == 0) {
      dataFetcher();
    }
  }, [data.length]);
  return { purchaseOrderData: data, setPurchaseOrderData: setData, loading };
}
