'use client';

import DataTableComponent from 'components/Shared/DataTableComponent';
import moment from 'moment';
//
type TableType = {
  product_id: string;
  batch_number: string;
  manufacturer_name: string;
  category_name: string;
  product_name: string;
  item_conversion: string;
  total_inventory: string;
  loc_name: string;
  purchasing_price: string;
  total_purchasing_price: string;
  trade_price: string;
  mrp_unit_price: string;
  tax_code: string;
  aging_time: string;
};
//

//
export default function StockBatchReport({
  tableData,
}: {
  tableData: TableType[];
}) {
  return (
    <>
      <DataTableComponent
        columns={[
          {
            name: 'Prod.ID',
            selector: (row: TableType) => row.product_id,
            center: true,
            grow: 0,
            width: '80px',
          },
          {
            name: 'Product',
            selector: (row: TableType) => row.product_name,
          },
          {
            name: 'Manufacturer',
            selector: (row: TableType) => row.manufacturer_name,
          },
          {
            name: 'Category',
            selector: (row: TableType) => row.category_name,
          },
          {
            name: 'Batch No',
            cell: (row: TableType) => row.batch_number,
            grow: 0,
            center: true,
          },
          {
            name: 'Loc.Name',
            selector: (row: TableType) => row.loc_name,
            center: true,
            grow: 0,
            width: '150px',
          },
          {
            name: 'Inventory',
            selector: (row: TableType) => row.total_inventory,
            center: true,
            grow: 0,
            width: '100px',
          },
          {
            name: 'Pur.Price',
            selector: (row: TableType) => row.purchasing_price,
            center: true,
            grow: 0,
            width: '100px',
          },
          {
            name: 'Tot Pur.Price',
            selector: (row: TableType) => row.total_purchasing_price,
            center: true,
            grow: 0,
            width: '100px',
          },
          {
            name: 'Tax Code',
            selector: (row: TableType) => (row.tax_code ? row.tax_code : '-'),
            center: true,
            grow: 0,
            width: '100px',
          },
          {
            name: 'T.P',
            selector: (row: TableType) =>
              row.trade_price ? row.trade_price : '-',
            center: true,
            grow: 0,
            width: '80px',
          },
          {
            name: 'MRP',
            selector: (row: TableType) =>
              row.mrp_unit_price ? row.mrp_unit_price : '-',
            center: true,
            grow: 0,
            width: '80px',
          },
          {
            name: 'Aging',
            selector: (row: TableType) => {
              const mom = moment(row.aging_time);
              return row.aging_time ? mom.format('DD-MM-YYYY | HH:mm:ss') : '-';
            },
            center: true,
            grow: 0,
            width: '170px',
          },
        ]}
        data={tableData}
      />
    </>
  );
}
