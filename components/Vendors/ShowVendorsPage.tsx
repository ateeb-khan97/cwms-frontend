'use client';

import { Button } from '@mantine/core';
import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
import DataTableComponent from 'components/Shared/DataTableComponent';
import Loader from 'components/Shared/Loader';
import useVendorData from 'modules/Vendor/useVendorData';
import Link from 'next/link';
import { AiFillEdit } from 'react-icons/ai';

//
function Header() {
  return (
    <header className="select-none text-[#3b3e66]">
      <BreadcrumbComponent />
      <h1 className="text-3xl font-semibold ">Vendors</h1>
      <p>Please see Vendors below all connected channels</p>
    </header>
  );
}
//
function Table() {
  const { loading, vendorData } = useVendorData();
  return (
    <>
      {loading ? (
        <div className="flex w-[100%] justify-center p-28">
          <Loader />
        </div>
      ) : (
        <DataTableComponent
          data={vendorData}
          columns={[
            {
              name: 'ID',
              selector: (row: any) => row.id,
              grow: 0,
              center: true,
              width: '76px',
            },
            {
              name: 'Vendor Name',
              selector: (row: any) => row.vendor_name,
              grow: 2,
              sortable: true,
            },
            {
              name: 'Line of Business',
              selector: (row: any) => row.line_of_business,
              grow: 0,
              width: '140px',
              center: true,
            },
            {
              name: 'Drug License Number',
              selector: (row: any) => row.drug_license_no,
              grow: 0,
              width: '130px',
              center: true,
            },
            {
              name: 'Contact Person',
              selector: (row: any) => row.contact_person,
              grow: 0,
              width: '130px',
              center: true,
            },
            {
              name: 'Business Phone Number',
              selector: (row: any) => row.business_phone_number,
              grow: 0,
              width: '200px',
              center: true,
            },
            {
              name: 'Email Address',
              selector: (row: any) => row.email_address,
              grow: 0,
              width: '200px',
              center: true,
            },
            {
              name: 'Payment Method',
              selector: (row: any) => row.payment_method,
              grow: 0,
              width: '100px',
              center: true,
            },
            {
              name: 'NTN',
              selector: (row: any) => row.ntn,
              grow: 0,
              width: '100px',
              center: true,
            },
            {
              name: 'User ID',
              selector: (row: any) => row.user_id,
              grow: 0,
              width: '100px',
              center: true,
            },
            {
              name: 'User Name',
              selector: (row: any) => row.user_name,
              grow: 0,
              width: '100px',
              center: true,
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
              name: 'Action',
              cell: (row: any) => (
                <>
                  <Link href={`/dashboard/vendors/update_vendor?id=${row.id}`}>
                    <Button compact className="h-6 w-6 bg-[#002884] p-0">
                      <AiFillEdit className="text-white" />
                    </Button>
                  </Link>
                </>
              ),
              ignoreRowClick: true,
              allowOverflow: true,
              center: true,
              width: '80px',
              grow: 0,
            },
          ]}
        />
      )}
    </>
  );
}
//
export default function ShowVendorsPage() {
  return (
    <section className="flex min-h-[100%] flex-col gap-10 p-7">
      <Header />
      <div className="rounded-md border border-gray-100 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b-[1px] p-5">
          <p className="py-2 font-semibold text-gray-500">
            Here you can manage your all Vendors!
          </p>
          <Link
            className="rounded-md bg-red-500 px-5 py-2 text-white transition-all hover:scale-110 hover:bg-red-900"
            href={'/dashboard/vendors/add_vendor'}
          >
            Add Vendor
          </Link>
        </div>
        <Table />
      </div>
    </section>
  );
}
