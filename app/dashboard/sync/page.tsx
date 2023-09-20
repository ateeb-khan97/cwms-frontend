import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
import SyncQuantity from './SyncQuantity';
import prisma from 'config/prisma';

function Header() {
  return (
    <header className="select-none text-[#3b3e66]">
      <BreadcrumbComponent />
      <h1 className="text-3xl font-semibold ">Sync Quantity</h1>
      <p>Please see sync quantity below all connected channels</p>
    </header>
  );
}
//
async function getLocation() {
  'use server';
  return (await prisma.$queryRawUnsafe(
    `SELECT CAST(loc_code as CHAR) as value, loc_name as label FROM locations;`,
  )) as any[];
}
//

//
export default function Page() {
  return (
    <>
      <section className="flex min-h-[100%] flex-col gap-10 p-7">
        <Header />
        <div className="rounded-md border border-gray-100 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b-[1px] p-5">
            <p className="py-2 font-semibold text-gray-500">
              Here you can manage your all sync quantity!
            </p>
          </div>
          <SyncQuantity getLocation={getLocation} />
        </div>
      </section>
    </>
  );
}
