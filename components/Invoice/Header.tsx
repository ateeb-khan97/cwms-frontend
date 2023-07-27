'use client';
//
import { Image } from '@mantine/core';

type PropType = {
  vendor_name: string;
  address: string;
  city: string;
  strn: string;
  payment_terms: string;
  id: string;
  created_at: string;
  expected_delivery_date: string;
  loc_address: string;
  po_type: string;
  ntn: string;
};
export default function Header({ dataProp }: { dataProp: PropType }) {
  return (
    <>
      <div className="flex justify-between">
        <div className="w-[200px]">
          <Image src={'/pharm_logo.png'} />
        </div>
        <div className="w-[200px]">
          <Image src={'/invoice.png'} />
        </div>
      </div>
      <div className="text-center text-[1.5rem] font-semibold">
        PURCHASE ORDER
      </div>
      <div className="flex justify-between text-[0.8rem]">
        <div className="min-w-[200px]">
          <div className="flex  gap-1">
            <span className="font-bold">Vendor:</span>
            <span>{dataProp.vendor_name}</span>
          </div>
          <div className="flex  gap-1">
            <span className="font-bold">Address:</span>
            <span>{dataProp.address}</span>
          </div>
          <div className="flex  gap-1">
            <span className="font-bold">City:</span>
            <span>{dataProp.city}</span>
          </div>
          <div className="flex  gap-1">
            <span className="font-bold">NTN:</span>
            <span>{dataProp.ntn}</span>
          </div>
          <div className="flex  gap-1">
            <span className="font-bold">STRN:</span>
            <span>{dataProp.strn}</span>
          </div>
          <div className="flex  gap-1">
            <span className="font-bold">Payment Terms:</span>
            <span>{dataProp.payment_terms}</span>
          </div>
        </div>
        <div className="min-w-[200px]">
          <div className="flex  gap-1">
            <span className="font-bold">PO Number:</span>
            <span>{dataProp.id}</span>
          </div>
          <div className="flex  gap-1">
            <span className="font-bold">PO Date:</span>
            <span>{dataProp.created_at || ''}</span>
          </div>
          <div className="flex  gap-1">
            <span className="font-bold">Delivery Date:</span>
            <span>{dataProp.expected_delivery_date || ''}</span>
          </div>
          <div className="flex  gap-1">
            <span className="font-bold">Delivery Location:</span>
            <span>{dataProp.loc_address}</span>
          </div>
          <div className="flex  gap-1">
            <span className="font-bold">PO Type:</span>
            <span>{dataProp.po_type}</span>
          </div>
          <div className="flex  gap-1">
            <span className="font-bold">Sales Tax #:</span>
            <span>327787617539-9</span>
          </div>
          <div className="flex  gap-1">
            <span className="font-bold">NTN:</span>
            <span>1354964-2</span>
          </div>
        </div>
      </div>
    </>
  );
}
