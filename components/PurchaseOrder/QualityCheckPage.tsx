'use client';

import { Button, Skeleton, TextInput } from '@mantine/core';
import { modals } from '@mantine/modals';
import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
import DataTableComponent from 'components/Shared/DataTableComponent';
import axiosFunction from 'functions/axiosFunction';
import customNotification from 'functions/customNotification';
import React, { useEffect, useRef, useState } from 'react';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { MdFileDownload } from 'react-icons/md';
import { AiOutlineSearch } from 'react-icons/ai';
//
type FilterProps = {
  value: string;
  setValue: (value: string) => void;
  downloadHandler: () => void;
  filterFunction: (value: string) => void;
};
const FilterComponent = ({
  setValue,
  value,
  downloadHandler,
  filterFunction,
}: FilterProps) => {
  return (
    <div className="flex gap-5">
      <Button
        onClick={downloadHandler}
        rightIcon={<MdFileDownload />}
        className="bg-red-500 transition-all hover:bg-red-900"
      >
        Download
      </Button>
      <TextInput
        icon={<AiOutlineSearch />}
        type="text"
        placeholder={`Search`}
        defaultValue={value}
        onChange={(event) => {
          filterFunction(event.currentTarget.value);
          setValue(event.currentTarget.value);
        }}
      />
    </div>
  );
};
//
//
function Header() {
  return (
    <header className="select-none text-[#3b3e66]">
      <BreadcrumbComponent />
      <h1 className="text-3xl font-semibold ">Quality Check</h1>
      <p>Please see Quality Check below from all connected channels</p>
    </header>
  );
}
function Table({
  downloadHandler,
  grnData,
  dataSetter,
}: {
  downloadHandler: () => void;
  grnData: any[];
  dataSetter: () => void;
}) {
  const commentRef = useRef<HTMLInputElement>(null);
  const [btnDisable, setBtnDisable] = React.useState<boolean>(false);
  const [tableData, setTableData] = useState<any[]>(grnData);
  const [search, setSearch] = useState<string>('');
  const filterFunction = (search: string) => {
    search = search.toLowerCase();
    const filteredData = grnData.filter((each) => {
      for (let key in each) {
        if (
          each[key as keyof any]?.toString()?.toLowerCase()?.includes(search)
        ) {
          return true;
        }
      }
      return false;
    });
    setTableData(filteredData);
  };
  //
  // functions
  const actionHandler = async (row: any, status: boolean) => {
    setBtnDisable(true);
    var url = status ? '/grn/approve/' : '/grn/reject/';
    //
    await axiosFunction({
      method: 'POST',
      urlPath: url,
      data: { ...row, reject_comment: commentRef.current?.value },
    });
    //
    customNotification({
      message: status ? 'Successfully Approved!' : 'Successfully Rejected!',
    });
    setBtnDisable(false);
    dataSetter();
  };
  //
  function RejectSubmit(row: any) {
    actionHandler(row, false);
    modals.closeAll();
  }
  const openRejectModal = (row: any) => {
    modals.open({
      id: 'good-receive-modal',
      title: 'Enter Comment',
      centered: true,
      children: (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              RejectSubmit(row);
            }}
            className="flex items-center gap-5"
          >
            <TextInput
              placeholder="Enter Comment..."
              required
              autoFocus
              ref={commentRef}
              className="w-full"
              size="xs"
            />
            <Button
              compact
              type="submit"
              className="bg-red-500 hover:bg-red-900"
            >
              Reject
            </Button>
          </form>
        </>
      ),
    });
    setTimeout(() => {
      commentRef.current?.focus();
    }, 100);
  };
  //
  return (
    <>
      <DataTableComponent
        data={tableData}
        columns={[
          {
            name: 'PO. ID',
            selector: (row: any) => row.po_id,
            grow: 0,
            center: true,
            width: '70px',
          },
          {
            name: 'Prod. ID',
            selector: (row: any) => row.product_id,
            grow: 0,
            center: true,
            width: '80px',
          },
          {
            name: 'Product Name',
            selector: (row: any) => row.product_name,
            grow: 2,
            sortable: true,
          },
          {
            name: 'UOM',
            selector: (row: any) => row.uom,
            grow: 0,
            center: true,
            width: '80px',
          },
          {
            name: 'Req. Qty',
            selector: (row: any) => row.required_quantity,
            grow: 0,
            center: true,
            width: '100px',
          },
          {
            name: 'Rec. Qty',
            selector: (row: any) => row.received_quantity,
            grow: 0,
            center: true,
            width: '100px',
          },
          {
            name: 'MRP.',
            selector: (row: any) => row.maximum_retail_price,
            grow: 0,
            center: true,
            width: '100px',
          },
          {
            name: 'T.P',
            selector: (row: any) => row.trade_price,
            grow: 0,
            center: true,
            width: '100px',
          },
          {
            name: 'Disc %',
            selector: (row: any) => row.discount_percentage,
            grow: 0,
            center: true,
            width: '100px',
          },
          {
            name: 'Batch No.',
            selector: (row: any) => (row.batch_number ? row.batch_number : '-'),
            grow: 0,
            center: true,
            width: '100px',
          },
          {
            name: 'Batch Expiry',
            selector: (row: any) => row.batch_expiry,
            grow: 0,
            center: true,
            width: '120px',
          },

          {
            name: 'Comments',
            selector: (row: any) => (row.comments ? row.comments : '-'),
            grow: 0,
            center: true,
            width: '100px',
          },
          {
            name: 'FOC',
            selector: (row: any) => (row.foc ? 'Yes' : 'No'),
            grow: 0,
            center: true,
            width: '100px',
          },
          {
            cell: (row: any) => (
              <>
                <Button
                  disabled={btnDisable}
                  className="bg-green-500 transition-all hover:bg-green-900"
                  radius={'xs'}
                  color={'green'}
                  compact
                  onClick={() => actionHandler(row, true)}
                >
                  Approve
                </Button>
              </>
            ),

            grow: 0,
            button: true,
            center: true,
            width: '100px',
          },
          {
            cell: (row: any) => (
              <>
                <Button
                  disabled={btnDisable}
                  className="bg-red-500 transition-all hover:bg-red-900"
                  radius={'xs'}
                  color={'red'}
                  compact
                  onClick={() => openRejectModal(row)}
                >
                  Reject
                </Button>
              </>
            ),
            grow: 0,
            button: true,
            center: true,
            width: '100px',
          },
        ]}
      >
        <FilterComponent
          downloadHandler={downloadHandler}
          filterFunction={filterFunction}
          setValue={setSearch}
          value={search}
        />
      </DataTableComponent>
    </>
  );
}
//
interface IProp {
  getDownloadData: () => Promise<any[]>;
}
//
export default function QualityCheckPage({ getDownloadData }: IProp) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  //
  async function dataSetter() {
    setIsLoading(true);
    const temp = await getDownloadData();
    console.log(temp);

    setData(temp);
    setIsLoading(false);
  }
  async function downloadHandler() {
    const csvData = Papa.unparse(data);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'qc_approve.csv');
  }
  //
  useEffect(() => {
    dataSetter();
  }, []);
  //
  return (
    <section className="flex min-h-[100%] flex-col gap-10 p-7">
      <Header />
      <div className="rounded-md border border-gray-100 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b-[1px] p-5">
          <p className="py-2 font-semibold text-gray-500">
            Here you can manage your all quality checks!
          </p>
        </div>
        {isLoading ? (
          <div className="w-full p-5">
            <Skeleton height={8} radius="xl" />
            <Skeleton height={8} mt={6} radius="xl" />
            <Skeleton height={8} mt={6} width="70%" radius="xl" />
          </div>
        ) : (
          <Table
            grnData={data}
            downloadHandler={downloadHandler}
            dataSetter={dataSetter}
          />
        )}
      </div>
    </section>
  );
}
