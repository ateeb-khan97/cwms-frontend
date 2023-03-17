'use client';
import React from 'react';
import DataTable from 'react-data-table-component';
import { AiOutlineSearch } from 'react-icons/ai';
import { TextInput } from '@mantine/core';
import {
  PaginationChangePage,
  PaginationChangeRowsPerPage,
} from 'react-data-table-component/dist/src/DataTable/types';
import Loader from './Loader';
//
const customStyles = {
  table: {
    style: {
      width: '100%',
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
  columns: any;
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
}: Props) => {
  const [filterText, setFilterText] = React.useState('');
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const [filteredItems, setFilteredItems] = React.useState([]);
  //
  React.useEffect(() => {
    setFilteredItems(
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
      <FilterComponent
        title={title}
        onFilter={(e: any) => {
          setFilterText(e.target.value);
        }}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);
  //
  return (
    <DataTable
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
      progressComponent={
        <div className="flex h-[150px] items-center justify-center">
          <Loader />
        </div>
      }
    />
  );
};

export default DataTableComponent;
