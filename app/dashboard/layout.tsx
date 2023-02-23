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
  const [isActive, setIsActive] = React.useState<boolean>(true);
  const togglerFunction = () => setIsActive((pre) => !pre);
  //
  const classString = isActive ? 'w-[calc(100vw_-_300px)]' : 'w-screen';
  //
  return (
    <section className="flex h-screen w-screen overflow-hidden">
      <Sidebar isActive={isActive} />
      <main className={`relative transition-all ${classString}`}>
        <div className="h-[80px]" />
        <Navbar isActive={isActive} togglerFunction={togglerFunction} />
        <div className="h-[calc(100vh_-_80px)] bg-red-300">{children}</div>
      </main>
    </section>
  );
}
