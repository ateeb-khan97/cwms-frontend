'use server';

import prisma from 'config/prisma';
//
interface ISearchPOReturnType {
  message: string;
  status: number;
  data: any[];
}
export async function searchPo(poId: number): Promise<ISearchPOReturnType> {
  const grnFlag = await prisma.grn.count({ where: { po_id: poId } });
  //
  if (grnFlag > 0) {
    const grn = await prisma.grn.findMany({
      where: { po_id: poId, is_updatable: true },
    });
    if (grn.length > 0) {
      let index = 0;
      const dataToSend = grn.map((each) => {
        return {
          ...each,
          index: index++,
          batch_expiry: each.batch_expiry,
          required_quantity: each.remaining_quantity,
          received_quantity: each.remaining_quantity,
        };
      });
      return {
        data: dataToSend,
        message: 'Successfully found!',
        status: 200,
      };
    } else {
      return {
        data: [],
        message: 'Purchase order is waiting for QC Check!',
        status: 500,
      };
    }
  }

  const purchaseOrder = await prisma.purchase_order_master.findUnique({
    where: { id: poId },
    include: { purchase_order_detail: true },
  });
  //
  if (purchaseOrder) {
    if (
      purchaseOrder.order_status != 'Approved' &&
      purchaseOrder.order_status != 'Par-Received'
    ) {
      return {
        message: `Purchase order is ${purchaseOrder.order_status}!`,
        status: 500,
        data: [],
      };
    }
    //
    let index = 0;
    const dataToSend = purchaseOrder.purchase_order_detail.map((each) => {
      return {
        ...each,
        index: index++,
        received_quantity: each.required_quantity,
        discount_percentage: each.trade_discount_percentage,
        maximum_retail_price: 0,
        batch_number: '',
        batch_expiry: new Date(),
        comments: '',
      };
    });
    return {
      message: `Successfully found!`,
      status: 200,
      data: dataToSend,
    };
  } else {
    return {
      message: 'Purchase order not found!',
      status: 404,
      data: [],
    };
  }
}
