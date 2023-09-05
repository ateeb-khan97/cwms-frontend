'use client';
//
import { TextInput } from '@mantine/core';
import { useDebouncedValue, useShallowEffect } from '@mantine/hooks';
import { useRouter } from 'next/navigation';
import { MdSearch } from 'react-icons/md';
import { useState } from 'react';
//
export default function Search({ query }: { query?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(query || '');
  const [debounced] = useDebouncedValue(value, 500);
  //
  useShallowEffect(() => {
    let url = new URL(`${window.location.origin}${window.location.pathname}`);
    url.searchParams.append('search', debounced);
    router.push(url.toString());
  }, [debounced]);
  //
  return (
    <div className="flex justify-end p-2">
      <TextInput
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
        size="xs"
        className="w-56"
        placeholder="Search"
        icon={<MdSearch />}
      />
    </div>
  );
}
