'use client';

import Search from 'app/dashboard/report/sku-child-report/Search';
import DataTableComponent from 'components/Shared/DataTableComponent';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
//
interface ITableType {
  bin_id: string;
  inward_child: string;
  is_received: string;
  user_name: string;
  created_at: string;
  location_change_date: string;
  pick_list_id: string;
  location_id: string;
}
//
interface IPropType {
  getTableData: () => Promise<{
    totalCount: string;
    tableData: any[];
  }>;
}
//
export default function SkuChildReport({ getTableData }: IPropType) {
  const router = useRouter();
  const [tableData, setTableData] = useState<ITableType[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  async function getData() {
    setIsLoading(true);
    const data = await getTableData();
    console.log(data.tableData);

    setTableData(data.tableData);
    setTotalRows(+data.totalCount);
    setIsLoading(false);
  }
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <DataTableComponent
        progressPending={isLoading}
        paginationServer={true}
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={(currentRowsPerPage, currentPage) => {
          let url = new URL(
            `${window.location.origin}${window.location.pathname}`,
          );
          url.searchParams.append(
            'currentRowsPerPage',
            currentRowsPerPage.toString(),
          );
          url.searchParams.append('currentPage', currentPage.toString());
          router.push(url.toString());
        }}
        onChangePage={(page, totalRows) => {
          let url = new URL(
            `${window.location.origin}${window.location.pathname}`,
          );
          url.searchParams.append('page', page.toString());
          url.searchParams.append('totalRows', totalRows.toString());
          router.push(url.toString());
        }}
        columns={[
          {
            name: 'Barcode',
            center: true,
            width: '150px',
            compact: true,
            grow: 0,
            cell(row: ITableType, rowIndex, column, id) {
              return row.inward_child;
            },
          },
        ]}
        data={tableData}
      >
        <Search />
      </DataTableComponent>
    </>
  );
}
