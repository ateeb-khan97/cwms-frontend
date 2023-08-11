'use client';
import { Button, TextInput } from '@mantine/core';
//
import DataTableComponent from 'components/Shared/DataTableComponent';
import Loader from 'components/Shared/Loader';
import axiosFunction from 'functions/axiosFunction';
import React, { useState } from 'react';
import { MdDownload, MdSearch } from 'react-icons/md';
//
const TableHeadComponent = ({
  filterFunction,
}: {
  filterFunction: (e: string) => void;
}) => {
  const [search, setSearch] = useState<string>('');
  return (
    <>
      <div className="flex items-center gap-5">
        <Button
          onClick={async () => {
            await axiosFunction({
              urlPath: '/inward/stock-report-download/',
              responseType: 'blob',
            }).then((response: any) => {
              console.log(response);

              const url = window.URL.createObjectURL(new Blob([response]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', 'stock-report.csv');
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            });
          }}
          className="bg-red-500 transition-all hover:bg-red-900"
          leftIcon={<MdDownload />}
        >
          Download
        </Button>
        <TextInput
          icon={<MdSearch />}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            filterFunction(e.target.value);
          }}
          placeholder="Search"
          className="w-56"
        />
      </div>
    </>
  );
};
//
export default function StockReport() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [reportData, setReportData] = React.useState<any[]>([]);
  const [tableData, setTableData] = React.useState<any[]>([]);
  const filterFunction = (search: string) => {
    search = search.toLowerCase();
    const filteredData = reportData.filter((each) => {
      for (let key in each) {
        if (each[key as any]?.toString()?.toLowerCase()?.includes(search)) {
          return true;
        }
      }
      return false;
    });
    setTableData(filteredData);
  };
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
          data={tableData}
        >
          <TableHeadComponent filterFunction={filterFunction} />
        </DataTableComponent>
      )}
    </main>
  );
}
