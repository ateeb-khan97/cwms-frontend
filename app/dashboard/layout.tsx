'use client';
import Navbar from 'components/Layout/Navbar';
import Sidebar from 'components/Layout/Sidebar';
import React from 'react';
//
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // use-state
  const [isActive, setIsActive] = React.useState<boolean>(false);
  const togglerFunction = () =>
    setIsActive((pre) => {
      const value: boolean = !pre;
      localStorage.setItem('sidebar_active', JSON.stringify(value));
      return value;
    });
  //
  React.useEffect(() => {
    const sidebar_active: boolean = JSON.parse(
      localStorage.getItem('sidebar_active')!,
    );
    //
    if (sidebar_active == null) {
      setIsActive(true);
    } else {
      setIsActive(sidebar_active);
    }

    //
  }, []);
  //
  const classString = isActive ? 'w-[calc(100vw_-_300px)]' : 'w-screen';
  //
  return (
    <section className="flex h-screen w-screen overflow-hidden">
      <Sidebar isActive={isActive} />
      <main className={`relative transition-all ${classString}`}>
        <div className="h-[80px]" />
        <Navbar isActive={isActive} togglerFunction={togglerFunction} />
        <div className="custom_shadow h-[calc(100vh_-_80px)] overflow-auto bg-[#f4f5fd] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#aaa]">
          {children}
        </div>
      </main>
    </section>
  );
}
