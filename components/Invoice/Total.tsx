type PurchaseOrderType = {
  total_amount: string;
  total_discount: string;
  sales_tax: string;
  net_amount: string;
  po_type: string;
};
export default function Total({
  purchaseOrder,
}: {
  purchaseOrder: PurchaseOrderType;
}) {
  return (
    <>
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
        <div className="flex justify-end border border-t-0 border-black">
          <div />
          <div className="w-[160px] border border-l-black pl-1">Net Amount</div>
          <div className="w-[85px] border border-l-black text-center">
            {Number(purchaseOrder.net_amount).toLocaleString()}
          </div>
        </div>
      </div>
      {purchaseOrder.po_type == 'Advance' && (
        <p className="mt-2 text-[0.8rem] font-bold">
          "This is an Advance Payment Purchase Order where the payment has been
          made in advance"
        </p>
      )}
    </>
  );
}
