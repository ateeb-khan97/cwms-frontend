import React from 'react';
//  icons
import { RxDashboard } from 'react-icons/rx';
import { AiOutlineStock, AiOutlineUnorderedList } from 'react-icons/ai';
import { BiCategoryAlt, BiDetail, BiReceipt } from 'react-icons/bi';
import { CgNotes } from 'react-icons/cg';
import {
  BsBookshelf,
  BsBoxSeam,
  BsClipboardMinus,
  BsHddStackFill,
  BsListCheck,
  BsShop,
} from 'react-icons/bs';
import {
  MdNote,
  MdOutlineAssignmentReturn,
  MdOutlinePrecisionManufacturing,
  MdUpload,
} from 'react-icons/md';
import { RiAddFill, RiTestTubeLine } from 'react-icons/ri';
import { FiSettings } from 'react-icons/fi';
import { HiUsers } from 'react-icons/hi';
import { FaWarehouse } from 'react-icons/fa';
import { SiBlueprint } from 'react-icons/si';
import {
  TbReportAnalytics,
  TbTransferIn,
  TbTruckDelivery,
} from 'react-icons/tb';
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
        label: 'Purchase Order Detail',
        href: '/dashboard/purchase_order/purchase_order_detail',
        icon: <BiDetail />,
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
      // {
      //   href: '/dashboard/inbound/demand_note',
      //   label: 'Demand Note',
      //   icon: <MdNote />,
      // },
    ],
  },
  {
    label: 'Return',
    hasChildren: true,
    icon: <MdOutlineAssignmentReturn />,
    children: [
      {
        href: '/dashboard/return',
        label: 'Return',
        icon: <BsClipboardMinus />,
      },
      {
        href: '/dashboard/return/return_list',
        label: 'Return List',
        icon: <BiDetail />,
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
        href: '/dashboard/transfer/transfer_detail',
        label: 'Transfer Detail List',
        icon: <BiDetail />,
      },
      {
        href: '/dashboard/transfer/stock_transfer',
        label: 'Stock Transfer',
        icon: <BsBoxSeam />,
      },
      {
        href: '/dashboard/transfer/receive_list',
        label: 'Receive List',
        icon: <TbTransferIn />,
      },
      // {
      //   href: '/dashboard/transfer/stock_receive',
      //   label: 'Stock Receive',
      //   icon: <BsListCheck />,
      // },
    ],
  },
  {
    label: 'Demand Note',
    icon: <MdNote />,
    hasChildren: true,
    children: [
      {
        href: '/dashboard/demand_note',
        label: 'Show Demand Note',
        icon: <AiOutlineUnorderedList />,
      },
      {
        href: '/dashboard/demand_note/demand_note_detail',
        label: 'Demand Note Detail',
        icon: <BiDetail />,
      },
      {
        href: '/dashboard/demand_note/add_demand_note',
        label: 'Add Demand Note',
        icon: <RiAddFill />,
      },
    ],
  },
  {
    label: 'Report',
    icon: <TbReportAnalytics />,
    hasChildren: true,
    children: [
      {
        href: '/dashboard/report/stock_report',
        label: 'Stock Report',
        icon: <AiOutlineStock />,
      },
      {
        href: '/dashboard/report/stock_detail_report',
        label: 'Stock Detail Report',
        icon: <BiDetail />,
      },
      {
        href: '/dashboard/report/stock_batch_report',
        label: 'Stock Batch Report',
        icon: <BiDetail />,
      },
    ],
  },
  {
    label: 'Settings',
    icon: <FiSettings />,
    hasChildren: true,
    children: [
      {
        label: 'Bulk Upload',
        href: '/dashboard/bulk_upload',
        icon: <MdUpload />,
      },
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
