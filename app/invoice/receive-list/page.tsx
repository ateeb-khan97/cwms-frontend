import Image from 'next/image';
import ReceiveTable from './ReceiveTable';

export default function Page() {
  return (
    <>
      <section className="flex flex-col items-center justify-between py-10">
        <div className="main_page_invoice flex min-h-screen items-center justify-center">
          <main className="w-[180mm]">
            <header className="flex justify-between">
              <div className="w-56">
                <Image
                  draggable="false"
                  alt="logo"
                  src={'/pharm_logo.png'}
                  width={100}
                  height={100}
                  className="w-full"
                />
              </div>
              <div className="w-56">
                <Image
                  draggable="false"
                  alt="logo"
                  src={'/pharm_logo.png'}
                  width={100}
                  height={100}
                  className="w-full"
                />
              </div>
            </header>
            <h1 className="w-full text-center font-semibold">Receive List</h1>
            <ReceiveTable />
          </main>
        </div>
      </section>
    </>
  );
}
