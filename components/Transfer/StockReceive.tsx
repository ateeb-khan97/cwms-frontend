'use client';

import { TextInput } from '@mantine/core';
import React from 'react';
//
export default function StockReceive() {
  // refs
  const scanProductsRef = React.useRef<HTMLInputElement>(null);
  //
  // states
  const [scannedProducts, setScannedProducts] = React.useState<any[]>([]);
  //
  // functions
  const scannedProductsFunction = () => {};
  //
  return (
    <section className="p-5">
      <form>
        <TextInput
          ref={scanProductsRef}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              scannedProductsFunction();
            }
          }}
          label="Scan Products"
          placeholder="Scan Products Here"
          size="xs"
        />
      </form>
    </section>
  );
}
