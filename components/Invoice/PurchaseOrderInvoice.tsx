'use client';
import React from 'react';
import moment from 'moment';
import axiosFunction from 'functions/axiosFunction';
import Loader from 'components/Shared/Loader';
import Header from './Header';
import TermsAndCondition from './TermsAndCondition';
import Table from './Table';
import Total from './Total';
//
const InvoiceComponent = () => {
  const [purchaseOrder, setPurchaseOrder] = React.useState<any>({
    address: '',
    advance_income: '',
    advance_income_tax: 0,
    arrival_date: new Date(),
    city: '',
    delivery_location: '',
    loc_address: '',
    expected_delivery_date: new Date().toString(),
    id: 0,
    net_amount: 0,
    ntn: '',
    order_status: '',
    order_type: 'Advance',
    payment_terms: '',
    po_type: '',
    sales_tax: 0,
    status: '',
    strn: '',
    total_amount: 0,
    total_discount: 0,
    vendor_id: 0,
    vendor_name: '',
    purchase_order_detail: [],
  });
  const [product, setProduct] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  //
  const purchaseFetcher = async (id: number) => {
    setLoading(true);
    const [po_data] = await axiosFunction({
      urlPath: '/purchase_order/find_by_id',
      method: 'POST',
      data: { id: id },
    }).then((res) => res.data);

    const created_at = moment(new Date(po_data.created_at));
    const expected_delivery_date = moment(
      new Date(po_data.expected_delivery_date),
    );
    setPurchaseOrder({
      ...po_data,
      created_at: created_at.format('DD/MM/YYYY'),
      expected_delivery_date: expected_delivery_date.format('DD/MM/YYYY'),
    });
    //
    setProduct(po_data.purchase_order_detail);
    setLoading(false);
  };
  //
  React.useEffect(() => {
    const id = JSON.parse(localStorage.getItem('purchase_order')!);
    purchaseFetcher(id);
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex h-56 items-center justify-center">
          <Loader />
        </div>
      ) : (
        <section className="flex flex-col items-center justify-between">
          <div className="main_page_invoice flex min-h-screen items-center justify-center">
            <main className="w-[180mm]">
              <Header dataProp={purchaseOrder} />
              <Table product={product} />
              <Total purchaseOrder={purchaseOrder} />
            </main>
          </div>
          <div className="flex h-screen items-center justify-center">
            <main className="w-[180mm]">
              <Header dataProp={purchaseOrder} />
              <TermsAndCondition />
            </main>
          </div>
        </section>
      )}
    </>
  );
};

export default InvoiceComponent;
