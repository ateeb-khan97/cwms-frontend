import ReturnForm from 'components/Return/ReturnForm';
import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
import prisma from '../../../config/prisma';
//
async function getVendorDropDownData() {
  const vendor = await prisma.vendors.findMany({
    select: { id: true, vendor_name: true },
  });
  return vendor.map((each) => ({
    value: each.id.toString(),
    label: each.vendor_name,
  }));
}
//
//

function Header() {
  return (
    <header className="select-none text-[#3b3e66]">
      <BreadcrumbComponent />
      <h1 className="text-3xl font-semibold ">Return</h1>
      <p>Please see Return below all connected channels</p>
    </header>
  );
}
export default async function Page() {
  const vendorDropDownData = await getVendorDropDownData();

  return (
    <>
      <section className="flex min-h-[100%] flex-col gap-10 p-7">
        <Header />
        <div className="rounded-md border border-gray-100 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b-[1px] p-5">
            <p className="py-2 font-semibold text-gray-500">
              Here you can manage your all Returns!
            </p>
          </div>
          <ReturnForm vendorDropDownData={vendorDropDownData} />
        </div>
      </section>
    </>
  );
}
