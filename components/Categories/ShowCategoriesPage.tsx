'use client';

import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';

//
function Header() {
  return (
    <header className="select-none text-[#3b3e66]">
      <BreadcrumbComponent />
      <h1 className="text-3xl font-semibold ">Categories</h1>
      <p>Please see Categories below all connected channels</p>
    </header>
  );
}
//
export default function ShowCategoriesPage() {
  return (
    <section className="min-h-[100%] p-7">
      <Header />
    </section>
  );
}
