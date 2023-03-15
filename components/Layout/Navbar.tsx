'use client';
//
import { Burger } from '@mantine/core';
//
type PropType = {
  isActive: boolean;
  togglerFunction: () => void;
};
//
export default function Navbar({ isActive, togglerFunction }: PropType) {
  return (
    <nav className="absolute top-0 left-0 z-10 flex h-[80px] w-[100%] items-center bg-white px-5 shadow-md">
      <Burger opened={isActive} onClick={togglerFunction} />
    </nav>
  );
}
