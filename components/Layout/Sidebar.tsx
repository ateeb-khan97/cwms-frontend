import { Box, Button, Image, NavLink } from '@mantine/core';
import { sidebarLink } from 'modules/Sidebar/sidebarLinks';
import Link from 'next/link';
import React from 'react';
//
import { BiChevronRight } from 'react-icons/bi';
// types
type PropType = {
  isActive: boolean;
};
//
function SidebarBody() {
  const [active, setActive] = React.useState<number>(0);
  const data = sidebarLink.map((each_link, index) => {
    return each_link.hasChildren ? (
      <NavLink
        label={each_link.label}
        rightSection={<BiChevronRight />}
        icon={each_link.icon}
        key={index}
        active={index == active}
        onClick={() => setActive(index)}
        color="indigo"
      >
        {each_link.children!.map((each_child, child_index) => {
          return (
            <Link key={child_index} href={each_child.href}>
              <NavLink label={each_child.label} icon={each_child.icon} />
            </Link>
          );
        })}
      </NavLink>
    ) : (
      <Link onClick={() => setActive(index)} key={index} href={each_link.href!}>
        <NavLink
          label={each_link.label}
          active={index == active}
          icon={each_link.icon}
          color="indigo"
        />
      </Link>
    );
  });
  return (
    <main className="h-[calc(100vh_-_160px)] overflow-y-auto overflow-x-hidden scrollbar-none">
      <Box sx={{ width: '100%' }}>{data}</Box>
    </main>
  );
}
//
export default function Sidebar({ isActive }: PropType) {
  const classString: string = isActive ? 'w-[300px]' : 'w-[0px]';
  return (
    <>
      <div className={`overflow-hidden transition-all ${classString}`}>
        <header className="flex h-[80px] items-center justify-center border">
          <div className="w-48">
            <Image src={'/pharm_logo.png'} />
          </div>
        </header>
        <SidebarBody />
        <footer className="flex h-[80px] items-center justify-center border">
          <Button className="w-56 bg-red-500 transition-all hover:scale-110 hover:bg-red-900">
            Sign Out
          </Button>
        </footer>
      </div>
    </>
  );
}
