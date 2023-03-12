import axios, { AxiosRequestConfig } from 'axios';
import { getCookie } from 'cookies-next';
// types
type MethodType = 'POST' | 'GET' | 'PUT' | 'DELETE';
//
type axiosParams = {
  method?: MethodType;
  urlPath: string;
  data?: any;
  params?: any;
};
type axiosReturnType = {
  status: number;
  data: any[];
  message: string;
};

//
export default async function axiosFunction({
  urlPath = '',
  method = 'GET',
  data = {},
  params = {},
}: axiosParams): Promise<axiosReturnType> {
  const url = process.env.NEXT_PUBLIC_THIS_URL + urlPath;
  var config: AxiosRequestConfig = {
    method: method,
    url: url,
    headers: {
      Authorization: `Bearer ${getCookie('token')}`,
      'X-Custom-Header': JSON.stringify({
        acc_no: getCookie('acc_no'),
        loc_no: getCookie('loc_no'),
      }),
    },
    data: data,
  };
  //
  if (method == 'GET') config['params'] = params;
  //
  try {
    const result: any = await axios(config);
    return result.data;
  } catch (err: any) {
    return {
      data: [],
      message: err.message,
      status: 401,
    };
  }
}
