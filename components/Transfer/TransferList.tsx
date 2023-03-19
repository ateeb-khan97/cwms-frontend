'use client';
//
import DataTableComponent from 'components/Shared/DataTableComponent';
import Loader from 'components/Shared/Loader';
import axiosFunction from 'functions/axiosFunction';
import TransferType from 'modules/Transfer/transfer.type';
import React from 'react';

export default function TransferList() {
  // states
  const [transferData, setTransferData] = React.useState<TransferType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  //
  // functions
  const transferFetcher = async () => {
    setLoading(true);
    const data = await axiosFunction({ urlPath: '/transfer/find_all' }).then(
      (res) => res.data,
    );
    setTransferData(data);
    setLoading(false);
  };
  //
  // useEffect
  React.useEffect(() => {
    transferFetcher();
  }, []);
  //
  // returned jsx
  return (
    <section>
      {loading ? (
        <div className="flex h-[250px] items-center justify-center">
          <Loader />
        </div>
      ) : (
        <DataTableComponent data={transferData} columns={[{}]} />
      )}
    </section>
  );
}
