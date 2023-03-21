'use client';

import { Button, TextInput } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
import DataTableComponent from 'components/Shared/DataTableComponent';
import axiosFunction from 'functions/axiosFunction';
import customNotification from 'functions/customNotification';
import usePurchaseOrderData from 'modules/PurchaseOrder/usePurchaseOrder';
import React from 'react';
import { AiOutlineSearch } from 'react-icons/ai';

//
function Header() {
  return (
    <header className="select-none text-[#3b3e66]">
      <BreadcrumbComponent />
      <h1 className="text-3xl font-semibold ">Create GRN</h1>
      <p>Please see Create GRN below all connected channels</p>
    </header>
  );
}
//
function Form({ setTableData }: { setTableData: Function }) {
  const purchaseOrderIdRef = React.useRef<HTMLInputElement>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  async function submitHandler(e: React.SyntheticEvent) {
    e.preventDefault();
    var searched_purchase_order: any = {};
    var searched_grn_purchase_order: any[] = [];
    //
    setLoading(true);
    const po_id = purchaseOrderIdRef.current?.value;
    const response = await axiosFunction({
      urlPath: '/purchase_order/find_for_grn',
      method: 'POST',
      data: { id: po_id },
    });
    //
    if (response.data.length == 0) {
      setTableData([]);
      setLoading(false);
      return customNotification({ message: response.message, title: 'Failed' });
    }
    searched_purchase_order = response.data[0];
    //
    const grn_data = await axiosFunction({
      urlPath: '/grn/find_by_id',
      method: 'POST',
      data: { id: po_id },
    }).then((res) => res.data); //
    setLoading(false);
    //
    var isGrn = false;
    if (grn_data.length > 0) isGrn = true;
    //
    if (!isGrn) {
      if (searched_purchase_order.purchase_order_detail.length > 0) {
        var order_detail_temp: any[] = [];
        var index = 0;
        searched_purchase_order.purchase_order_detail.forEach(
          (each_detail: any) => {
            order_detail_temp.push({
              ...each_detail,
              index: index++,
              received_quantity: each_detail.required_quantity,
              discount_percentage: each_detail.trade_discount_percentage,
              maximum_retail_price: 0,
              batch_number: '',
              batch_expiry: new Date(),
              comments: '',
            });
          },
        );
        setTableData(order_detail_temp);
      }
      return;
    }
    if (isGrn) {
      var index = 0;
      searched_grn_purchase_order = [];
      grn_data.forEach((each_grn: any) => {
        if (each_grn.is_updatable) {
          searched_grn_purchase_order.push({
            ...each_grn,
            index: index++,
            batch_expiry: new Date(each_grn.batch_expiry),
            required_quantity: each_grn.remaining_quantity,
            received_quantity: each_grn.remaining_quantity,
          });
        }
      });
    }
    if (searched_grn_purchase_order.length == 0) {
      customNotification({
        message: `Purchase Order is waiting for QC Check!`,
        title: 'Failed',
      });
    }
    //
    setTableData(searched_grn_purchase_order);
    setLoading(false);
  }
  //
  return (
    <>
      <section>
        <form className="flex items-end gap-5 p-5" onSubmit={submitHandler}>
          <TextInput
            className="w-96"
            ref={purchaseOrderIdRef}
            label="Purchase Order ID"
            placeholder="Enter Purchase Order ID to Search"
            required
          />
          <Button
            loading={loading}
            type={'submit'}
            className="bg-red-500 transition-all hover:scale-110 hover:bg-red-900"
            leftIcon={<AiOutlineSearch />}
          >
            Search
          </Button>
        </form>
      </section>
    </>
  );
}
//
function Table({
  tableData,
  setTableData,
}: {
  tableData: any[];
  setTableData: Function;
}) {
  //
  const { setPurchaseOrderData } = usePurchaseOrderData();
  type InputPropType = 'number' | 'double';
  const tableInputHandler = (
    index: number,
    name: string,
    value: any,
    type?: InputPropType,
  ) => {
    var data_temp = [...tableData];

    data_temp[index] = { ...data_temp[index], [name]: value };
    setTableData(data_temp);
    return;
  };
  //
  const submitHandler = async () => {
    const mrp_check = tableData.filter((each_data: any) => {
      return (
        each_data.maximum_retail_price == '' || each_data.trade_price == ''
      );
    });
    if (mrp_check.length > 0) {
      return customNotification({
        title: 'Failed',
        message: 'MRP and Trade Price cannot be zero or empty!',
      });
    }
    //
    const response = await axiosFunction({
      urlPath: '/grn/create/',
      method: 'POST',
      data: {
        po_id: tableData[0].po_id,
        grn_data: tableData,
      },
    });

    //
    var message = response.message;
    if (response.status == 200) {
      message = 'GRN Created/Updated Successfully!';
    }
    customNotification({
      message,
      title: response.status == 200 ? 'Success' : 'Failed',
    });
    setTableData([]);
    setPurchaseOrderData([]);
    //
  };
  //
  return (
    <section>
      <DataTableComponent
        data={tableData}
        columns={[
          {
            name: 'ID',
            selector: (row: any) => row.product_id,
            grow: 0,
            center: true,
            width: '66px',
          },
          {
            name: 'Product Name',
            selector: (row: any) => row.product_name,
            grow: 1,
            sortable: true,
          },
          {
            name: 'Req Quantity',
            selector: (row: any) => row.required_quantity,
            grow: 0,
            center: true,
            width: '120px',
          },
          {
            name: 'UOM',
            selector: (row: any) => row.uom,
            grow: 0,
            center: true,
            width: '100px',
          },
          {
            name: 'Rec Quantity',
            cell: (row: any) => (
              <>
                <TextInput
                  size="xs"
                  type="text"
                  value={row.received_quantity}
                  onChange={(e: any) => {
                    tableInputHandler(
                      row.index,
                      'received_quantity',
                      e.target.value,
                      'number',
                    );
                  }}
                />
              </>
            ),
            center: true,
            width: '120px',
          },
          {
            name: 'MRP',
            cell: (row: any) => (
              <>
                <TextInput
                  size="xs"
                  type="text"
                  value={row.maximum_retail_price}
                  onChange={(e: any) => {
                    tableInputHandler(
                      row.index,
                      'maximum_retail_price',
                      e.target.value,
                      'double',
                    );
                  }}
                />
              </>
            ),
            center: true,
            width: '120px',
          },
          {
            name: 'Trade Price',
            cell: (row: any) => (
              <>
                <TextInput
                  size="xs"
                  type="text"
                  value={row.trade_price}
                  onChange={(e: any) => {
                    tableInputHandler(
                      row.index,
                      'trade_price',
                      e.target.value,
                      'double',
                    );
                  }}
                />
              </>
            ),
            center: true,
            width: '120px',
          },
          {
            name: 'Discount %',
            cell: (row: any) => (
              <>
                <TextInput
                  size="xs"
                  type="text"
                  value={row.discount_percentage}
                  onChange={(e: any) => {
                    tableInputHandler(
                      row.index,
                      'discount_percentage',
                      e.target.value,
                      'number',
                    );
                  }}
                />
              </>
            ),
            center: true,
            width: '120px',
          },
          {
            name: 'Batch No.',
            cell: (row: any) => (
              <>
                <TextInput
                  size="xs"
                  type="text"
                  value={row.batch_number}
                  onChange={(e: any) => {
                    tableInputHandler(
                      row.index,
                      'batch_number',
                      e.target.value,
                    );
                  }}
                />
              </>
            ),
            center: true,
            width: '120px',
          },

          {
            name: 'Batch Expiry',
            cell: (row: any) => (
              <>
                <DatePicker
                  className="table_date_picker"
                  size="xs"
                  value={new Date(row.batch_expiry)}
                  onChange={(e: any) => {
                    tableInputHandler(row.index, 'batch_expiry', e);
                  }}
                />
              </>
            ),
            center: true,
            width: '120px',
          },
          {
            name: 'Comments',
            cell: (row: any) => (
              <>
                <TextInput
                  size="xs"
                  type="text"
                  value={row.comments}
                  onChange={(e: any) => {
                    tableInputHandler(row.index, 'comments', e.target.value);
                  }}
                />
              </>
            ),
            center: true,
            width: '120px',
          },
          {
            name: 'FOC',
            selector: (row: any) => (row.foc ? 'Yes' : 'No'),
            grow: 0,
            center: true,
            width: '70px',
          },
        ]}
      />
      <div className="flex w-[100%] justify-end p-5">
        <Button
          disabled={tableData.length == 0}
          className="bg-red-500 transition-all hover:scale-110 hover:bg-red-900"
          onClick={submitHandler}
        >
          Submit
        </Button>
      </div>
    </section>
  );
}
//
export default function CreateGrnPage() {
  const [tableData, setTableData] = React.useState<any[]>([]);
  return (
    <section className="flex min-h-[100%] flex-col gap-10 p-7">
      <Header />
      <div className="rounded-md border border-gray-100 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b-[1px] p-5">
          <p className="py-2 font-semibold text-gray-500">
            Here you can manage your all GRN!
          </p>
        </div>
        <Form setTableData={setTableData} />
        <Table tableData={tableData} setTableData={setTableData} />
      </div>
    </section>
  );
}
