export interface IMenuPackagesInput {
  menuID: number,
  menuName: string,
  sellPrice: number,
  qty: number,
  menuGroupID: number,
}

export interface IMenuExtrasInput {
  menuExtraID: number,
  menuExtraName: string,
  sellPrice: number,
  qty: number,
}

export interface ISalesMenusInput {
  menuID: number,
  menuName: string,
  sellPrice: number,
  imageUrl: string,
  qty: number,
  extras: IMenuExtrasInput[],
  packages: IMenuPackagesInput[],
  notes: string,
}

export interface ICustomOrderFormData {
  desc: string,
  value: string | null,
}

export interface IOrderInput {
  additionalCustomerInfo?: ICustomOrderFormData[],
  tableName?: string | null,
  salesMode?: string | null,
  type: string,
  orderType: string,
  typeName: string | null,
  fullName: string,
  email: string,
  deliveryAddress: string,
  deliveryAddressInfo: string | null,
  visitPurposeID: string,
  latitude: number,
  longitude: number,
  phoneNumber: string,
  memberID: string | null,
  salesMenus: ISalesMenusInput[],
  promotionCode: string,
  vouchers: string[],
  paymentMethodID: string,
  amount: number,
  returnUrl: string,
}