'use client';

import { Button, Select, TextInput } from '@mantine/core';
import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
import DataTableComponent from 'components/Shared/DataTableComponent';
import Loader from 'components/Shared/Loader';
import axiosFunction from 'functions/axiosFunction';
import customNotification from 'functions/customNotification';
import { ReceiveType } from 'modules/Inbound/receiveType';
import { BsPrinter } from 'react-icons/bs';
import { modals } from '@mantine/modals';
import { useEffect, useRef, useState } from 'react';
import { MdDownload, MdSearch } from 'react-icons/md';
import { useRouter, useSearchParams } from 'next/navigation';
import Search from 'app/dashboard/report/sku-child-report/Search';
import { saveAs } from 'file-saver';
//
function Header() {
  return (
    <header className="select-none text-[#3b3e66]">
      <BreadcrumbComponent />
      <h1 className="text-3xl font-semibold ">Receive Items</h1>
      <p>Please see Receive Items below all connected channels</p>
    </header>
  );
}

//
function Table({
  isLoading,
  btnDisable,
  tableData,
  totalRows,
  downloadHandler,
}: {
  isLoading: boolean;
  btnDisable: boolean;
  tableData: any[];
  totalRows: number;
  downloadHandler: () => void;
}) {
  const router = useRouter();
  //
  async function receiveHandler(id: number) {
    const response = await axiosFunction({
      urlPath: '/inward/create_child',
      method: 'POST',
      data: { id },
    }).then((res) => {
      return res;
    });
    const message = response.status == 200 ? 'Success' : 'Failed';
    customNotification({
      message: 'Success',
      title: message,
    });
  }
  //
  const qrGenerateFunction = async (row: ReceiveType) => {
    const inward_id = row.inward_id;
    const inward_child = await axiosFunction({
      urlPath: '/inward/find_child',
      method: 'POST',
      data: { inward_id },
    }).then((res) => res.data);
    localStorage.setItem('bar_code_value', JSON.stringify(inward_child));
    window.open('/barcode');
  };
  //
  const poIdRef = useRef<HTMLInputElement>(null);
  function printHandler(e: React.SyntheticEvent) {
    e.preventDefault();
    const id = poIdRef.current?.value;
    window.open('/invoice/grn-invoice/' + id);
    modals.closeAll();
  }
  const openPrintModal = () => {
    modals.open({
      id: 'good-receive-modal',
      title: 'Print Good Receive',
      centered: true,
      children: (
        <>
          <form onSubmit={printHandler} className="flex items-center gap-5">
            <TextInput
              placeholder="Enter PO ID"
              required
              autoFocus
              maxLength={4}
              minLength={4}
              ref={poIdRef}
              className="w-full"
              size="xs"
              pattern="[0-9]+"
            />
            <Button
              compact
              type="submit"
              className="bg-red-500 hover:bg-red-900"
            >
              Print
            </Button>
          </form>
        </>
      ),
    });
    setTimeout(() => {
      poIdRef.current?.focus();
    }, 100);
  };

  //
  return (
    <section>
      <Button
        onClick={openPrintModal}
        leftIcon={<BsPrinter />}
        className="mb-2 ml-auto mr-5 mt-5 block bg-red-500 hover:bg-red-900"
      >
        Print
      </Button>
      <DataTableComponent
        progressPending={isLoading}
        paginationServer={true}
        paginationTotalRows={totalRows}
        onSort={(col, orderBy) => {
          console.log({
            [col]: orderBy,
          });
        }}
        onChangeRowsPerPage={(currentRowsPerPage, currentPage) => {
          const searchParams = new URLSearchParams(window.location.search);
          if (searchParams.has('currentRowsPerPage')) {
            searchParams.set(
              'currentRowsPerPage',
              currentRowsPerPage.toString(),
            );
          } else {
            searchParams.append(
              'currentRowsPerPage',
              currentRowsPerPage.toString(),
            );
          }
          if (searchParams.has('currentPage')) {
            searchParams.set('currentPage', currentPage.toString());
          } else {
            searchParams.append('currentPage', currentPage.toString());
          }
          const updatedQueryString = searchParams.toString();
          const url = `${window.location.pathname}?${updatedQueryString}`;
          router.push(url);
        }}
        onChangePage={(page, totalRows) => {
          const searchParams = new URLSearchParams(window.location.search);
          if (searchParams.has('page')) {
            searchParams.set('page', page.toString());
          } else {
            searchParams.append('page', page.toString());
          }
          if (searchParams.has('totalRows')) {
            searchParams.set('totalRows', totalRows.toString());
          } else {
            searchParams.append('totalRows', totalRows.toString());
          }
          const updatedQueryString = searchParams.toString();
          const url = `${window.location.pathname}?${updatedQueryString}`;
          router.push(url);
        }}
        data={tableData}
        columns={[
          {
            name: 'PO. ID',
            selector: (row: ReceiveType) => row.po_id,
            grow: 0,
            center: true,
            width: '70px',
          },
          {
            name: 'Prod. ID',
            selector: (row: ReceiveType) => row.product_id,
            grow: 0,
            center: true,
            width: '70px',
          },
          {
            name: 'Prod. Name',
            selector: (row: ReceiveType) => row.product_name,
            grow: 1,
          },
          {
            name: 'Rec. Qty',
            selector: (row: ReceiveType) => row.received_quantity,
            grow: 0,
            center: true,
            width: '80px',
          },
          {
            name: 'MRP',
            selector: (row: ReceiveType) => row.maximum_retail_price,
            grow: 0,
            center: true,
            width: '80px',
          },
          {
            name: 'T. P.',
            selector: (row: ReceiveType) => row.trade_price,
            grow: 0,
            center: true,
            width: '80px',
          },
          {
            name: 'Disc. %',
            selector: (row: ReceiveType) => row.discount_percentage,
            grow: 0,
            center: true,
            width: '80px',
          },
          {
            name: 'Batch. No.',
            selector: (row: ReceiveType) =>
              row.batch_number ? row.batch_number : '-',
            grow: 0,
            center: true,
          },
          {
            name: 'Batch. Exp.',
            selector: (row: ReceiveType) =>
              row.batch_expiry?.substring(0, 10) || '-',
            grow: 0,
            center: true,
          },
          {
            name: 'FOC',
            selector: (row: ReceiveType) => (row.foc ? 'Yes' : 'No'),
            grow: 0,
            center: true,
            width: '70px',
          },
          {
            name: 'Inward Date',
            center: true,
            grow: 0,
            cell: (row: ReceiveType) =>
              row.inward_date?.toString()?.substring(0, 10) || '-',
          },
          {
            name: 'User ID',
            center: true,
            grow: 0,
            cell: (row: ReceiveType) => row.user_id || '-',
          },
          {
            name: 'User Name',
            center: true,
            grow: 0,
            cell: (row: ReceiveType) => row.user_name || '-',
          },
          {
            name: 'Actions',
            cell: (row: ReceiveType) => (
              <>
                {row.inward_id == null ? (
                  <Button
                    className="bg-red-500 transition-all hover:bg-red-900"
                    compact
                    onClick={() => receiveHandler(row.id)}
                  >
                    Receive
                  </Button>
                ) : (
                  <>{row.inward_id}</>
                )}
              </>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            center: true,
            width: '150px',
            grow: 0,
          },
          {
            name: 'Barcode',
            cell: (row: ReceiveType) => (
              <>
                <Button
                  onClick={() => qrGenerateFunction(row)}
                  disabled={row.inward_id == null}
                  className="bg-red-500 transition-all hover:bg-red-900"
                  compact
                >
                  QR Gen.
                </Button>
              </>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            center: true,
            width: '100px',
            grow: 0,
          },
        ]}
      >
        <div className="flex w-full items-center justify-between ">
          <Select
            data={['Received', 'Not-Received']}
            placeholder="Filter"
            size="xs"
            onChange={(e) => {
              const searchParams = new URLSearchParams(window.location.search);
              if (searchParams.has('filter')) {
                searchParams.set('filter', e!);
              } else {
                searchParams.append('filter', e!);
              }
              const updatedQueryString = searchParams.toString();
              const url = `${window.location.pathname}?${updatedQueryString}`;
              router.push(url);
            }}
          />
          <div className="flex items-center gap-5">
            <Button
              loading={btnDisable}
              disabled={btnDisable}
              onClick={downloadHandler}
              size="xs"
              className="btn"
              leftIcon={<MdDownload />}
            >
              Download
            </Button>
            <Search />
          </div>
        </div>
      </DataTableComponent>
    </section>
  );
}
//
interface IPropType {
  getTableData: () => Promise<any[]>;
  getDownloadData: () => Promise<any[]>;
  getCount: () => Promise<number>;
}
//
export default function ReceiveItemsPage({
  getCount,
  getTableData,
  getDownloadData,
}: IPropType) {
  //
  const [totalRows, setTotalRows] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [btnDisable, setBtnDisable] = useState<boolean>(false);
  const [tableData, setTableData] = useState<any[]>([]);
  const search = useSearchParams();
  async function dataSetter() {
    setIsLoading(true);
    setTotalRows(await getCount());
    setTableData(await getTableData());
    setIsLoading(false);
  }
  //
  const downloadHandler = async () => {
    setBtnDisable(true);
    const downloadData = await getDownloadData();
    const csvData = [
      Object.keys(downloadData[0]).join(','),
      ...downloadData.map((item) => Object.values(item).join(',')),
    ].join('\n');

    // Create a Blob containing the CSV data
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });

    // Trigger the download using the file-saver library
    saveAs(blob, 'receive-items.csv');
    setBtnDisable(false);
  };
  //
  useEffect(() => {
    dataSetter();
  }, [
    search.get('page'),
    search.get('search'),
    search.get('currentRowsPerPage'),
    search.get('filter'),
  ]);
  //
  return (
    <>
      <section className="flex min-h-[100%] flex-col gap-10 p-7">
        <Header />
        <div className="rounded-md border border-gray-100 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b-[1px] p-5">
            <p className="py-2 font-semibold text-gray-500">
              Here you can manage your all Receive Items!
            </p>
          </div>

          <Table
            isLoading={isLoading}
            btnDisable={btnDisable}
            downloadHandler={downloadHandler}
            totalRows={totalRows}
            tableData={tableData}
          />
        </div>
      </section>
    </>
  );
}
