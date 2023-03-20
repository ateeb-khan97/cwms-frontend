'use client';
import { Button, Select } from '@mantine/core';
import BreadcrumbComponent from 'components/Shared/BreadcrumbComponent';
import axiosFunction from 'functions/axiosFunction';
import customNotification from 'functions/customNotification';
//
import React from 'react';
import { AiOutlinePrinter } from 'react-icons/ai';
//
function Header() {
  return (
    <header className="select-none text-[#3b3e66]">
      <BreadcrumbComponent />
      <h1 className="text-3xl font-semibold ">Warehouse Structuring</h1>
      <p>Please see Warehouse Structuring below all connected channels</p>
    </header>
  );
}
//
function Form() {
  //
  const [pathId, setPathId] = React.useState<string>('');
  const [pathSideId, setPathSideId] = React.useState<string>('');
  const [sideId, setSideId] = React.useState<string>('');
  const [shelfId, setShelfId] = React.useState<string>('');
  //
  const [pathData, setPathData] = React.useState<any[]>([]);
  const [sideData, setSideData] = React.useState<any[]>([]);
  const [rackData, setRackData] = React.useState<any[]>([]);
  const [binData, setBinData] = React.useState<any[]>([]);
  //
  const pathFetcher = async () => {
    const paths = await axiosFunction({ urlPath: '/wms/path/find_all' }).then(
      (res) => res.data,
    );
    setPathData(paths);
  };
  const binFetcher = async () => {
    const bins = await axiosFunction({
      urlPath: '/wms/bin/find_all',
      method: 'POST',
      data: { shelfId },
    }).then((res) => res.data);
    setBinData(bins);
  };
  const rackFetcher = async () => {
    const racks = await axiosFunction({
      urlPath: '/wms/shelf/find_all',
      method: 'POST',
      data: { sideId },
    }).then((res) => res.data);
    setRackData(racks);
  };
  const sideFetcher = async () => {
    const sides = await axiosFunction({
      urlPath: '/wms/side/find_all',
      method: 'POST',
      data: { pathId },
    }).then((res) => res.data);
    setSideData(sides);
  };
  //
  React.useEffect(() => {
    pathFetcher();
    binFetcher();
  }, []);
  React.useEffect(() => {
    if (pathId != '') {
      sideFetcher();
      setSideId('');
    }
  }, [pathId]);
  React.useEffect(() => {
    if (sideId != '') {
      rackFetcher();
      setShelfId('');
    }
  }, [sideId]);
  React.useEffect(() => {
    if (shelfId != '') {
      binFetcher();
    }
  }, [shelfId]);
  //
  async function addPath() {
    await axiosFunction({
      urlPath: '/wms/path/add_path',
      method: 'POST',
    });
    pathFetcher();
  }
  //
  async function addSide() {
    if (pathId == '' && pathSideId == '') {
      customNotification({
        title: 'Failed',
        message: 'Path ID and Path Side ID cannot be empty!',
      });
      return;
    }
    const response = await axiosFunction({
      urlPath: '/wms/side/add_side',
      method: 'POST',
      data: {
        path_id: pathId,
        path_side_id: pathSideId,
      },
    });
    if (response.status == 501) {
      customNotification({
        title: 'Failed',
        message: 'Side already exists!',
      });
    }
    sideFetcher();
  }
  //
  const addShelf = async () => {
    if (sideId == '') {
      customNotification({
        title: 'Failed',
        message: 'Side ID cannot be empty!',
      });
      return;
    }
    await axiosFunction({
      urlPath: '/wms/shelf/add_shelf',
      method: 'POST',
      data: { side_id: sideId },
    });
    rackFetcher();
  };
  //
  const addBin = async () => {
    if (shelfId == '') {
      customNotification({
        title: 'Failed',
        message: 'Shelf ID cannot be empty!',
      });
      return;
    }
    await axiosFunction({
      urlPath: '/wms/bin/add_bin',
      method: 'POST',
      data: { rack_id: shelfId },
    });
    binFetcher();
  };
  //
  const printShelfFunction = () => {
    const data = rackData.map((each_rack) => each_rack.rack_id);
    localStorage.setItem('bar_code_value', JSON.stringify(data));
    window.open('/barcode');
  };
  const printBin = () => {
    const data = binData.map((each_bin) => each_bin.bin_id);
    localStorage.setItem('bar_code_value', JSON.stringify(data));
    window.open('/barcode');
  };
  //
  return (
    <>
      <div className="flex flex-col gap-5 p-5">
        <Button
          onClick={addPath}
          className="w-48 bg-red-500 transition-all hover:bg-red-900"
        >
          Add Path
        </Button>
        <Select
          value={pathId}
          onChange={(value: string) => {
            setPathId(value);
          }}
          className="w-[100%]"
          placeholder="Select Path"
          label="Path ID"
          size="md"
          required
          withAsterisk
          data={pathData.map((path: any) => {
            return path.path_id;
          })}
        />
        <Select
          value={pathSideId}
          onChange={(value: string) => {
            setPathSideId(value);
          }}
          className="w-[100%]"
          placeholder="Select Side ID"
          label="Path Side ID"
          size="md"
          required
          withAsterisk
          data={['R01', 'L01']}
        />
        <Button
          disabled={pathSideId == '' || pathId == ''}
          onClick={addSide}
          className="w-48 bg-red-500 transition-all hover:bg-red-900"
        >
          Add Path Side
        </Button>
        <Select
          value={sideId}
          onChange={(value: string) => setSideId(value)}
          className="w-[100%]"
          placeholder="Select Side"
          label="Side ID"
          size="md"
          required
          withAsterisk
          data={sideData.map((side) => {
            {
              return side.side_id;
            }
          })}
        />
        <div className="flex gap-5">
          <Button
            disabled={sideData.length == 0}
            onClick={addShelf}
            className="w-48 bg-red-500 transition-all hover:bg-red-900"
          >
            Add Shelf
          </Button>
          <Button
            disabled={rackData.length == 0}
            leftIcon={<AiOutlinePrinter size={20} />}
            onClick={printShelfFunction}
            className="w-48 bg-red-500 transition-all hover:bg-red-900"
          >
            Print Shelf
          </Button>
        </div>
        <Select
          value={shelfId}
          onChange={(value: string) => setShelfId(value)}
          className="w-[100%]"
          placeholder="Select Shelf"
          label="Shelf ID"
          size="md"
          required
          withAsterisk
          data={rackData.map((rack) => {
            return rack.rack_id;
          })}
        />
        <div className="flex gap-5">
          <Button
            disabled={rackData.length == 0}
            onClick={addBin}
            className="w-48 bg-red-500 transition-all hover:bg-red-900"
          >
            Add Bin
          </Button>
          <Button
            leftIcon={<AiOutlinePrinter size={20} />}
            disabled={binData.length == 0}
            onClick={printBin}
            className="w-48 bg-red-500 transition-all hover:bg-red-900"
          >
            Print Bin
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2 p-5">
        <h1 className="text-3xl font-semibold text-gray-500">Bins</h1>
        <ul className="flex flex-col gap-2">
          {binData.length > 0 &&
            binData.map((each_item) => {
              return (
                <li
                  key={each_item.id}
                  className="flex items-center gap-5 rounded border border-gray-500"
                >
                  <span className="border-r border-gray-500 p-1">Bin ID:</span>
                  <span>{each_item.bin_id}</span>
                </li>
              );
            })}
        </ul>
      </div>
    </>
  );
}
//
//
export default function WarehouseStructuringPage() {
  return (
    <section className="flex min-h-[100%]  flex-col gap-10 p-7">
      <Header />
      <div className="rounded-md border border-gray-100 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b-[1px] p-5">
          <p className="py-2 font-semibold text-gray-500">
            Here you can manage your all Stacking Process!
          </p>
        </div>
        <Form />
      </div>
    </section>
  );
}
