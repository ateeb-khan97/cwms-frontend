'use client';
//
import React from 'react';
import Barcode from 'react-barcode';
import Loader from './Loader';
import QRCode from 'react-qr-code';
//
export default function BarcodeGenerator() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [value, setValue] = React.useState<any[]>([]);
  React.useEffect(() => {
    setLoading(true);
    const value_temp = JSON.parse(localStorage.getItem('bar_code_value')!);
    if (value_temp == '' || value_temp == null || value_temp == undefined) {
      setValue([]);
    } else {
      setValue(value_temp);
    }
    setLoading(false);
    window.addEventListener('beforeunload', (ev) => {
      ev.preventDefault();
      return localStorage.removeItem('bar_code_value');
    });
  }, []);
  //
  //
  return (
    <section className="p-5">
      {loading ? (
        <div className="flex h-[150px] items-center justify-center">
          <Loader />
        </div>
      ) : value.length > 0 ? (
        value.map((each_val: any, key: number) => {
          return (
            <div className="mb-5 flex w-max flex-col" key={each_val + key}>
              <div className="flex flex-col gap-2">
                <QRCode value={each_val} height={30} width={0.8} />
                <p className="text-center text-4xl font-medium">{each_val}</p>
              </div>
            </div>
          );
        })
      ) : (
        'Empty!'
      )}
    </section>
  );
}
