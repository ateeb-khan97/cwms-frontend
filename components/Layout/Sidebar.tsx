import { Box, Button, Image, NavLink } from '@mantine/core';
import { deleteCookie } from 'cookies-next';
import axiosFunction from 'functions/axiosFunction';
import customNotification from 'functions/customNotification';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
//
import { BiChevronRight } from 'react-icons/bi';
// types
type PropType = {
  isActive: boolean;
};
//
function SidebarBody() {
  const [active, setActive] = React.useState<number>(0);
  const [sidebarLink, setSidebarLink] = React.useState<any[]>([]);
  async function sidebarDataFetch() {
    const response = await axiosFunction({ urlPath: '/sidebar' });
    setSidebarLink(response.data);
  }
  useEffect(() => {
    sidebarDataFetch();
  }, []);
  //
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
        {each_link.children!.map((each_child: any, child_index: any) => {
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
  const router = useRouter();
  const classString: string = isActive ? 'w-[300px]' : 'w-[0px]';
  // functions
  const signOutHandler = () => {
    deleteCookie('token', { secure: false });
    deleteCookie('type', { secure: false });
    deleteCookie('user_id', { secure: false });
    deleteCookie('acc_no', { secure: false });
    deleteCookie('loc_no', { secure: false });
    customNotification({
      message: 'Sign out Successfully!',
    });
    router.push('/');
  };
  //
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
          <Button
            onClick={signOutHandler}
            className="w-56 bg-red-500 transition-all hover:scale-110 hover:bg-red-900"
          >
            Sign Out
          </Button>
        </footer>
      </div>
    </>
  );
}
