import AddUser from 'components/Settings/AddUser';
import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';

function Header({ isUpdate }: { isUpdate: boolean }) {
  return (
    <header className="select-none text-[#3b3e66]">
      <BreadcrumbComponent />
      <h1 className="text-3xl font-semibold ">
        {isUpdate ? 'Update User' : 'Add User'}
      </h1>
      <p>
        Please see {isUpdate ? 'Update User' : 'Add User'} below all connected
        channels
      </p>
    </header>
  );
}
export default function Page(prop: any) {
  const isUpdate = prop.params.slug == 'update-user';
  const id = prop.searchParams.id;

  return (
    <section className="flex min-h-[100%] flex-col gap-10 p-7">
      <Header isUpdate={isUpdate} />
      <div className="rounded-md border border-gray-100 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b-[1px] p-5">
          <p className="py-2 font-semibold text-gray-500">
            Here you can manage your all {isUpdate ? 'update user' : 'add user'}
            !
          </p>
        </div>
        <AddUser isUpdate={isUpdate} id={id} />
      </div>
    </section>
  );
}
