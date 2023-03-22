'use client';
import { Button } from '@mantine/core';
import DataTableComponent from 'components/Shared/DataTableComponent';
import Loader from 'components/Shared/Loader';
import axiosFunction from 'functions/axiosFunction';
import { useRouter } from 'next/navigation';
//
import React from 'react';
//
interface TableDataType {
  assigned_from: string;
  assigned_to: string;
  id: number;
  status: string;
  created_at: Date;
}
//
export default function DemandNoteTable() {
  const router = useRouter();
  //
  const [tableData, setTableData] = React.useState<TableDataType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  //

  const dataFetcher = async () => {
    setLoading(true);
    const { data } = await axiosFunction({ urlPath: '/demand_note/find_all' });
    setTableData(data);
    setLoading(false);
  };
  //
  const viewDetailsFunction = (id: number) => {
    localStorage.setItem('demand_id', id.toString());
    router.push('/dashboard/demand_note/details_demand_note');
  };
  //
  React.useEffect(() => {
    dataFetcher();
  }, []);
  //
  return (
    <>
      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div>
          <DataTableComponent
            data={tableData}
            columns={[
              {
                name: 'ID',
                selector: (row: TableDataType) => row.id,
                center: true,
                grow: 0,
                width: '100px',
              },
              {
                name: 'Assigned From',
                selector: (row: TableDataType) => row.assigned_from,
                grow: 1,
              },
              {
                name: 'Assigned To',
                selector: (row: TableDataType) => row.assigned_to,
                grow: 1,
              },
              {
                name: 'Created At',
                selector: (row: TableDataType) =>
                  row.created_at.toString().substring(0, 10),
                center: true,
                grow: 0,
                width: '150px',
              },
              {
                name: 'Status',
                selector: (row: TableDataType) => row.status,
                center: true,
                grow: 0,
                width: '100px',
              },
              {
                selector: (row: TableDataType) => (
                  <>
                    <Button
                      onClick={() => viewDetailsFunction(row.id)}
                      className="bg-red-500 transition hover:bg-red-900"
                      compact
                    >
                      Details
                    </Button>
                  </>
                ),
                grow: 0,
                center: true,
                width: '100px',
              },
            ]}
          />
        </div>
      )}
    </>
  );
}
