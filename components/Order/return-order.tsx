'use client';

import { Button, TextInput } from '@mantine/core';
import DataTableComponent from 'components/Shared/DataTableComponent';
import axiosFunction from 'functions/axiosFunction';
import customNotification from 'functions/customNotification';
import { useRef, useState } from 'react';
import { MdClear } from 'react-icons/md';

//
export default function ReturnOrder() {
  const orderRef = useRef<HTMLInputElement>(null);
  const inwardRef = useRef<HTMLInputElement>(null);
  const [orderId, setOrderId] = useState<string>('');
  const [inwardChild, setInwardChild] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //
  async function submitHandler() {
    setIsLoading(true);
    const response = await axiosFunction({
      urlPath: '/return-order/',
      method: 'POST',
      data: {
        customerOrderId: orderId,
        skuChild: inwardChild,
      },
    });
    //
    customNotification({
      message: response.message,
      title: response.status == 200 ? 'Success' : 'Failed',
    });
    //
    setIsLoading(false);
  }
  //
  return (
    <>
      <section className="p-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setOrderId(orderRef.current!.value);
            setTimeout(() => {
              inwardRef.current!.focus();
            }, 500);
          }}
          className="flex items-end gap-5"
        >
          <TextInput
            disabled={orderId != ''}
            ref={orderRef}
            className="w-72"
            label="Order Id"
            placeholder="Enter order id here"
            size="xs"
            required
          />
          <Button
            onClick={() => {
              setOrderId('');
              setInwardChild([]);
              inwardRef.current!.value = '';
            }}
            disabled={orderId == ''}
            size="xs"
            className="bg-red-500 transition-all hover:bg-red-900"
            type="button"
          >
            <MdClear />
          </Button>
        </form>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const response = await axiosFunction({
              urlPath: '/return-order/child-check',
              method: 'POST',
              data: { inwardChild: inwardRef.current!.value },
            });
            //
            const doesExists = response.data[0];
            //
            if (doesExists) {
              setInwardChild((pre) => [...pre, inwardRef.current!.value]);
            } else {
              customNotification({
                message: 'PickList or Inward does not exist!',
                title: 'Failed',
              });
            }
            inwardRef.current!.value = '';
          }}
          className="mt-3"
        >
          <TextInput
            disabled={orderId == ''}
            ref={inwardRef}
            className="w-72"
            label="Inward Child"
            placeholder="Scan inward child here..."
            size="xs"
            required
          />
        </form>
      </section>
      <div className="flex w-full justify-end px-5">
        <Button
          onClick={submitHandler}
          loading={isLoading}
          disabled={inwardChild.length == 0}
          className="w-56 bg-red-500 transition-all hover:bg-red-900"
        >
          Submit
        </Button>
      </div>
      <DataTableComponent
        columns={[
          {
            sortable: true,
            name: '#',
            center: true,
            grow: 0,
            width: '70px',
            compact: true,
            cell(row, rowIndex, column, id) {
              return rowIndex + 1;
            },
          },
          {
            sortable: true,
            name: 'Inward Child',
            grow: 1,
            cell(row, rowIndex, column, id) {
              return row;
            },
          },
          {
            sortable: true,
            name: 'Order ID',
            grow: 1,
            cell(row, rowIndex, column, id) {
              return orderId;
            },
          },
        ]}
        data={inwardChild}
      >
        <div />
      </DataTableComponent>
    </>
  );
}
