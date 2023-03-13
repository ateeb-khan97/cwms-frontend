'use client';

import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';

import React from 'react';
import Form from './child/Form';
import OrderCart from './child/OrderCart';

//
function Header() {
  return (
    <header className="select-none text-[#3b3e66]">
      <BreadcrumbComponent />
      <h1 className="text-3xl font-semibold ">Create New Purchase Order</h1>
      <p>
        Please see Create New Purchase Order form below all connected channels
      </p>
    </header>
  );
}
//

//
export default function AddPurchaseOrder() {
  const [tableData, setTableData] = React.useState([]);
  //
  return (
    <section className="flex min-h-[100%] flex-col gap-10 p-7">
      <Header />
      <div className="rounded-md border border-gray-100 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b-[1px] p-5">
          <p className="py-2 font-semibold text-gray-500">
            Here you can manage your all Create Purchase Order!
          </p>
        </div>
        <form className="flex flex-col gap-5">
          <Form setTableData={setTableData} />
          <OrderCart tableData={tableData} setTableData={setTableData} />
        </form>
      </div>
    </section>
  );
}
