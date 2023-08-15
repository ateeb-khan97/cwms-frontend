import '@/styles/globals.css';
import React from 'react';
import ProviderWrapper from './ProviderWrapper';
//
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <ProviderWrapper>{children}</ProviderWrapper>
      </body>
    </html>
  );
}
