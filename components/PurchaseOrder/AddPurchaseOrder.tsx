'use client';

import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';

//
function Header() {
  return (
    <header className="select-none text-[#3b3e66]">
      <BreadcrumbComponent />
      <h1 className="text-3xl font-semibold ">Add Purchase Order</h1>
      <p>Please see Add Purchase Order below all connected channels</p>
    </header>
  );
}
//
export default function AddPurchaseOrder() {
  return (
    <section className="min-h-[100%] p-7">
      <Header />
    </section>
  );
}
