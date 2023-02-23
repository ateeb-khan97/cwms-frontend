'use client';
//
import '@/styles/globals.css';
import React from 'react';
//
import { RecoilRoot } from 'recoil';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
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
          <NotificationsProvider>
            <body>{children}</body>
          </NotificationsProvider>
        </MantineProvider>
      </RecoilRoot>
    </html>
  );
}
