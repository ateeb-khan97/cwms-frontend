import QualityCheckPage from 'components/PurchaseOrder/QualityCheckPage';
import prisma from 'config/prisma';
//
async function getDownloadData() {
  'use server';
  //
  return await prisma.grn.findMany({
    where: { qc_approved: false, grn_status: { not: 'D' } },
    select: {
      discount_percentage: true,
      batch_expiry: true,
      advance_income_tax: true,
      batch_number: true,
      comments: true,
      created_at: true,
      foc: true,
      gst_rate: true,
      maximum_retail_price: true,
      product_name: true,
      product_id: true,
      purchasing_price: true,
      uom: true,
      trade_price: true,
      required_quantity: true,
      received_quantity: true,
      po_id: true,
    },
  });
}
//
export default function Page() {
  return <QualityCheckPage getDownloadData={getDownloadData} />;
}
