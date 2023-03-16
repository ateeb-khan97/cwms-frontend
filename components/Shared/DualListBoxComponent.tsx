'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import 'react-dual-listbox/lib/react-dual-listbox.css';
// import "./DualListBoxComponent.css";
const DualListBox = dynamic(() => import('react-dual-listbox'), {
  ssr: false,
});
import {
  AiOutlineDoubleLeft,
  AiOutlineDoubleRight,
  AiOutlineRight,
  AiOutlineLeft,
  AiOutlineUp,
  AiOutlineDown,
} from 'react-icons/ai';

type Props = {
  value: any;
  onChange: (val: any) => void;
  label: string;
  data: any[];
  error?: '';
};

export default function DualListBoxComponent(props: Props) {
  const [state, setState] = React.useState({
    selected: props.value,
  });
  const changeHandler = (selected: any) => {
    props.onChange(selected);
    setState({ selected });
  };
  return (
    <>
      <div className="w-[100%]">
        <label className="mantine-InputWrapper-label mantine-TextInput-label mantine-1js7218">
          {props.label}
          <span className="text-[#fa5252]"> *</span>
        </label>
        <DualListBox
          className={'dual_list_component'}
          options={props.data}
          selected={state.selected}
          onChange={changeHandler}
          canFilter
          filterCallback={(option: any, filterInput: any) => {
            if (filterInput === '') {
              return true;
            }
            return new RegExp(filterInput, 'i').test(option.label);
          }}
          filterPlaceholder="Search..."
          icons={{
            moveLeft: <AiOutlineLeft />,
            moveAllLeft: <AiOutlineDoubleLeft />,
            moveRight: <AiOutlineRight />,
            moveAllRight: <AiOutlineDoubleRight />,
            moveDown: <AiOutlineDown />,
            moveUp: <AiOutlineUp />,
          }}
        />
        <p className={`text-red-500 ${props.error != '' ? 'block' : 'hidden'}`}>
          {props.error}
        </p>
      </div>
    </>
  );
}
