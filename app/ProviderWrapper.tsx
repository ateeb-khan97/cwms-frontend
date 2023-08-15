'use client';

import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { RecoilRoot } from 'recoil';
import RootStyleRegistry from './emotion';

//
export default function ProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RecoilRoot>
        <RootStyleRegistry>
          <Notifications />
          <ModalsProvider>{children}</ModalsProvider>
        </RootStyleRegistry>
      </RecoilRoot>
    </>
  );
}
