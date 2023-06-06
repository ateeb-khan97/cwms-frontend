'use client';
//
import '@/styles/globals.css';
import React from 'react';
//
import { RecoilRoot } from 'recoil';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
//
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <RecoilRoot>
        <MantineProvider withNormalizeCSS withGlobalStyles>
          <Notifications />
          <ModalsProvider>
            <body>{children}</body>
          </ModalsProvider>
        </MantineProvider>
      </RecoilRoot>
    </html>
  );
}
