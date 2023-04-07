'use client';

import DataTableComponent from 'components/Shared/DataTableComponent';
import Loader from 'components/Shared/Loader';
import axiosFunction from 'functions/axiosFunction';
import moment from 'moment';
import { useEffect, useState } from 'react';
//
interface TableDataType {
  aging_time: string;
  category_name: string;
  item_conversion: string;
  loc_name: string;
  manufacturer_name: string;
  mrp_unit_price: string;
  product_id: string;
  product_name: string;
  purchasing_price: string;
  tax_code: string;
  total_inventory: string;
  total_purchasing_price: string;
  trade_price: string;
}
//
export default function StockDetailReport() {
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<TableDataType[]>([]);
  const dataFetcher = async () => {
    setLoading(true);
    const response = await axiosFunction({
      urlPath: '/inward/find_for_detail_report',
    });
    setTableData(response.data);
    setLoading(false);
  };
  useEffect(() => {
    dataFetcher();
  }, []);
  return (
    <section>
      {loading ? (
        <div className="flex h-[300px] items-center justify-center">
          <Loader />
        </div>
      ) : (
        <DataTableComponent
          data={tableData}
          columns={[
            {
              name: 'Prod.ID',
              selector: (row: TableDataType) => row.product_id,
              center: true,
              grow: 0,
              width: '80px',
            },
            {
              name: 'Product',
              selector: (row: TableDataType) => row.product_name,
            },
            {
              name: 'Manufacturer',
              selector: (row: TableDataType) => row.manufacturer_name,
            },
            {
              name: 'Category',
              selector: (row: TableDataType) => row.category_name,
            },
            {
              name: 'Loc.Name',
              selector: (row: TableDataType) => row.loc_name,
              center: true,
              grow: 0,
              width: '150px',
            },
            {
              name: 'Inventory',
              selector: (row: TableDataType) => row.total_inventory,
              center: true,
              grow: 0,
              width: '100px',
            },
            {
              name: 'Pur.Price',
              selector: (row: TableDataType) => row.purchasing_price,
              center: true,
              grow: 0,
              width: '100px',
            },
            {
              name: 'Tot Pur.Price',
              selector: (row: TableDataType) => row.total_purchasing_price,
              center: true,
              grow: 0,
              width: '100px',
            },
            {
              name: 'Tax Code',
              selector: (row: TableDataType) =>
                row.tax_code ? row.tax_code : '-',
              center: true,
              grow: 0,
              width: '100px',
            },
            {
              name: 'T.P',
              selector: (row: TableDataType) =>
                row.trade_price ? row.trade_price : '-',
              center: true,
              grow: 0,
              width: '80px',
            },
            {
              name: 'MRP',
              selector: (row: TableDataType) =>
                row.mrp_unit_price ? row.mrp_unit_price : '-',
              center: true,
              grow: 0,
              width: '80px',
            },
            {
              name: 'Aging',
              selector: (row: TableDataType) => {
                const mom = moment(row.aging_time);
                return row.aging_time
                  ? mom.format('DD-MM-YYYY | HH:mm:ss')
                  : '-';
              },
              center: true,
              grow: 0,
              width: '170px',
            },
          ]}
        />
      )}
    </section>
  );
}
