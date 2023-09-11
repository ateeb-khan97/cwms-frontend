import HandleVendorsPage from 'components/Vendors/HandleVendorsPage';
import prisma from 'config/prisma';
//
interface IPropType {
  params: { slug: string };
  searchParams: { id: string | undefined };
}
//
async function vendorManufacturer(id: string) {
  'use server';
  const vendorManufacturer = await prisma.vendor_manufacturer.findMany({
    where: { vendor_id: +id },
  });
  return vendorManufacturer.map((each) => each.manufacturer_id);
}
//
async function vendorDataFetcher(id: string) {
  'use server';
  const vendorDataResponse = await prisma.vendors.findUnique({
    where: { id: +id },
    select: {
      account_ibn_number: true,
      advance_income_tax: true,
      bank_branch_code: true,
      bank_name: true,
      branch_city: true,
      business_address: true,
      business_phone_number: true,
      city: true,
      cnic: true,
      cnic_expiry_date: true,
      comment: true,
      contact_person: true,
      delivery_lead_time: true,
      drug_license_no: true,
      drug_sales_license: true,
      email_address: true,
      file_attachment_path: true,
      gst: true,
      line_of_business: true,
      id: true,
      minimum_order_quantity: true,
      ntn: true,
      payment_method: true,
      payment_terms: true,
      poc_email: true,
      poc_phone_number: true,
      procurement_category: true,
      sales_tax_group: true,
      sales_tax_percentage: true,
      status: true,
      stock_return_policy: true,
      strn: true,
      tax_exemption: true,
      tax_exemption_validity: true,
      tax_status: true,
      vendor_classification: true,
      vendor_credit_limit: true,
      vendor_name: true,
      vendor_wise_discount: true,
      with_hold_tax_group: true,
      with_hold_tax_percentage: true,
    },
  });
  //
  if (!vendorDataResponse) return {};
  //
  const { procurement_category } = vendorDataResponse;
  const procurementCategory = JSON.parse(procurement_category || '[]');
  vendorDataResponse['procurement_category'] = procurementCategory;
  return vendorDataResponse;
}
//
export default async function Page(props: IPropType) {
  const isUpdate = props.params.slug === 'update_vendor';
  const id = props.searchParams.id;
  //
  let vendorData: any;
  let manufacturerData: any[] = [];
  //
  if (isUpdate && id) {
    [vendorData, manufacturerData] = await Promise.all([
      vendorDataFetcher(id),
      vendorManufacturer(id),
    ]);
  }
  //
  return (
    <HandleVendorsPage
      manufacturerData={manufacturerData}
      vendorData={vendorData}
      isUpdate={isUpdate}
    />
  );
}
