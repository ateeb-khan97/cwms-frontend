import { deleteCookie } from 'cookies-next';
import { cookies } from 'next/headers';
import Image from 'next/image';

export default function Page() {
  let tableData: any[] = [];
  const cookieData = cookies().get('demandNoteDate')?.value;
  if (cookieData) {
    tableData = JSON.parse(cookieData);
    deleteCookie('demandNoteDate');
  }
  return (
    <>
      <section className="flex min-h-screen w-full items-center justify-center">
        <main className="w-[210mm] py-10">
          <header
            className="flex items-center justify-between
  "
          >
            <div>
              <Image
                alt="logo"
                src={'/pharm_logo.png'}
                width={200}
                height={200}
              />
            </div>

            <div>
              <Image alt="logo" src={'/invoice.png'} width={200} height={200} />
            </div>
          </header>
          <h1 className="text-center text-3xl font-semibold text-gray-700">
            Transfer Note
          </h1>
          <table className="mt-5 w-full ">
            <thead>
              <tr>
                <th className="border border-black">Product ID</th>
                <th className="border border-black">Product Name</th>
                <th className="border border-black">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {tableData.length > 0 &&
                tableData.map((each: any, key: number) => {
                  return (
                    <tr key={key}>
                      <td className="border border-black text-center">
                        {each.id || ''}
                      </td>
                      <td className="border border-black text-center">
                        {each.product_name || ''}
                      </td>
                      <td className="border border-black text-center">
                        {each.quantity || ''}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </main>
      </section>
    </>
  );
}
