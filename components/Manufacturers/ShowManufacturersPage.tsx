'use client';

import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
import DataTableComponent from 'components/Shared/DataTableComponent';
import Loader from 'components/Shared/Loader';
import useManufacturerData from 'modules/Manufacturer/useManufacturerData';
import Link from 'next/link';
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
function Form() {
  const { loading, manufacturerData } = useManufacturerData();
  //
  const updateHandler = (id: number) => {};
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
              name: 'Created At',
              selector: (row: any) => row.createdAt,
              grow: 0,
              center: true,
              width: '190px',
            },
            {
              name: 'Updated At',
              selector: (row: any) => row.updatedAt,
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
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-md bg-[#002884]"
                    onClick={() => updateHandler(row.id)}
                  >
                    <AiFillEdit className="text-white" />
                  </span>
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
        <Form />
      </div>
    </section>
  );
}
