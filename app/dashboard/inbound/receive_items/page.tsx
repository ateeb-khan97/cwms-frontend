import ReceiveItemsPage from 'components/Inbound/ReceiveItemsPage';
import prisma from 'config/prisma';
import { cookies, headers } from 'next/headers';
//
async function getCount() {
  try {
    ('use server');
    let search = '';
    let filter = '';
    //
    const referer = headers().get('referer');
    if (referer) {
      const url = new URL(referer);
      search = url.searchParams.get('search') || '';
      filter = url.searchParams.get('filter') || '';
    }
    //
    const type = cookies().get('type')?.value;
    const loc_no = cookies().get('loc_no')?.value;
    //
    const isAdmin = type == 'admin';
    const isReceived = filter == 'Received';
    //
    const searchTermsArray = [
      `(product_name LIKE "%${search}%"`,
      `received_quantity LIKE "%${search}%"`,
      `maximum_retail_price LIKE "%${search}%"`,
      `trade_price LIKE "%${search}%"`,
      `discount_percentage LIKE "%${search}%"`,
      `batch_number LIKE "%${search}%"`,
      `batch_expiry LIKE "%${search}%"`,
      `inward_id LIKE "%${search}%"`,
      `inward_date LIKE "%${search}%"`,
      `user_id LIKE "%${search}%"`,
      `user_name LIKE "%${search}%")`,
    ];
    let searchTerms = searchTermsArray.join(' OR ');
    //
    if (isAdmin) searchTerms += ` AND location_id = ${loc_no} `;
    //
    if (filter != '') {
      if (isReceived) {
        searchTerms += ` AND inward_id IS NOT NULL `;
      } else {
        searchTerms += ` AND inward_id IS NULL `;
      }
    }
    //
    const response = (await prisma.$queryRawUnsafe(
      `SELECT COUNT(*) as count FROM inward_sku WHERE ${searchTerms};`,
    )) as any[];
    const totalRows: number = response[0].count;
    return +totalRows;
  } catch (err) {
    console.log(err);
    return 0;
  }
}
async function getTableData() {
  'use server';
  let page = '1';
  let currentRowsPerPage = '1';
  let search = '';
  let filter = '';
  //
  const referer = headers().get('referer');
  if (referer) {
    const url = new URL(referer);
    page = url.searchParams.get('page') || '1';
    currentRowsPerPage = url.searchParams.get('currentRowsPerPage') || '10';
    search = url.searchParams.get('search') || '';
    filter = url.searchParams.get('filter') || '';
  }
  const isReceived = filter == 'Received';
  //
  const type = cookies().get('type')?.value;
  const loc_no = cookies().get('loc_no')?.value;
  const isAdmin = type == 'admin';
  //
  const searchTermsArray = [
    `(product_name LIKE "%${search}%"`,
    `received_quantity LIKE "%${search}%"`,
    `maximum_retail_price LIKE "%${search}%"`,
    `trade_price LIKE "%${search}%"`,
    `discount_percentage LIKE "%${search}%"`,
    `batch_number LIKE "%${search}%"`,
    `batch_expiry LIKE "%${search}%"`,
    `inward_id LIKE "%${search}%"`,
    `inward_date LIKE "%${search}%"`,
    `user_id LIKE "%${search}%"`,
    `user_name LIKE "%${search}%")`,
  ];
  let searchTerms = searchTermsArray.join(' OR ');
  //
  if (isAdmin) searchTerms += ` AND location_id = ${loc_no} `;
  //
  if (filter != '') {
    if (isReceived) {
      searchTerms += ` AND inward_id IS NOT NULL `;
    } else {
      searchTerms += ` AND inward_id IS NULL `;
    }
  }
  //
  return (await prisma.$queryRawUnsafe(`SELECT *
  FROM inward_sku
  WHERE
      ${searchTerms}
  ORDER BY id DESC
  LIMIT ${currentRowsPerPage} OFFSET ${
    (Number(page) - 1) * Number(currentRowsPerPage)
  };
  `)) as any[];
}
async function getDownloadData() {
  'use server';
  const type = cookies().get('type')?.value;
  const acc_no = cookies().get('acc_no')?.value;
  const loc_no = cookies().get('loc_no')?.value;
  const isAdmin = type == 'admin';

  return await prisma.inward_sku.findMany({
    select: {
      id: true,
      po_id: true,
      product_id: true,
      product_name: true,
      received_quantity: true,
      maximum_retail_price: true,
      trade_price: true,
      discount_percentage: true,
      batch_number: true,
      batch_expiry: true,
      foc: true,
      inward_id: true,
      inward_date: true,
      user_id: true,
      user_name: true,
    },
    where: isAdmin
      ? undefined
      : { account_number: acc_no, location_id: loc_no },
  });
}
//
export default async function Page() {
  return (
    <ReceiveItemsPage
      getDownloadData={getDownloadData}
      getCount={getCount}
      getTableData={getTableData}
    />
  );
}
