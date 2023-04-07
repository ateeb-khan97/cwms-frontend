import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
import TransferList from 'components/Transfer/TransferList';

function Header() {
  return (
    <header className="select-none text-[#3b3e66]">
      <BreadcrumbComponent />
      <h1 className="text-3xl font-semibold ">Transfer List</h1>
      <p>Please see Transfer List below all connected channels</p>
    </header>
  );
}
export default function Page() {
  return (
    <section className="flex min-h-[100%] flex-col gap-10 p-7">
      <Header />
      <div className="rounded-md border border-gray-100 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b-[1px] p-5">
          <p className="py-2 font-semibold text-gray-500">
            Here you can manage your all Transfer!
          </p>
        </div>
        <TransferList />
      </div>
    </section>
  );
}
