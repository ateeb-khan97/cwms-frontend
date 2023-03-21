import HandlerProductPage from 'components/Products/HandleProductPage';
import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
//
function Header({ isUpdate }: { isUpdate: boolean }) {
  return (
    <header className="select-none text-[#3b3e66]">
      <BreadcrumbComponent />
      <h1 className="text-3xl font-semibold ">
        {isUpdate ? 'Update Product' : 'Add Product'}
      </h1>
      <p>Please see Products below all connected channels</p>
    </header>
  );
}
//
export default function Page({ params }: any) {
  const isUpdate: boolean = params.slug.includes('update');
  return (
    <section className="flex min-h-[100%] flex-col gap-5 p-7">
      <Header isUpdate={isUpdate} />
      <div className="rounded-md border border-gray-100 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b-[1px] p-5">
          <p className="py-2 font-semibold text-gray-500">
            Here you can manage your all Add and Update Products!
          </p>
        </div>
        <HandlerProductPage isUpdate={isUpdate} />
      </div>
    </section>
  );
}
