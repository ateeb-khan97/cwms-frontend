'use client';

import { Button, Skeleton, TextInput } from '@mantine/core';
import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
import DataTableComponent from 'components/Shared/DataTableComponent';
import Loader from 'components/Shared/Loader';
import axiosFunction from 'functions/axiosFunction';
import customNotification from 'functions/customNotification';
import { ReceiveType } from 'modules/Inbound/receiveType';
import useReceiveData from 'modules/Inbound/useReceivedData';
import { BsPrinter } from 'react-icons/bs';
import { modals } from '@mantine/modals';
import { useEffect, useRef, useState } from 'react';
import { MdDownload, MdSearch } from 'react-icons/md';
import { useRouter, useSearchParams } from 'next/navigation';
import Search from 'app/dashboard/report/sku-child-report/Search';
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
const TableHeadComponent = ({
  filterFunction,
}: {
  filterFunction: (e: string) => void;
}) => {
  const [search, setSearch] = useState<string>('');
  return (
    <>
      <div className="flex items-center gap-5">
        <Button
          onClick={async () => {
            await axiosFunction({
              urlPath: '/inward/receive-inward-download/',
              responseType: 'blob',
            }).then((response: any) => {
              console.log(response);

              const url = window.URL.createObjectURL(new Blob([response]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', 'inward-receive-report.csv');
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            });
          }}
          className="bg-red-500 transition-all hover:bg-red-900"
          leftIcon={<MdDownload />}
        >
          Download
        </Button>
        <TextInput
          icon={<MdSearch />}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            filterFunction(e.target.value);
          }}
          placeholder="Search"
          className="w-56"
        />
      </div>
    </>
  );
};
//
function Table({
  tableData,
  totalRows,
}: {
  tableData: any[];
  totalRows: number;
}) {
  const router = useRouter();
  //
  async function receiveHandler(id: number) {
    const response = await axiosFunction({
      urlPath: '/inward/create_child',
      method: 'POST',
      data: { id },
    }).then((res) => {
      router.refresh();
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
        paginationServer={true}
        paginationTotalRows={totalRows}
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
          router.refresh();
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
          router.refresh();
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
        <div className="flex items-center justify-end gap-5">
          <Button
            // onClick={downloadHandler}
            size="xs"
            className="btn"
            leftIcon={<MdDownload />}
          >
            Download
          </Button>
          <Search />
        </div>
      </DataTableComponent>
    </section>
  );
}
//
interface IPropType {
  getTableData: () => Promise<any[]>;
  getCount: () => Promise<number>;
}
//
export default function ReceiveItemsPage({
  getCount,
  getTableData,
}: IPropType) {
  //
  const [totalRows, setTotalRows] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<any[]>([]);
  const search = useSearchParams();
  async function dataSetter() {
    setTotalRows(await getCount());
    setTableData(await getTableData());
  }
  useEffect(() => {
    setIsLoading(true);
    dataSetter();
    setIsLoading(false);
  }, [
    search.get('page'),
    search.get('search'),
    search.get('currentRowsPerPage'),
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
          {isLoading ? (
            <div className="flex h-56 w-full scale-[0.5] items-center justify-center">
              <Loader />
            </div>
          ) : (
            <Table totalRows={totalRows} tableData={tableData} />
          )}
        </div>
      </section>
    </>
  );
}
