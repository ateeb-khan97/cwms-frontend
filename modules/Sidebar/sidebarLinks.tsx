import React from 'react';
//  icons
import { RxDashboard } from 'react-icons/rx';
import { AiOutlineUnorderedList } from 'react-icons/ai';
import { BiCategoryAlt, BiReceipt } from 'react-icons/bi';
import { CgNotes } from 'react-icons/cg';
import {
  BsBookshelf,
  BsBoxSeam,
  BsHddStackFill,
  BsListCheck,
  BsShop,
} from 'react-icons/bs';
import {
  MdNote,
  MdOutlinePrecisionManufacturing,
  MdUpload,
} from 'react-icons/md';
import { RiAddFill, RiTestTubeLine } from 'react-icons/ri';
import { FiSettings } from 'react-icons/fi';
import { HiUsers } from 'react-icons/hi';
import { FaWarehouse } from 'react-icons/fa';
import { SiBlueprint } from 'react-icons/si';
import { TbTransferIn, TbTruckDelivery } from 'react-icons/tb';
// types
type SidebarChildrenType = {
  label: string;
  icon: React.ReactNode;
  href: string;
};
type SidebarType = {
  label: string;
  icon: React.ReactNode;
  hasChildren: boolean;
  href?: string;
  children?: SidebarChildrenType[];
};
//
export const sidebarLink: SidebarType[] = [
  {
    label: 'Dashboard',
    icon: <RxDashboard />,
    hasChildren: false,
    href: '/dashboard',
  },
  {
    label: 'Products',
    icon: <BsBoxSeam />,
    hasChildren: true,
    children: [
      {
        label: 'Show Products',
        href: '/dashboard/products',
        icon: <AiOutlineUnorderedList />,
      },
      {
        label: 'Add Product',
        href: '/dashboard/products/add_product',
        icon: <RiAddFill />,
      },
    ],
  },
  {
    label: 'Categories',
    icon: <BiCategoryAlt />,
    hasChildren: true,
    children: [
      {
        label: 'Show Categories',
        href: '/dashboard/categories',
        icon: <AiOutlineUnorderedList />,
      },
      {
        label: 'Add Category',
        href: '/dashboard/categories/add_category',
        icon: <RiAddFill />,
      },
    ],
  },
  {
    label: 'Vendors',
    icon: <BsShop />,
    hasChildren: true,
    children: [
      {
        label: 'Show Vendors',
        href: '/dashboard/vendors',
        icon: <AiOutlineUnorderedList />,
      },
      {
        label: 'Add Vendor',
        href: '/dashboard/vendors/add_vendor',
        icon: <RiAddFill />,
      },
    ],
  },
  {
    label: 'Manufacturers',
    icon: <MdOutlinePrecisionManufacturing />,
    hasChildren: true,
    children: [
      {
        label: 'Show Manufacturers',
        href: '/dashboard/manufacturers',
        icon: <AiOutlineUnorderedList />,
      },
      {
        label: 'Add Manufacturer',
        href: '/dashboard/manufacturers/add_manufacturer',
        icon: <RiAddFill />,
      },
    ],
  },
  {
    label: 'Purchase Order',
    icon: <BiReceipt />,
    hasChildren: true,
    children: [
      {
        label: 'Show Purchase Order',
        href: '/dashboard/purchase_order',
        icon: <AiOutlineUnorderedList />,
      },
      {
        label: 'Add Purchase Order',
        href: '/dashboard/purchase_order/add_purchase_order',
        icon: <RiAddFill />,
      },
      {
        label: 'Create GRN',
        href: '/dashboard/purchase_order/create_grn',
        icon: <CgNotes />,
      },
      {
        label: 'Quality Check',
        href: '/dashboard/purchase_order/quality_check',
        icon: <RiTestTubeLine />,
      },
    ],
  },
  {
    label: 'Inbound',
    hasChildren: true,
    icon: <BsHddStackFill />,
    children: [
      {
        href: '/dashboard/inbound/receive_items',
        label: 'Receive Items',
        icon: <BiReceipt />,
      },
      {
        href: '/dashboard/inbound/stacking',
        label: 'Stacking',
        icon: <BsBookshelf />,
      },
      {
        href: '/dashboard/inbound/restacking',
        label: 'Restacking',
        icon: <BsBookshelf />,
      },
      {
        href: '/dashboard/inbound/demand_note',
        label: 'Demand Note',
        icon: <MdNote />,
      },
    ],
  },
  {
    label: 'Transfer',
    hasChildren: true,
    icon: <TbTruckDelivery size={20} />,
    children: [
      {
        href: '/dashboard/transfer',
        label: 'Transfer List',
        icon: <TbTransferIn />,
      },
      {
        href: '/dashboard/transfer/stock_transfer',
        label: 'Stock Transfer',
        icon: <BsBoxSeam />,
      },
      {
        href: '/dashboard/transfer/stock_receive',
        label: 'Stock Receive',
        icon: <BsListCheck />,
      },
    ],
  },
  {
    label: 'Settings',
    icon: <FiSettings />,
    hasChildren: true,
    children: [
      // {
      //   label: 'Bulk Upload',
      //   href: '/dashboard/bulk_upload',
      //   icon: <MdUpload />,
      // },
      {
        label: 'Show Users',
        href: '/dashboard/users',
        icon: <HiUsers />,
      },
      // {
      //   label: 'Create WMS',
      //   href: '/dashboard/create_wms',
      //   icon: <FaWarehouse />,
      // },
      {
        label: 'WH Structuring',
        href: '/dashboard/warehouse_structuring',
        icon: <SiBlueprint />,
      },
    ],
  },
];
//
