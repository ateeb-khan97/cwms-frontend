'use client';

import { Button } from '@mantine/core';
import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
import DataTableComponent from 'components/Shared/DataTableComponent';
import Loader from 'components/Shared/Loader';
import axiosFunction from 'functions/axiosFunction';
import useManufacturerData from 'modules/Manufacturer/useManufacturerData';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AiFillEdit } from 'react-icons/ai';
//
function Header() {
  return (
    <header className="select-none text-[#3b3e66]">
      <BreadcrumbComponent />
      <h1 className="text-3xl font-semibold ">Manufacturers</h1>
      <p>Please see Manufacturers below all connected channels</p>
    </header>
  );
}
//
function Table() {
  const router = useRouter();
  const { loading, manufacturerData } = useManufacturerData();
  //
  const updateHandler = async (id: number) => {
    const [filtered_manufacturer] = await axiosFunction({
      urlPath: '/manufacturer/find',
      method: 'POST',
      data: { id },
    }).then((res) => res.data);
    localStorage.setItem(
      'manufacturer_data',
      JSON.stringify(filtered_manufacturer),
    );
    router.push('/dashboard/manufacturers/update_manufacturer');
  };
  //
  return (
    <>
      {loading ? (
        <div className="flex w-[100%] justify-center p-28">
          <Loader />
        </div>
      ) : (
        <DataTableComponent
          data={manufacturerData}
          columns={[
            {
              name: 'ID',
              selector: (row: any) => row.id,
              grow: 0,
              center: true,
              width: '66px',
            },
            {
              name: 'Manufacturer',
              selector: (row: any) => row.manufacturer_name,
              grow: 1,
              sortable: true,
            },
            {
              name: 'LOB',
              selector: (row: any) => row.line_of_business,
              grow: 1,
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
      )}
    </>
  );
}
//
export default function ShowManufacturersPage() {
  return (
    <section className="flex min-h-[100%] flex-col gap-10 p-7">
      <Header />
      <div className="rounded-md border border-gray-100 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b-[1px] p-5">
          <p className="py-2 font-semibold text-gray-500">
            Here you can manage your all Manufacturers!
          </p>
          <Link
            className="rounded-md bg-red-500 py-2 px-5 text-white transition-all hover:scale-110 hover:bg-red-900"
            href={'/dashboard/manufacturers/add_manufacturer'}
          >
            Add Manufacturer
          </Link>
        </div>
        <Table />
      </div>
    </section>
  );
}
