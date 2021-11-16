import { IExtras, IPackages } from './menuData';

export interface ISalesMenusOrderData {
  ID: number,
  localID: number,
  batchID: number,
  menuID: number,
  menuName: string,
  menuGroupID: number,
  qty: number,
  originalPrice: number,
  price: number,
  sellPrice: number,
  total: number,
  discountValue: number,
  otherTax: number,
  otherTaxValue: number,
  vat: number,
  vatValue: number,
  otherTaxOnVat: number,
  promotionDetailID: number,
  notes: string,
  statusID: number,
  statusName: string,
  packages: IPackages[],
  extras: IExtras[]
  // 
  imageUrl?: string,
}

export interface ISalesPayment {
  paymentMethodID: string,
  paymentOrderID: string,
  paymentTransactionID: string | null,
  paymentDate: string,
  paymentStatus: string,
  paymentTotal: number,
}

export interface IDeliveryStatus {
  createdDate: string,
  statusName: string,
}

export interface IDelivery {
  driverName: string | null,
  driverPhone: string | null,
  trackingUrl: string | null,
  status: IDeliveryStatus[],
}

export interface IOrderData {
  orderID: string,
  deliveryTransactionID: string,
  salesNum: string | null,
  billNum: string | null,
  transactionDate: string,
  type: string,
  typeName: string,
  companyCode: string,
  branchCode: string,
  branchName: string,
  queueNum: number | null,
  tableID: number,
  tableName: string | null,
  paxTotal: number,
  subtotal: number,
  discountTotal: number,
  discountTotalDisplay: number,
  menuDiscountTotal: number,
  promotionDiscount: number,
  otherTaxTotal: number,
  vatTotal: number,
  orderFee: number,
  grandTotal: number,
  roundingTotal: number,
  billingPrintCount: number,
  flagInclusive: boolean,
  flagExternalMemberID: string | null,
  flagExternalCardID: string | null,
  hasAnswerComment: boolean,
  qrData: string | null,
  salesMenus: ISalesMenusOrderData[],
  salesPayment: ISalesPayment,
  vouchers: string[],
  delivery: IDelivery,
  status: string,
  editedDate: string,
  refundStatus: string | null,
  refundUrl: string | null,
}