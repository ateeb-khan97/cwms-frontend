'use client';
import { Image } from '@mantine/core';
import React from 'react';
import moment from 'moment';
import axiosFunction from 'functions/axiosFunction';
import Loader from 'components/Shared/Loader';

type Props = {};

//
var total_temp = 0;
var total_discount_temp = 0;
var tax_temp = 0;
//
const InvoiceComponent = (props: Props) => {
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
    console.log(po_data);

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
    console.log('id', id);

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
                  <div className="flex justify-between gap-5">
                    <span className="font-bold">Vendor:</span>
                    <span>{purchaseOrder.vendor_name}</span>
                  </div>
                  <div className="flex justify-between gap-5">
                    <span className="font-bold">Address:</span>
                    <span>{purchaseOrder.address}</span>
                  </div>
                  <div className="flex justify-between gap-5">
                    <span className="font-bold">City:</span>
                    <span>{purchaseOrder.city}</span>
                  </div>
                  {/* <div className="flex justify-between gap-5">
                    <span className="font-bold">NTN:</span>
                    <span>{purchaseOrder.ntn}</span>
                  </div> */}
                  <div className="flex justify-between gap-5">
                    <span className="font-bold">STRN:</span>
                    <span>{purchaseOrder.strn}</span>
                  </div>
                  <div className="flex justify-between gap-5">
                    <span className="font-bold">Payment Terms:</span>
                    <span>{purchaseOrder.payment_terms}</span>
                  </div>
                </div>
                <div className="min-w-[200px]">
                  <div className="flex justify-between gap-5">
                    <span className="font-bold">PO Number:</span>
                    <span>{purchaseOrder.id}</span>
                  </div>
                  <div className="flex justify-between gap-5">
                    <span className="font-bold">PO Date:</span>
                    <span>
                      {purchaseOrder.created_at ? purchaseOrder.created_at : ''}
                    </span>
                  </div>
                  <div className="flex justify-between gap-5">
                    <span className="font-bold">Delivery Date:</span>
                    <span>
                      {purchaseOrder.expected_delivery_date
                        ? purchaseOrder.expected_delivery_date
                        : ''}
                    </span>
                  </div>
                  <div className="flex justify-between gap-5">
                    <span className="font-bold">Delivery Location:</span>
                    <span>{purchaseOrder.loc_address}</span>
                  </div>
                  <div className="flex justify-between gap-5">
                    <span className="font-bold">PO Type:</span>
                    <span>{purchaseOrder.po_type}</span>
                  </div>
                  <div className="flex justify-between gap-5">
                    <span className="font-bold">Sales Tax #:</span>
                    <span>327787617539-9</span>
                  </div>
                  <div className="flex justify-between gap-5">
                    <span className="font-bold">NTN:</span>
                    <span>1354964-2</span>
                  </div>
                </div>
              </div>
              <div className="text-[0.8rem]">
                <table className="mt-5 w-[100%] border border-black">
                  <thead>
                    <tr>
                      <th className="w-[20px] border border-black">#</th>
                      <th className="w-[150px] border border-black">Product</th>
                      <th className="w-[110px] border border-black">
                        Manufacturer
                      </th>
                      <th className="w-[55px] border border-black">P.Z</th>
                      <th className="w-[55px] border border-black">UOM</th>
                      <th className="w-[40px] border border-black">Qty</th>
                      <th className="w-[55px] border border-black">T.P</th>
                      <th className="w-[85px] border border-black">
                        Discount %
                      </th>
                      <th className="w-[75px] border border-black">
                        Sales Tax
                      </th>
                      <th className="w-[85px] border border-black">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.length > 0
                      ? product.map((each_product: any, key: number) => {
                          //
                          var total_price = (
                            +each_product.required_quantity *
                            +each_product.trade_price
                          ).toFixed(3);
                          total_temp = total_temp + +total_price;
                          //
                          var trade_price_after_trade_discount = (
                            +(+each_product.trade_discount_percentage / 100) *
                            +total_price
                          ).toFixed(3);
                          total_discount_temp =
                            total_discount_temp +
                            +trade_price_after_trade_discount;
                          //
                          var trade_price_after_applying_gst = (
                            +(+each_product.sales_tax_percentage / 100) *
                            +(+total_price - +trade_price_after_trade_discount)
                          ).toFixed(3);
                          tax_temp = tax_temp + +trade_price_after_applying_gst;
                          //
                          var dis_temp =
                            +each_product.trade_price -
                            +(each_product.trade_discount_percentage / 100) *
                              +each_product.trade_price;
                          //
                          return (
                            <tr key={key} className="border-b border-b-black">
                              <td className="border-r border-r-black text-center">
                                {key + 1}
                              </td>
                              <td className="border-r border-r-black text-center">
                                {each_product.product_name}
                              </td>
                              <td className="border-r border-r-black text-center">
                                {each_product.manufacturer_name}
                              </td>
                              <td className="border-r border-r-black text-center">
                                {each_product.item_conversion}
                              </td>
                              <td className="border-r border-r-black text-center">
                                {each_product.uom}
                              </td>
                              <td className="border-r border-r-black text-center">
                                {each_product.required_quantity}
                              </td>
                              <td className="border-r border-r-black text-center">
                                {each_product.trade_price}
                              </td>
                              <td className="border-r border-r-black text-center">
                                {each_product.trade_discount_percentage}
                              </td>
                              <td className="border-r border-r-black text-center">
                                {(
                                  (+each_product.sales_tax_percentage / 100) *
                                  dis_temp
                                ).toFixed(3)}
                              </td>
                              <td className="text-center">
                                {Number(
                                  (
                                    +total_price -
                                    +trade_price_after_trade_discount +
                                    +trade_price_after_applying_gst
                                  ).toFixed(3),
                                ).toLocaleString()}
                              </td>
                            </tr>
                          );
                        })
                      : ''}
                  </tbody>
                </table>
              </div>
              <div className="text-[0.8rem] font-semibold">
                <div className="flex justify-end border border-t-0 border-black">
                  <div />
                  <div className="w-[160px] border-l border-l-black pl-1">
                    Total Amount
                  </div>
                  <div className="w-[85px] border border-l-black text-center">
                    {Number(purchaseOrder.total_amount).toLocaleString()}
                  </div>
                </div>
                <div className="flex justify-end border border-t-0 border-black">
                  <div />
                  <div className="w-[160px] border-l border-l-black pl-1">
                    Total Discount
                  </div>
                  <div className="w-[85px] border border-l-black text-center">
                    {Number(purchaseOrder.total_discount).toLocaleString()}
                  </div>
                </div>
                <div className="flex justify-end border border-t-0 border-black">
                  <div />
                  <div className="w-[160px] border-l border-l-black pl-1">
                    Sales Tax
                  </div>
                  <div className="w-[85px] border border-l-black text-center">
                    {Number(purchaseOrder.sales_tax).toLocaleString()}
                  </div>
                </div>
                {/* <div className="flex justify-end border border-black border-t-0">
              <div />
              <div className="pl-1 w-[160px] border-l border-l-black">
                Advance Income Tax
              </div>
              <div className="w-[85px] border border-l-black text-center">
                {purchaseOrder.advance_income}
              </div>
            </div> */}
                <div className="flex justify-end border border-t-0 border-black">
                  <div />
                  <div className="w-[160px] border border-l-black pl-1">
                    Net Amount
                  </div>
                  <div className="w-[85px] border border-l-black text-center">
                    {Number(purchaseOrder.net_amount).toLocaleString()}
                  </div>
                </div>
              </div>
              {purchaseOrder.po_type == 'Advance' && (
                <p className="mt-2 text-[0.8rem] font-bold">
                  "This is an Advance Payment Purchase Order where the payment
                  has been made in advance"
                </p>
              )}
            </main>
          </div>
          <div className="flex h-screen items-center justify-center">
            <main className="w-[180mm]">
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
                  <div className="flex justify-between gap-5">
                    <span className="font-bold">Vendor:</span>
                    <span>{purchaseOrder.vendor_name}</span>
                  </div>
                  <div className="flex justify-between gap-5">
                    <span className="font-bold">Address:</span>
                    <span>{purchaseOrder.address}</span>
                  </div>
                  <div className="flex justify-between gap-5">
                    <span className="font-bold">City:</span>
                    <span>{purchaseOrder.city}</span>
                  </div>
                  <div className="flex justify-between gap-5">
                    <span className="font-bold">NTN:</span>
                    <span>{purchaseOrder.ntn}</span>
                  </div>
                  <div className="flex justify-between gap-5">
                    <span className="font-bold">STRN:</span>
                    <span>{purchaseOrder.strn}</span>
                  </div>
                  <div className="flex justify-between gap-5">
                    <span className="font-bold">Payment Terms:</span>
                    <span>{purchaseOrder.payment_terms}</span>
                  </div>
                </div>
                <div className="min-w-[200px]">
                  <div className="flex justify-between gap-5">
                    <span className="font-bold">PO Number:</span>
                    <span>{purchaseOrder.id}</span>
                  </div>
                  <div className="flex justify-between gap-5">
                    <span className="font-bold">PO Date:</span>
                    <span>
                      {purchaseOrder.created_at ? purchaseOrder.created_at : ''}
                    </span>
                  </div>
                  <div className="flex justify-between gap-5">
                    <span className="font-bold">Delivery Date:</span>
                    <span>
                      {purchaseOrder.expected_delivery_date
                        ? purchaseOrder.expected_delivery_date
                        : ''}
                    </span>
                  </div>
                  <div className="flex justify-between gap-5">
                    <span className="font-bold">Delivery Location:</span>
                    <span>{purchaseOrder.delivery_location}</span>
                  </div>
                  <div className="flex justify-between gap-5">
                    <span className="font-bold">PO Type:</span>
                    <span>{purchaseOrder.po_type}</span>
                  </div>
                  <div className="flex justify-between gap-5">
                    <span className="font-bold">Sales Tax #:</span>
                    <span>{123}</span>
                  </div>
                  <div className="flex justify-between gap-5">
                    <span className="font-bold">NTN:</span>
                    <span>{purchaseOrder.ntn}</span>
                  </div>
                </div>
              </div>
              <div className="text-[0.7rem]">
                <table className="mt-5 w-[100%] border border-black">
                  <thead>
                    <tr className="border border-black">
                      <th>Terms & Conditions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <ol className="custom_list">
                          <li>
                            Vendor’s acknowledgment of this PO or commencement
                            of performance hereunder shall constitute Vendor
                            acceptance of all terms & conditions herein.
                          </li>
                          <li>
                            Payment will be made through crossed Cheque as per
                            agreed payment terms.
                          </li>
                          <li>
                            Vendor will be responsible to deliver the goods to
                            the Meri Pharmacy warehouse at their own cost.
                          </li>
                          <li>
                            Vendor will pack and label the Goods in a manner
                            suitable for transit and storage at no cost to Meri
                            Pharmacy.
                          </li>
                          <li>
                            Temperature controlled goods shall be ensured by the
                            vendor to maintain cool chain till delivery at Meri
                            Pharmacy.
                          </li>
                          <li>
                            The vendor will be responsible for any
                            damages/Shortages caused to the goods during transit
                            and Meri Pharmacy will not be responsible for such
                            damages/shortages.
                          </li>
                          <li>
                            All the supplies which are applicable for Shelf Life
                            shall be received not less than 85% at the time of
                            delivery.
                          </li>
                          <li>
                            In case of Medicines, Health & OTC products, vendor
                            must furnish a warranty invoice.
                          </li>
                          <li>
                            The Seller shall comply with all applicable
                            standards, regulations & other legal requirements
                            concerning the manufacture, packing, and delivery of
                            the goods.
                          </li>
                          <li>
                            The invoice and Delivery Challan must have a
                            reference of the Purchase Order issued in this
                            respect.
                          </li>
                          <li>
                            Time is the essence with respect to delivery of the
                            Goods. Goods must be delivered by the applicable
                            delivery date. Vendor must immediately notify Meri
                            Pharmacy if Vendor is likely to be unable to meet a
                            Delivery Date. At any point prior to the Delivery
                            Date, Meri Pharmacy may, upon notice to Vendor,
                            cancel or change a Purchase order, or any portion
                            thereof, for any reason, including, without
                            limitation, for the convenience of Meri Pharmacy or
                            due to failure of vendor to comply with this
                            Purchase Order, unless otherwise noted.
                          </li>
                          <li>
                            Deliveries are accepted only between 09:00 a.m. to
                            04:00 p.m. (Mon to Sat)
                          </li>
                          <li>
                            The validity of the special rates or discounts shall
                            be for the period mutually agreed and as per
                            quotation and it can be renewed after the said
                            period.
                          </li>
                          <li>
                            Supplier must provide STRN & NTN for sales tax
                            invoices.
                          </li>
                          <li>
                            Batch & expiry must be mentioned on DC/Invoice.
                          </li>
                          <li>
                            Withholding tax will be deducted as per law from all
                            supplies made to Meri Pharmacy or it will not be
                            deducted if vendor provided valid tax exemption
                            Certificate with the invoice.
                          </li>
                          <li>
                            Meri Pharmacy will notify the vendor for the stock
                            reaching the expiry date in writing at least 3months
                            (90days) before the expiry date. Upon receipt of
                            such intimation, the vendor shall return the stock
                            from Meri Pharmacy location and provide credit note
                            of same value.
                          </li>
                        </ol>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="flex justify-center border border-t-0 border-black">
                  <span className="font-bold">
                    Meri Pharmacy – A Project of Marie Stopes Society
                  </span>
                </div>
                <div className="flex justify-center">
                  <span>
                    Tel: (92) 0300-0446767Website:
                    {
                      <a href="www.mariestopespk.org">www.mariestopespk.org</a>
                    }{' '}
                    & {<a href="www.meripharmacy.pk">www.meripharmacy.pk</a>}
                  </span>
                </div>
              </div>
            </main>
          </div>
        </section>
      )}
    </>
  );
};

export default InvoiceComponent;
