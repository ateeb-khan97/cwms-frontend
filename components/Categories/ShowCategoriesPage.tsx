'use client';

import { Button } from '@mantine/core';
import DataTableComponent from 'components/Shared/DataTableComponent';
import axiosFunction from 'functions/axiosFunction';
import { useRouter } from 'next/navigation';
import { AiFillEdit } from 'react-icons/ai';

export default function ShowCategoriesPage({
  categoryData,
}: {
  categoryData: any[];
}) {
  const router = useRouter();
  const updateHandler = async (id: number) => {
    const response = await axiosFunction({
      urlPath: '/category/find',
      method: 'POST',
      data: { id },
    });
    localStorage.setItem('category_data', JSON.stringify(response.data));
    router.push('/dashboard/categories/update_category');
  };
  //
  return (
    <>
      <DataTableComponent
        data={categoryData}
        columns={[
          {
            name: 'ID',
            selector: (row: any) => row.id,
            grow: 0,
            center: true,
            width: '66px',
          },
          {
            name: 'Category Name',
            selector: (row: any) => row.category_name,
            grow: 1,
            sortable: true,
          },
          {
            name: 'Description',
            selector: (row: any) => row.category_description || '-',
            grow: 0,
            width: '190px',
          },
          {
            name: 'Sorting',
            selector: (row: any) => row.sorting,
            grow: 0,
            width: '100px',
          },
          {
            name: 'Level',
            selector: (row: any) => row.category_level,
            grow: 0,
            center: true,
            width: '190px',
          },
          {
            name: 'Status',
            selector: (row: any) => (
              <span
                className={`font-semibold ${
                  row.status ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {row.status ? 'Active' : 'In-Active'}
              </span>
            ),
            grow: 0,
            width: '100px',
            center: true,
          },
          {
            name: 'Actions',
            cell: (row: any) => (
              <>
                <Button
                  compact
                  className="h-6 w-6 bg-[#002884] p-0"
                  onClick={() => updateHandler(row.id)}
                >
                  <AiFillEdit className="text-white" />
                </Button>
              </>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            center: true,
            width: '90px',
            grow: 0,
          },
        ]}
      />
    </>
  );
}
