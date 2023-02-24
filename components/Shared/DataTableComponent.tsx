'use client';

import { TextInput } from '@mantine/core';
import { AiOutlineSearch } from 'react-icons/ai';
import DataTable, { TableProps } from 'react-data-table-component';
import React from 'react';
// types
type FilterComponentType = {
  filterText: string;
  onFilter: (value: any) => void;
};
//  styles
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
// Components
function FilterComponent({ filterText, onFilter }: FilterComponentType) {
  return (
    <>
      <TextInput
        icon={<AiOutlineSearch />}
        placeholder="Search"
        value={filterText}
        onChange={onFilter}
      />
    </>
  );
}
//
export default function DataTableComponent(props: TableProps<any>) {
  // States
  const [filterText, setFilterText] = React.useState<string>('');
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState<boolean>(false);
  const [filteredItems, setFilteredItems] = React.useState<any[]>([]);
  //
  // useEffect
  React.useEffect(() => {
    setFilteredItems(
      props.data
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
  }, [filterText, resetPaginationToggle]);
  // useMemo
  const subHeaderComponentMemo = React.useMemo(() => {
    return (
      <FilterComponent
        onFilter={(e: React.BaseSyntheticEvent) => {
          setFilterText(e.target.value);
        }}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);
  //
  return (
    <DataTable
      {...props}
      title={props.title}
      columns={props.columns}
      data={filteredItems}
      dense
      highlightOnHover
      pointerOnHover
      keyField={props.keyField || 'id'}
      //@ts-ignore
      direction="auto"
      pagination
      paginationResetDefaultPage={resetPaginationToggle}
      responsive
      subHeader
      subHeaderComponent={subHeaderComponentMemo}
      selectableRows={props.selectableRows}
      onSelectedRowsChange={props.onSelectedRowsChange}
      //@ts-ignore
      subHeaderAlign="right"
      subHeaderWrap
      customStyles={customStyles}
      clearSelectedRows={props.clearSelectedRows}
      onRowClicked={props.onRowClicked}
    />
  );
}
