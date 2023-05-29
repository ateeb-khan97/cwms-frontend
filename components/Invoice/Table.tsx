var total_temp = 0;
var total_discount_temp = 0;
var tax_temp = 0;
export default function Table({ product }: { product: any[] }) {
  return (
    <>
      <div className="text-[0.8rem]">
        <table className="mt-5 w-[100%] border border-black">
          <thead>
            <tr>
              <th className="w-[20px] border border-black">#</th>
              <th className="w-[150px] border border-black">Product</th>
              <th className="w-[110px] border border-black">Manufacturer</th>
              <th className="w-[55px] border border-black">P.Z</th>
              <th className="w-[55px] border border-black">UOM</th>
              <th className="w-[40px] border border-black">Qty</th>
              <th className="w-[55px] border border-black">T.P</th>
              <th className="w-[85px] border border-black">Discount %</th>
              <th className="w-[75px] border border-black">Sales Tax</th>
              <th className="w-[85px] border border-black">Amount</th>
            </tr>
          </thead>
          <tbody>
            {product.length > 0
              ? product.map((each_product: any, key: number) => {
                  //
                  var total_price = (
                    +each_product.required_quantity * +each_product.trade_price
                  ).toFixed(3);
                  total_temp = total_temp + +total_price;
                  //
                  var trade_price_after_trade_discount = (
                    +(+each_product.trade_discount_percentage / 100) *
                    +total_price
                  ).toFixed(3);
                  total_discount_temp =
                    total_discount_temp + +trade_price_after_trade_discount;
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
    </>
  );
}
