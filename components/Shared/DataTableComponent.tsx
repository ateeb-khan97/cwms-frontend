'use client';
import React from 'react';
import DataTable from 'react-data-table-component';
import { AiOutlineSearch } from 'react-icons/ai';
import { Button, TextInput } from '@mantine/core';
import {
  PaginationChangePage,
  PaginationChangeRowsPerPage,
  SortFunction,
  TableColumn,
} from 'react-data-table-component/dist/src/DataTable/types';
import Loader from './Loader';
import { MdDownload } from 'react-icons/md';
//
const customStyles = {
  table: {
    style: {
      width: '100%',
      paddingBottom: '12px',
    },
  },
  header: {
    style: {
      minHeight: '56px',
    },
  },
  headRow: {
    style: {
      borderTopStyle: 'solid',
      borderTopWidth: '1px',
      borderTopColor: 'lightGray',
    },
  },
  headCells: {
    style: {
      fontWeight: 'bold',
      color: '#3b3e66',
      '&:not(:last-of-type)': {
        borderRightStyle: 'solid',
        borderRightWidth: '1px',
        borderRightColor: 'lightGray',
      },
    },
  },
  row: {
    style: {
      borderRightStyle: 'solid',
      borderRightWidth: '1px',
      borderRightColor: 'red',
    },
  },
  cells: {
    style: {
      '&:not(:last-of-type)': {
        borderRightStyle: 'solid',
        borderRightWidth: '1px',
        borderRightColor: 'lightGray',
      },
      '>input': {
        width: '100%',
        padding: '2px',
        fontSize: '12px',
      },
      '>div': {
        display: 'flex',
      },
    },
  },
};
//
type Props = {
  columns: TableColumn<any>[];
  data: any;
  title?: string;
  selectableRows?: boolean;
  onSelectedRowsChange?: (row: any) => void;
  onRowClick?: (row: any) => void;
  clearSelectedRows?: boolean;
  keyField?: string;
  pagination?: boolean;
  paginationServer?: boolean;
  paginationTotalRows?: number;
  onChangeRowsPerPage?: PaginationChangeRowsPerPage;
  onChangePage?: PaginationChangePage;
  progressPending?: boolean;
  desc?: boolean;
  children?: React.ReactNode;
  sortFunction?: SortFunction<any>;
  onSort?: (col: any, orderBy: 'asc' | 'desc') => void;
};
//
type FilterProps = {
  filterText: string;
  onFilter: (value: any) => void;
  title?: string;
};
//
const FilterComponent = ({ filterText, onFilter, title }: FilterProps) => (
  <>
    <TextInput
      icon={<AiOutlineSearch />}
      type="text"
      placeholder={`Search ${title ? title : ''}`}
      value={filterText}
      onChange={onFilter}
    />
  </>
);
//
const Export = ({ onExport }: { onExport: Function }) => (
  <Button
    className="aspect-square bg-transparent p-0 text-gray-400 transition hover:bg-gray-400 hover:text-white"
    onClick={(e: any) => onExport(e.target.value)}
  >
    <MdDownload size={25} />
  </Button>
);
//

const DataTableComponent = ({
  selectableRows,
  onSelectedRowsChange,
  columns,
  data,
  title,
  clearSelectedRows,
  onRowClick,
  keyField,
  onChangePage,
  onChangeRowsPerPage,
  paginationServer,
  paginationTotalRows,
  progressPending,
  desc,
  children,
  sortFunction,
  onSort,
}: Props) => {
  const [filterText, setFilterText] = React.useState('');
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const [filteredItems, setFilteredItems] = React.useState([]);
  //
  function convertArrayOfObjectsToCSV(array: any[]) {
    let result: string;

    const columnDelimiter = ',';
    const lineDelimiter = '\n';
    const keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach((item) => {
      let ctr = 0;
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter;
        result += item[key];
        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }
  //
  function downloadCSV(array: any[]) {
    const link = document.createElement('a');
    let csv = convertArrayOfObjectsToCSV(array);
    if (csv == null) return;

    const filename = 'export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', filename);
    link.click();
  }
  //

  //
  React.useEffect(() => {
    desc
      ? setFilteredItems(
          data.filter((item: any) => {
            var filterFlag = false;
            Object.keys(item).every((each_key) => {
              if (
                item[each_key] &&
                item[each_key]
                  ?.toString()
                  .toLowerCase()
                  .includes(filterText.toLowerCase())
              ) {
                filterFlag = true;
                return false;
              }
              return true;
            });
            return filterFlag;
          }),
        )
      : setFilteredItems(
          data
            .filter((item: any) => {
              var filterFlag = false;
              Object.keys(item).every((each_key) => {
                if (
                  item[each_key] &&
                  item[each_key]
                    ?.toString()
                    .toLowerCase()
                    .includes(filterText.toLowerCase())
                ) {
                  filterFlag = true;
                  return false;
                }
                return true;
              });
              return filterFlag;
            })
            .reverse(),
        );
  }, [data, filterText]);
  //
  const subHeaderComponentMemo = React.useMemo(() => {
    return (
      <section className="flex gap-5">
        {children ? (
          children
        ) : (
          <>
            <Export onExport={() => downloadCSV(data)} />
            <FilterComponent
              title={title}
              onFilter={(e: any) => {
                setFilterText(e.target.value);
              }}
              filterText={filterText}
            />
          </>
        )}
      </section>
    );
  }, [filterText, resetPaginationToggle]);
  //
  return (
    <>
      <DataTable
        onSort={onSort}
        title={title}
        columns={columns}
        data={filteredItems}
        dense
        highlightOnHover
        pointerOnHover
        keyField={keyField || 'id'}
        //@ts-ignore
        direction="auto"
        pagination
        paginationServer={paginationServer}
        paginationTotalRows={paginationTotalRows}
        onChangeRowsPerPage={onChangeRowsPerPage}
        onChangePage={onChangePage}
        paginationResetDefaultPage={resetPaginationToggle}
        responsive
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        selectableRows={selectableRows}
        onSelectedRowsChange={onSelectedRowsChange}
        //@ts-ignore
        subHeaderAlign="right"
        subHeaderWrap
        customStyles={customStyles}
        clearSelectedRows={clearSelectedRows}
        onRowClicked={onRowClick}
        progressPending={progressPending}
        sortFunction={sortFunction}
        progressComponent={
          <div className="flex h-[150px] items-center justify-center">
            <Loader />
          </div>
        }
      />
    </>
  );
};

export default DataTableComponent;
