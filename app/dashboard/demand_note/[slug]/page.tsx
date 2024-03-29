//
import AddDemandNotePage from 'components/DemandNote/AddDemandNotePage';
import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';

function Header({ isDetails }: { isDetails: boolean }) {
  return (
    <header className="select-none text-[#3b3e66]">
      <BreadcrumbComponent />
      <h1 className="text-3xl font-semibold ">
        {isDetails ? 'Details Demand Note' : 'Add Demand Note'}
      </h1>
      <p>Please see Demand Note below all connected channels</p>
    </header>
  );
}
//
export default function Page({ params }: any) {
  const isDetails: boolean = params.slug.includes('details_demand_note');

  return (
    <section className="flex min-h-[100%] flex-col gap-10 p-7">
      <Header isDetails={isDetails} />
      <div className="rounded-md border border-gray-100 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b-[1px] p-5">
          <p className="py-2 font-semibold text-gray-500">
            Here you can manage your all Demand Note Process!
          </p>
        </div>
        <AddDemandNotePage isDetails={isDetails} />
      </div>
    </section>
  );
}
