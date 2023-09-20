'use client';
import React, { useState, useEffect } from 'react';
import { Select, Button } from '@mantine/core';
import axiosFunction from 'functions/axiosFunction';
//
interface IProp {
  getLocation: () => Promise<any[]>;
}
//
export default function SyncQuantity({ getLocation }: IProp) {
  const [locationData, setLocationData] = useState<any[]>([]);
  const locationSetter = async () => setLocationData(await getLocation());
  useEffect(() => {
    locationSetter();
  }, []);
  //
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [location, setLocation] = useState<string>('');
  async function submitHandler() {
    setIsLoading(true);
    const response = await axiosFunction({
      urlPath: '/sync/quantity',
      method: 'POST',
      data: { locationId: location },
    });
    setIsLoading(false);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submitHandler();
      }}
      className="flex w-96 items-end justify-between gap-2 p-5"
    >
      <Select
        value={location}
        onChange={(e) => setLocation(e!)}
        required
        clearable
        searchable
        className="w-full"
        size="xs"
        data={locationData}
        label="Location"
        placeholder="Select Location"
      />
      <Button
        disabled={isLoading}
        loading={isLoading}
        size="xs"
        type="submit"
        className="btn"
      >
        Sync
      </Button>
    </form>
  );
}
