'use client';
//
import axiosFunction from 'functions/axiosFunction';
import React from 'react';
import { atom, useRecoilState } from 'recoil';
import { ProductType } from './productType';
// types
type useProductDataType = {
  productData: ProductType[];
  setProductData: (data: any) => void;
  loading: boolean;
};
// atom
const ProductRecoil = atom({
  key: 'product_data',
  default: [],
});
//
export default function useProductData(): useProductDataType {
  const [data, setData]: any[] = useRecoilState(ProductRecoil);
  const [loading, setLoading] = React.useState<boolean>(false);
  //
  const dataFetcher = async () => {
    setLoading(true);
    const response = await axiosFunction({ urlPath: '/product/find_for_dt/' });
    setData(response.data);
    setLoading(false);
  };
  //
  React.useEffect(() => {
    if (data.length == 0) {
      dataFetcher();
    }
  }, [data]);
  return { productData: data, setProductData: setData, loading };
}
