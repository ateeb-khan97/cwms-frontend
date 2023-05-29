export default function TermsAndCondition() {
  return (
    <>
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
                    Vendor’s acknowledgment of this PO or commencement of
                    performance hereunder shall constitute Vendor acceptance of
                    all terms & conditions herein.
                  </li>
                  <li>
                    Payment will be made through crossed Cheque as per agreed
                    payment terms.
                  </li>
                  <li>
                    Vendor will be responsible to deliver the goods to the Meri
                    Pharmacy warehouse at their own cost.
                  </li>
                  <li>
                    Vendor will pack and label the Goods in a manner suitable
                    for transit and storage at no cost to Meri Pharmacy.
                  </li>
                  <li>
                    Temperature controlled goods shall be ensured by the vendor
                    to maintain cool chain till delivery at Meri Pharmacy.
                  </li>
                  <li>
                    The vendor will be responsible for any damages/Shortages
                    caused to the goods during transit and Meri Pharmacy will
                    not be responsible for such damages/shortages.
                  </li>
                  <li>
                    All the supplies which are applicable for Shelf Life shall
                    be received not less than 85% at the time of delivery.
                  </li>
                  <li>
                    In case of Medicines, Health & OTC products, vendor must
                    furnish a warranty invoice.
                  </li>
                  <li>
                    The Seller shall comply with all applicable standards,
                    regulations & other legal requirements concerning the
                    manufacture, packing, and delivery of the goods.
                  </li>
                  <li>
                    The invoice and Delivery Challan must have a reference of
                    the Purchase Order issued in this respect.
                  </li>
                  <li>
                    Time is the essence with respect to delivery of the Goods.
                    Goods must be delivered by the applicable delivery date.
                    Vendor must immediately notify Meri Pharmacy if Vendor is
                    likely to be unable to meet a Delivery Date. At any point
                    prior to the Delivery Date, Meri Pharmacy may, upon notice
                    to Vendor, cancel or change a Purchase order, or any portion
                    thereof, for any reason, including, without limitation, for
                    the convenience of Meri Pharmacy or due to failure of vendor
                    to comply with this Purchase Order, unless otherwise noted.
                  </li>
                  <li>
                    Deliveries are accepted only between 09:00 a.m. to 04:00
                    p.m. (Mon to Sat)
                  </li>
                  <li>
                    The validity of the special rates or discounts shall be for
                    the period mutually agreed and as per quotation and it can
                    be renewed after the said period.
                  </li>
                  <li>
                    Supplier must provide STRN & NTN for sales tax invoices.
                  </li>
                  <li>Batch & expiry must be mentioned on DC/Invoice.</li>
                  <li>
                    Withholding tax will be deducted as per law from all
                    supplies made to Meri Pharmacy or it will not be deducted if
                    vendor provided valid tax exemption Certificate with the
                    invoice.
                  </li>
                  <li>
                    Meri Pharmacy will notify the vendor for the stock reaching
                    the expiry date in writing at least 3months (90days) before
                    the expiry date. Upon receipt of such intimation, the vendor
                    shall return the stock from Meri Pharmacy location and
                    provide credit note of same value.
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
            {<a href="www.mariestopespk.org">www.mariestopespk.org</a>} &{' '}
            {<a href="www.meripharmacy.pk">www.meripharmacy.pk</a>}
          </span>
        </div>
      </div>
    </>
  );
}
