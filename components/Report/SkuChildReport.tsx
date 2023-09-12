'use client';

import Search from 'app/dashboard/report/sku-child-report/Search';
import DataTableComponent from 'components/Shared/DataTableComponent';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@mantine/core';
import { MdDownload } from 'react-icons/md';
import { saveAs } from 'file-saver';
//
interface ITableType {
  id: string;
  bin_id: string;
  inward_child: string;
  is_received: string;
  user_name: string;
  created_at: string;
  location_change_date: string;
  pick_list_id: string;
  loc_name: string;
  second_level: string;
  third_level: string;
  inward_id: string;
}
//
interface IPropType {
  getDownloadData: () => Promise<any[]>;
  getTableData: () => Promise<{
    totalCount: string;
    tableData: any[];
  }>;
}
//
export default function SkuChildReport({
  getTableData,
  getDownloadData,
}: IPropType) {
  const divRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const search = useSearchParams();
  const [tableData, setTableData] = useState<ITableType[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  async function getData() {
    setIsLoading(true);
    const data = await getTableData();
    setTableData(data.tableData);
    setTotalRows(+data.totalCount);
    const container = divRef.current;
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
    setIsLoading(false);
  }
  useEffect(() => {
    getData();
  }, [
    search.get('page'),
    search.get('search'),
    search.get('currentRowsPerPage'),
  ]);
  //
  async function downloadHandler() {
    const downloadData = await getDownloadData();
    const csvData = [
      Object.keys(downloadData[0]).join(','),
      ...downloadData.map((item) => Object.values(item).join(',')),
    ].join('\n');

    // Create a Blob containing the CSV data
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });

    // Trigger the download using the file-saver library
    saveAs(blob, 'data.csv');
  }

  return (
    <div ref={divRef}>
      <DataTableComponent
        progressPending={isLoading}
        paginationServer={true}
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={(currentRowsPerPage, currentPage) => {
          setIsLoading(true);
          const searchParams = new URLSearchParams(window.location.search);
          if (searchParams.has('currentRowsPerPage')) {
            searchParams.set(
              'currentRowsPerPage',
              currentRowsPerPage.toString(),
            );
          } else {
            searchParams.append(
              'currentRowsPerPage',
              currentRowsPerPage.toString(),
            );
          }
          if (searchParams.has('currentPage')) {
            searchParams.set('currentPage', currentPage.toString());
          } else {
            searchParams.append('currentPage', currentPage.toString());
          }
          const updatedQueryString = searchParams.toString();
          const url = `${window.location.pathname}?${updatedQueryString}`;
          router.push(url);
        }}
        onChangePage={(page, totalRows) => {
          setIsLoading(true);
          const searchParams = new URLSearchParams(window.location.search);
          if (searchParams.has('page')) {
            searchParams.set('page', page.toString());
          } else {
            searchParams.append('page', page.toString());
          }
          if (searchParams.has('totalRows')) {
            searchParams.set('totalRows', totalRows.toString());
          } else {
            searchParams.append('totalRows', totalRows.toString());
          }
          const updatedQueryString = searchParams.toString();
          const url = `${window.location.pathname}?${updatedQueryString}`;
          router.push(url);
        }}
        columns={[
          {
            name: 'ID',
            center: true,
            width: '100px',
            compact: true,
            grow: 0,
            cell(row: ITableType) {
              return row.id;
            },
          },
          {
            name: 'Inward',
            grow: 2,
            width: '150px',
            cell(row: ITableType) {
              return row.inward_id;
            },
          },
          {
            name: 'Barcode',
            grow: 2,
            width: '180px',
            cell(row: ITableType) {
              return row.inward_child;
            },
          },
          {
            name: 'Second lvl',
            center: true,
            width: '80px',
            compact: true,
            grow: 0,
            cell(row: ITableType) {
              return Number(row.second_level) < 0 ? 0 : row.second_level;
            },
          },
          {
            name: 'Third lvl',
            center: true,
            width: '80px',
            compact: true,
            grow: 0,
            cell(row: ITableType) {
              return Number(row.third_level) < 0 ? 0 : row.third_level;
            },
          },
          {
            name: 'Bin',
            center: true,
            width: '150px',
            compact: true,
            grow: 0,
            cell(row: ITableType) {
              return row.bin_id;
            },
          },
          {
            name: 'Status',
            center: true,
            width: '110px',
            compact: true,
            grow: 0,
            cell(row: ITableType) {
              let status = 'In-Transfer';
              if (row.is_received) status = 'In-Inventory';
              if (row.pick_list_id) status = 'Stock Out';
              return status;
            },
          },
          {
            name: 'Created At',
            center: true,
            width: '110px',
            compact: true,
            grow: 0,
            cell(row: ITableType) {
              return row.created_at.toString();
            },
          },
          {
            name: 'Stock In Date',
            center: true,
            width: '110px',
            compact: true,
            grow: 0,
            cell(row: ITableType) {
              return row.location_change_date || 'In Warehouse';
            },
          },
          {
            name: 'PickList #',
            center: true,
            width: '110px',
            compact: true,
            grow: 0,
            cell(row: ITableType) {
              return row.pick_list_id || '-';
            },
          },
          {
            name: 'Location',
            center: true,
            width: '110px',
            compact: true,
            grow: 0,
            cell(row: ITableType) {
              return row.loc_name;
            },
          },
          {
            name: 'User',
            center: true,
            width: '110px',
            compact: true,
            grow: 0,
            cell(row: ITableType) {
              return row.user_name;
            },
          },
        ]}
        data={tableData}
      >
        <div className="flex items-center justify-end gap-5">
          <Button
            onClick={async (e) => {
              e.currentTarget.disabled = true;
              await downloadHandler();
              e.currentTarget.disabled = false;
            }}
            size="xs"
            className="btn"
            leftIcon={<MdDownload />}
          >
            Download
          </Button>
          <Search />
        </div>
      </DataTableComponent>
    </div>
  );
}
