'use client';
import { TextInput, Button } from '@mantine/core';
import { MdSearch } from 'react-icons/md';
import { useState } from 'react';
import { searchPo } from './grnFunctions';
import customNotification from 'functions/customNotification';
import DataTableComponent from 'components/Shared/DataTableComponent';
//
//
export default function CreateGRN() {
  const [tableData, setTableData] = useState<any[]>([]);
  const [poId, setPoId] = useState<string>('');
  const [poSearching, setPoSearching] = useState<boolean>(false);
  async function searchHandler(e: React.SyntheticEvent) {
    e.preventDefault();
    setPoSearching(true);
    const response = await searchPo(Number(poId));
    setTableData(response.data);
    customNotification({
      message: response.message,
      title: response.status == 200 ? 'Success' : 'Failed',
    });
    setPoSearching(false);
  }
  //
  function inputHandler(value: string, index: number, name: string) {
    const clonedData = [...tableData];
    const ind = clonedData.findIndex((each) => each.index === index);
    clonedData[ind][name] = value;
    setTableData(clonedData);
  }
  //
  return (
    <>
      <section className="p-5">
        <form
          onSubmit={searchHandler}
          className="flex w-96 items-end justify-between gap-2"
        >
          <TextInput
            required
            value={poId}
            onChange={(e) => setPoId(e.currentTarget.value)}
            className="w-full"
            size="xs"
            label="Purchase Order ID"
            placeholder="Enter PO ID here..."
          />
          <Button
            disabled={poSearching}
            loading={poSearching}
            size="xs"
            leftIcon={<MdSearch />}
            className="btn"
            type="submit"
          >
            Search
          </Button>
        </form>
        <section>
          <DataTableComponent
            columns={[
              {
                name: 'ID',
                compact: true,
                width: '70px',
                center: true,
                cell(row, rowIndex, column, id) {
                  return row.product_id;
                },
              },
              {
                name: 'Prd. Name',
                cell(row, rowIndex, column, id) {
                  return row.product_name;
                },
              },
              {
                name: 'Rq.Qty',
                compact: true,
                width: '70px',
                center: true,
                cell(row, rowIndex, column, id) {
                  return row.required_quantity;
                },
              },
              {
                name: 'Rc.Qty',
                compact: true,
                width: '70px',
                center: true,
                cell(row, rowIndex, column, id) {
                  return (
                    <>
                      <input
                        onChange={(e) =>
                          inputHandler(
                            e.currentTarget.value,
                            row.index,
                            'received_quantity',
                          )
                        }
                        value={row.received_quantity}
                        type="text"
                        className="block h-full border outline-none"
                      />
                    </>
                  );
                },
              },
              {
                name: 'MRP',
                compact: true,
                width: '70px',
                center: true,
                cell(row, rowIndex, column, id) {
                  return (
                    <>
                      <input
                        value={row.maximum_retail_price}
                        type="text"
                        className="block h-full border outline-none"
                      />
                    </>
                  );
                },
              },
              {
                name: 'T.P',
                compact: true,
                width: '70px',
                center: true,
                cell(row, rowIndex, column, id) {
                  return (
                    <>
                      <input
                        value={row.trade_price}
                        type="text"
                        className="block h-full border outline-none"
                      />
                    </>
                  );
                },
              },
              {
                name: 'Disc.%',
                compact: true,
                width: '70px',
                center: true,
                cell(row, rowIndex, column, id) {
                  return (
                    <>
                      <input
                        value={row.discount_percentage}
                        type="text"
                        className="block h-full border outline-none"
                      />
                    </>
                  );
                },
              },
              {
                name: 'Batch.#',
                compact: true,
                width: '70px',
                center: true,
                cell(row, rowIndex, column, id) {
                  return (
                    <>
                      <input
                        value={row.batch_number}
                        type="text"
                        className="block h-full border outline-none"
                      />
                    </>
                  );
                },
              },
              {
                name: 'Batch.Exp',
                compact: true,
                width: '150px',
                center: true,
                cell(row, rowIndex, column, id) {
                  return (
                    <>
                      <input
                        value={row.batch_expiry}
                        type="date"
                        className="block h-full border outline-none"
                      />
                    </>
                  );
                },
              },
              {
                name: 'Comments',
                compact: true,
                width: '80px',
                center: true,
                cell(row, rowIndex, column, id) {
                  return (
                    <>
                      <input
                        value={row.comments}
                        type="text"
                        className="block h-full border outline-none"
                      />
                    </>
                  );
                },
              },
              {
                name: 'UOM',
                compact: true,
                width: '70px',
                center: true,
                cell(row, rowIndex, column, id) {
                  return row.uom;
                },
              },
              {
                name: 'FOC',
                compact: true,
                width: '50px',
                center: true,
                cell(row, rowIndex, column, id) {
                  return row.foc ? 'Yes' : 'No';
                },
              },
            ]}
            data={tableData}
          >
            <></>
          </DataTableComponent>
        </section>
      </section>
    </>
  );
}
