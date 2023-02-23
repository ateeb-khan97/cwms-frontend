'use client';

import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';

//
function Header() {
  return (
    <header className="select-none text-[#3b3e66]">
      <BreadcrumbComponent />
      <h1 className="text-3xl font-semibold ">Quality Check</h1>
      <p>Please see Quality Check below all connected channels</p>
    </header>
  );
}
//
export default function QualityCheckPage() {
  return (
    <section className="min-h-[100%] p-7">
      <Header />
    </section>
  );
}
