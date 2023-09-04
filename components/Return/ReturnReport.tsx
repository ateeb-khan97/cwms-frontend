'use client';

import DataTableComponent from 'components/Shared/DataTableComponent';
import { Skeleton, Button, TextInput } from '@mantine/core';
import { useEffect, useState } from 'react';
import { BsFilePdf } from 'react-icons/bs';
import { MdSearch } from 'react-icons/md';
import Link from 'next/link';

//
interface PropType {
  getTableData: () => Promise<any>;
}
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
        <TextInput
          size="xs"
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
export default function ReturnReport({ getTableData }: PropType) {
  const [temporary, setTemporary] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  //
  const filterFunction = (search: string) => {
    search = search.toLowerCase();
    const filteredData = temporary.filter((each) => {
      for (let key in each) {
        if (
          each[key as keyof any]?.toString()?.toLowerCase()?.includes(search)
        ) {
          return true;
        }
      }
      return false;
    });
    setTableData(filteredData);
  };
  //
  async function setData() {
    setIsLoading(true);
    const temp = await getTableData();
    setTableData(temp);
    setTemporary(temp);
    setIsLoading(false);
  }
  //
  useEffect(() => {
    setData();
  }, []);
  //
  return (
    <>
      {isLoading ? (
        <div className="w-full p-5">
          <Skeleton height={8} radius="xl" />
          <Skeleton height={8} mt={6} radius="xl" />
          <Skeleton height={8} mt={6} width="70%" radius="xl" />
        </div>
      ) : (
        <DataTableComponent
          columns={[
            {
              name: '#',
              cell(row, rowIndex, column, id) {
                return rowIndex + 1;
              },
              width: '100px',
              sortable: true,
              grow: 0,
              center: true,
              compact: true,
            },
            {
              name: 'Vendor Name',
              cell(row, rowIndex, column, id) {
                return row.vendorName || '-';
              },
              grow: 2,
              sortable: true,
            },
            {
              name: 'PickList ID',
              cell(row, rowIndex, column, id) {
                return row.picklist_id || '-';
              },
              width: '100px',
              grow: 0,
              center: true,
              compact: true,
            },
            {
              name: 'User ID',
              cell(row, rowIndex, column, id) {
                return row.user_id || '-';
              },
              width: '150px',
              grow: 0,
              center: true,
              compact: true,
            },
            {
              name: 'User Name',
              cell(row, rowIndex, column, id) {
                return row.user_name || '-';
              },
              width: '150px',
              grow: 0,
              center: true,
              compact: true,
            },
            {
              name: 'PDF',
              width: '100px',
              grow: 0,
              center: true,
              compact: true,
              cell(row, rowIndex, column, id) {
                return (
                  <Link
                    target="_blank"
                    href={`/invoice/return-invoice?id=${row.picklist_id}`}
                  >
                    <Button className="btn" compact>
                      <BsFilePdf />
                    </Button>
                  </Link>
                );
              },
            },
          ]}
          data={tableData}
        >
          <TableHeadComponent filterFunction={filterFunction} />
        </DataTableComponent>
      )}
    </>
  );
}
