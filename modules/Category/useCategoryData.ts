'use client';
//
import axiosFunction from 'functions/axiosFunction';
import React from 'react';
import { atom, useRecoilState } from 'recoil';
import { CategoryType } from './categoryType';

type useCategoryType = {
  categoryData: CategoryType[];
  setCategoryData: (val: any) => void;
  loading: boolean;
};
//
const CategoryRecoil = atom({
  key: 'category_data',
  default: [],
});
//
export default function useCategoryData(): useCategoryType {
  const [data, setData]: any[] = useRecoilState(CategoryRecoil);
  const [loading, setLoading] = React.useState<boolean>(false);
  //
  const dataFetcher = async () => {
    setLoading(true);
    const response = await axiosFunction({
      urlPath: '/category/find_all/',
    });
    //
    var all_categories: any[] = [];
    response.data.forEach((each_parent_category) => {
      all_categories.push(each_parent_category);
      all_categories.push(...each_parent_category.child);
    });
    //
    setData(all_categories);
    setLoading(false);
  };
  //
  React.useEffect(() => {
    if (data.length == 0) {
      dataFetcher();
    }
  }, [data]);
  //
  return { categoryData: data, setCategoryData: setData, loading };
  //
}
