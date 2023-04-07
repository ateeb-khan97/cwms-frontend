'use client';
//
import { Avatar, Burger, Group, Text, UnstyledButton } from '@mantine/core';
import { getCookie } from 'cookies-next';
//
type PropType = {
  isActive: boolean;
  togglerFunction: () => void;
};
//
export default function Navbar({ isActive, togglerFunction }: PropType) {
  const user_name = getCookie('user_name');
  const acc_no = getCookie('acc_no');
  return (
    <nav className="absolute top-0 left-0 z-10 flex h-[80px] w-[100%] items-center justify-between bg-white px-5 shadow-md">
      <Burger opened={isActive} onClick={togglerFunction} />
      {/* <UnstyledButton>
        <Group>
          <Avatar size={40} color="blue">
            {user_name?.toString().substring(0, 2)}
          </Avatar>
          <div>
            <Text className="font-semibold">{user_name}</Text>
            <Text size="xs" color="dimmed">
              {acc_no}
            </Text>
          </div>
        </Group>
      </UnstyledButton> */}
    </nav>
  );
}
