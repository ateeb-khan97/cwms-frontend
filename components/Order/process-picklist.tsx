'use client';
//
import { Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import DataTableComponent from 'components/Shared/DataTableComponent';
import axiosFunction from 'functions/axiosFunction';
import { useEffect, useState } from 'react';
//
interface PickListType {
  loc_code: string;
  loc_name: string;
  pickListDate: string;
  pickListId: number;
}
//
interface TableType {
  av: string;
  colist: string;
  comp: string;
  orderLocation: string;
  productId: string;
  req_qty: string;
}
//

export default function ProcessPickList() {
  const [orderId, setOrderId] = useState<string>('');
  const [tableData, setTableData] = useState<TableType[]>([]);
  const [active, setActive] = useState<number>(-1);
  const [pickListIds, setPickListIds] = useState<PickListType[]>([]);
  const [location, setLocation] = useState<any[]>([]);
  const form = useForm({
    initialValues: {
      pickListId: 0,
      remainingQuantity: 0,
      scanInwardChild: '',
    },
  });

  // functions
  async function getLocation() {
    const response = await axiosFunction({ urlPath: '/location/find' });
    setLocation(
      response.data.map((each) => ({
        value: each.loc_code,
        label: each.loc_name,
      })),
    );
  }
  //
  async function getPickList(locId: string | null | undefined = undefined) {
    const response = await axiosFunction({
      urlPath: '/pick-list/',
      method: 'POST',
      data: { locId },
    });
    setPickListIds(response.data);
  }
  //
  async function getOrder(pickListId: number, locationId: string) {
    form.setValues({
      pickListId: pickListId,
    });
    const response = await axiosFunction({
      urlPath: '/order/get-data-by-picklist',
      method: 'POST',
      data: { pickListId, locationId },
    });
    setOrderId(response.data[0][0].orderId);
    setTableData(response.data[1]);
  }
  //
  useEffect(() => {
    getLocation();
    getPickList();
  }, []);
  //
  return (
    <section className="flex select-none">
      <section className="flex w-1/3 flex-col gap-3 border-r px-3 py-5">
        <Select
          label="Filter"
          placeholder="Filter by location"
          size="xs"
          data={location}
          onChange={(e) => getPickList(e)}
        />
        <div className="text-center font-medium">
          <p>PickList - Date</p>
          <p>Location</p>
        </div>
        <section className="flex max-h-56 w-full flex-col overflow-y-scroll border border-gray-300 p-1 scrollbar-none">
          {pickListIds.length > 0 ? (
            pickListIds.map((each, key) => (
              <button
                onClick={() => {
                  setActive(each.pickListId);
                  getOrder(each.pickListId, each.loc_code);
                }}
                key={key}
                className={`cursor-pointer rounded-md py-1 text-center transition-all hover:bg-gray-200 ${
                  each.pickListId == active && 'bg-gray-300'
                }`}
              >
                <p>
                  {each.pickListId} - {each.pickListDate}
                </p>
                <p>{each.loc_name}</p>
              </button>
            ))
          ) : (
            <div className="rounded-md py-1 text-center">
              <p>No PickList Found!</p>
            </div>
          )}
        </section>
      </section>
      <section className="w-2/3 px-3 py-5">
        <TextInput
          label="PickList ID"
          required
          disabled
          size="xs"
          className="w-2/3"
          {...form.getInputProps('pickListId')}
        />
        <TextInput
          label="Remaining Quantity"
          required
          disabled
          size="xs"
          className="w-2/3"
          {...form.getInputProps('remainingQuantity')}
        />
        <TextInput
          label="Scan Inward Child"
          required
          size="xs"
          className="w-2/3"
          {...form.getInputProps('scanInwardChild')}
        />
        <div className="mt-3 flex gap-1">
          <span className="font-medium">Order ID :</span>
          <span>{orderId}</span>
        </div>
        <br />
        <DataTableComponent
          columns={[
            {
              name: 'Product ID',
              cell: (row: TableType) => row.productId,
              center: true,
              width: '120px',
              grow: 0,
            },
            {
              name: 'Rq. Qty',
              cell: (row: TableType) => row.req_qty,
              center: true,
              width: '120px',
              grow: 0,
            },
            {
              name: 'Bin Code (Quantity)',
              cell: (row: TableType) => (
                <div dangerouslySetInnerHTML={{ __html: row.av }} />
              ),
              grow: 1,
            },
            {
              name: 'Rem. Qty',
              cell: (row: TableType) => row.comp,
              center: true,
              width: '120px',
              grow: 0,
            },
          ]}
          data={tableData}
        />
      </section>
    </section>
  );
}
