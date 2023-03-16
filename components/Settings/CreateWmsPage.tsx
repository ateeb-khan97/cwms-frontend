'use client';
import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
//
import React from 'react';
//
function Header() {
  return (
    <header className="select-none text-[#3b3e66]">
      <BreadcrumbComponent />
      <h1 className="text-3xl font-semibold ">Create WMS</h1>
      <p>Please see Create WMS below all connected channels</p>
    </header>
  );
}
//
export default function CreateWmsPage() {
  return (
    <section className="min-h-[100%] p-7">
      <Header />
    </section>
  );
}
