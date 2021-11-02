import { ICalculateTotalResult } from "@core/models";


export const calculateTotalData = (): ICalculateTotalResult => {
  return {
    additionalTax: 2000,
    deliveryCost: 25000,
    deliveryCostMessage: null,
    deliveryCourier: 'internal',
    discountTotal: 0,
    discountTotalDisplay: 0,
    distance: 5,
    distanceText: '5,0 Km',
    flagInclusive: true,
    flagMinimumSubtotal: false,
    grandTotal: 100000,
    minimumSubtotal: 0,
    orderFee: 0,
    pb1: 2000,
    subtotal: 50000,
    roundingTotal: 0,
    originalDeliveryCost: 0,
    orderVoucherUsage: [],
    promotionCode: '',
    promotionDiscount: 0,
    salesMenus: [],
    voucherDiscountTotal: 0,
    voucherTotal: 0,
    vouchers: [],
  };
};