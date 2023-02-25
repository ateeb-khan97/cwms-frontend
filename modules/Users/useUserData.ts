'use client';
//
import axiosFunction from 'functions/axiosFunction';
import React from 'react';
import { atom, useRecoilState } from 'recoil';
import { UserType } from './userType';
// types
type useProductDataType = {
  userData: UserType[];
  setUserData: (data: any) => void;
  loading: boolean;
};
// atom
const UserRecoil = atom({
  key: 'user_data',
  default: [],
});
//
export default function useUserData(): useProductDataType {
  const [data, setData]: any[] = useRecoilState(UserRecoil);
  const [loading, setLoading] = React.useState<boolean>(false);
  //
  const dataFetcher = async () => {
    setLoading(true);
    const response = await axiosFunction({ urlPath: '/user/find_all/' });
    setData(response.data);
    setLoading(false);
  };
  //
  React.useEffect(() => {
    if (data.length == 0) {
      dataFetcher();
    }
  }, [data]);
  return { userData: data, setUserData: setData, loading };
}
