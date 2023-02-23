'use client';
import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
//
import React from 'react';
//
function Header({ isUpdate }: { isUpdate: boolean }) {
  return (
    <header className="select-none text-[#3b3e66]">
      <BreadcrumbComponent />
      <h1 className="text-3xl font-semibold ">
        {isUpdate ? 'Update Manufacturer' : 'Add Manufacturer'}
      </h1>
      <p>Please see Manufacturer form below all connected channels</p>
    </header>
  );
}
//
export default function HandleManufacturersPage({
  isUpdate,
}: {
  isUpdate: boolean;
}) {
  return (
    <section className="min-h-[100%] p-7">
      <Header isUpdate={isUpdate} />
    </section>
  );
}
