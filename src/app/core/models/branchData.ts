export interface IBranchDataTheme {
  primaryColor: string,
  secondaryColor: string,
  darkenedColorTheme: string,
}

export interface IBranchDataDisplay {
  orderLandingPage: boolean,
  menuDisplayMode: string,
  menuNavigationMode: string,
  orderDisplayMode: string,
  menuPlaceHolderNotesEn: string,
  menuPlaceHolderNotesId: string,
  menuRelatedTitleMenuList: string,
  menuRelatedTitleSummaryOrder: string,
  orderSummaryFooter: string,
}

export interface IBranchDataFeature {
  esbOrderLogin: boolean,
  voucherUsage: boolean,
  parallelPromotionVoucherUsage: boolean,
  pickupTime: boolean,
}

export interface IBranchDataBusinessHour {
  dayID: number,
  startTime: string,
  endTime: string,
  day: string,
  isCurrentDay: boolean,
  isOperatingDay: string,
}

export interface IBranchDataOrderModes {
  type: string,
  visitPurposeID: string,
  deliveryCourier?: string,
}

export interface IBranchDataPaymentOnline {
  id: string,
  name: string,
  nameId: string,
  description: string,
  descriptionId: string,
  needPhoneInput: boolean,
  minimumTransaction: number,
  paymentExpiredTime: number,
  xenditPublicKey?: string,
}

export interface IBranchDataPayment {
  atCashier: boolean,
  deliveryPayment: boolean,
  deliveryPaymentName: string,
  deliveryPaymentDescription: string,
  online: IBranchDataPaymentOnline[],
}

export interface IBranchData {
  companyCode: string,
  branchCode: string,
  branchName: string,
  brandName: string,
  address: string,
  phone: string,
  latitude: number,
  longitude: number,
  additionalTaxName: string,
  additionalTaxValue: number,
  taxName: string,
  taxValue: number,
  bannerImageUrl: string,
  thumbnailImageUrl: string,
  membershipType: string,
  isOpen: boolean,
  isTemporaryClosed: boolean,
  temporaryClosedInformation: string | null,
  cloosedInMinute: number,
  tenantCode: string,
  tenantName: string,
  orderBackUrl: string,
  theme: IBranchDataTheme,
  display: IBranchDataDisplay,
  feature: IBranchDataFeature,
  rangeMenuPrice: boolean,
  businessHour: IBranchDataBusinessHour[],
  orderModes: IBranchDataOrderModes[],
  payment: IBranchDataPayment,
}