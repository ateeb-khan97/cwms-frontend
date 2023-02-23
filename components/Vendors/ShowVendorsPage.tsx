'use client';

import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';

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
export default function ShowVendorsPage() {
  return (
    <section className="min-h-[100%] p-7">
      <Header />
    </section>
  );
}
