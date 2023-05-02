'use client';
//
import DataTableComponent from 'components/Shared/DataTableComponent';
import Loader from 'components/Shared/Loader';
import axiosFunction from 'functions/axiosFunction';
import React from 'react';
//
export default function StockReport() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [reportData, setReportData] = React.useState<any[]>([]);
  //
  const reportFetcher = async () => {
    setLoading(true);
    const data = await axiosFunction({
      urlPath: '/inward/find_for_report',
    }).then((res) => res.data);
    setReportData(data);
    setLoading(false);
  };
  React.useEffect(() => {
    reportFetcher();
  }, []);
  return (
    <main>
      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <Loader />
        </div>
      ) : (
        <DataTableComponent
          columns={[
            {
              name: 'Prod.ID',
              cell: (row: any) => row.product_id,
              center: true,
              grow: 0,
              width: '100px',
            },
            {
              name: 'Prod.Name',
              cell: (row: any) => row.product_name,
              grow: 1,
            },
            {
              name: 'Loc.Name',
              cell: (row: any) => row.loc_name,
              grow: 1,
            },
            {
              name: 'Tot.Qty',
              cell: (row: any) => row.total_qty,
              center: true,
              grow: 0,
              width: '100px',
            },
            {
              name: 'Tot.In Transit',
              cell: (row: any) => row.total_intransit,
              center: true,
              grow: 0,
              width: '100px',
            },
          ]}
          data={reportData}
        />
      )}
    </main>
  );
}
