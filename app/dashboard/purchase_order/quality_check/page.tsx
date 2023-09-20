import QualityCheckPage from 'components/PurchaseOrder/QualityCheckPage';
import prisma from 'config/prisma';
//
async function getDownloadData() {
  'use server';
  //
  return (await prisma.$queryRawUnsafe(
    `SELECT id, po_id, product_id, product_name, required_quantity, received_quantity, remaining_quantity, maximum_retail_price, trade_price, discount_percentage, batch_number, CAST(DATE(batch_expiry) as CHAR) as batch_expiry, foc, uom, purchasing_price, comment, gst_rate, advance_income_tax, invoiceNumber, advanceIncome FROM grn WHERE qc_approved = false AND grn_status != "D";`,
  )) as any[];
}
//
export default function Page() {
  return <QualityCheckPage getDownloadData={getDownloadData} />;
}
