import { ISalesMenusInput } from '.';

export interface ICalculateTotalInput {
  visitPurposeID: string,
  orderType: string,
  latitude: number,
  longitude: number,
  phoneNumber: string,
  salesMenus: ISalesMenusInput[],
  promotionCode: string,
  vouchers: string[],
}