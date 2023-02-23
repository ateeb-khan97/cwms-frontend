'use client';

import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';

//
function Header({ isUpdate }: { isUpdate: boolean }) {
  return (
    <header className="select-none text-[#3b3e66]">
      <BreadcrumbComponent />
      <h1 className="text-3xl font-semibold ">
        {isUpdate ? 'Update Vendors' : 'Add Vendors'}
      </h1>
      <p>Please see Vendors form below all connected channels</p>
    </header>
  );
}
//
export default function HandleVendorsPage({ isUpdate }: { isUpdate: boolean }) {
  return (
    <section className="min-h-[100%] p-7">
      <Header isUpdate={isUpdate} />
    </section>
  );
}
