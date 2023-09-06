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
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('search')) {
      searchParams.set('search', debounced);
    } else {
      searchParams.append('search', debounced);
    }
    if (searchParams.has('page')) {
      searchParams.set('page', '1');
    } else {
      searchParams.append('page', '1');
    }
    const updatedQueryString = searchParams.toString();
    const url = `${window.location.pathname}?${updatedQueryString}`;
    router.push(url);
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
