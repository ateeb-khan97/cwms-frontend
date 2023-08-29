import ShowCategoriesPage from 'components/Categories/ShowCategoriesPage';
import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
import prisma from 'config/prisma';
import Link from 'next/link';
//

//
async function getCategoryData() {
  'use server';
  return await prisma.categories.findMany({
    select: {
      id: true,
      category_name: true,
      category_description: true,
      category_level: true,
      sorting: true,
      status: true,
    },
  });
}
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
export default async function Page() {
  const categoryData = await getCategoryData();
  return (
    <section className="flex min-h-[100%] flex-col gap-10 p-7">
      <Header />
      <div className="rounded-md border border-gray-100 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b-[1px] p-5">
          <p className="py-2 font-semibold text-gray-500">
            Here you can manage your all Category!
          </p>
          <Link
            className="rounded-md bg-red-500 px-5 py-2 text-white transition-all hover:scale-110 hover:bg-red-900"
            href={'/dashboard/categories/add_category'}
          >
            Add Category
          </Link>
        </div>
        <ShowCategoriesPage categoryData={categoryData} />
      </div>
    </section>
  );
}
