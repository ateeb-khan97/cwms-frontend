'use client';
//
import '@/styles/globals.css';
import React from 'react';
//
import { RecoilRoot } from 'recoil';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
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
          <NotificationsProvider>
            <ModalsProvider>
              <body>{children}</body>
            </ModalsProvider>
          </NotificationsProvider>
        </MantineProvider>
      </RecoilRoot>
    </html>
  );
}
