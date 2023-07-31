'use client';
import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
import DataTableComponent from 'components/Shared/DataTableComponent';
import Loader from 'components/Shared/Loader';
import useUserData from 'modules/Users/useUserData';
import Link from 'next/link';
//
import React from 'react';
//
function Header() {
  return (
    <header className="select-none text-[#3b3e66]">
      <BreadcrumbComponent />
      <h1 className="text-3xl font-semibold ">Users</h1>
      <p>Please see Users below all connected channels</p>
    </header>
  );
}
//
function Table() {
  const { loading, userData } = useUserData();
  //
  return (
    <>
      {loading ? (
        <div className="flex w-[100%] justify-center p-28">
          <Loader />
        </div>
      ) : (
        <DataTableComponent
          data={userData}
          columns={[
            {
              name: 'ID',
              selector: (row: any) => row.id,
              grow: 0,
              center: true,
              width: '66px',
            },
            {
              name: 'User Name',
              selector: (row: any) => row.user_name,
              grow: 1,
              sortable: true,
            },
            {
              name: 'Account Number',
              selector: (row: any) => row.account_number,
              grow: 0,
              width: '190px',
            },
            {
              name: 'Phone Number',
              selector: (row: any) =>
                row.phone_number == '' ? '-' : row.phone_number,
              grow: 0,
              center: true,
              width: '190px',
            },
            {
              name: 'Email',
              selector: (row: any) => row.email,
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
              cell: (row: any) => (
                <>
                  <Link
                    className="btn"
                    href={'/dashboard/users/update-user?id=' + row.id}
                  >
                    Edit
                  </Link>
                </>
              ),
              grow: 0,
              width: '100px',
              center: true,
            },
          ]}
        />
      )}
    </>
  );
}
//
export default function UsersPage() {
  return (
    <section className="flex min-h-[100%] flex-col gap-10 p-7">
      <Header />
      <div className="rounded-md border border-gray-100 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b-[1px] p-5">
          <p className="py-2 font-semibold text-gray-500">
            Here you can manage your all Users!
          </p>
          <Link
            className="rounded-md bg-red-500 px-5 py-2 text-white transition-all hover:scale-110 hover:bg-red-900"
            href={'/dashboard/users/add-user'}
          >
            Add User
          </Link>
        </div>
        <Table />
      </div>
    </section>
  );
}
