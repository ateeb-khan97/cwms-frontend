import axios, { AxiosRequestConfig, ResponseType } from 'axios';
import { getCookie, setCookie } from 'cookies-next';
import customNotification from './customNotification';
// types
type MethodType = 'POST' | 'GET' | 'PUT' | 'DELETE';
//
type axiosParams = {
  method?: MethodType;
  urlPath: string;
  data?: any;
  params?: any;
  token?: string;
  responseType?: ResponseType;
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
  token = undefined,
  responseType = undefined,
}: axiosParams): Promise<axiosReturnType> {
  const url = process.env.NEXT_PUBLIC_THIS_URL + urlPath;
  var config: AxiosRequestConfig = {
    method: method,
    url: url,
    headers: {
      Authorization: `Bearer ${token || getCookie('token')}`,
      'X-Custom-Header': JSON.stringify({
        acc_no: getCookie('acc_no'),
        loc_no: getCookie('loc_no'),
        user_name: getCookie('user_name'),
      }),
    },
    data: data,
  };
  if (responseType) {
    config['responseType'] = responseType;
  }
  //
  if (method == 'GET') config['params'] = params;
  //

  try {
    const result: any = await axios(config);
    if (result.data.status == 401) {
      customNotification({
        message: 'Session Expired',
        title: 'Failed',
      });
      setCookie('token', '', { secure: false });
      setCookie('type', '', { secure: false });
      setCookie('user_id', '', { secure: false });
      setCookie('acc_no', '', {
        secure: false,
      });
      setCookie('loc_no', '');
      setCookie('user_name', '');
    }
    return result.data;
  } catch (err: any) {
    return {
      data: [],
      message: err.message,
      status: 500,
    };
  }
}
