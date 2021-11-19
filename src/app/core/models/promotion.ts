export interface IPromotion {
  promotionID: number,
  promotionCode: string,
  promotionTypeID: string,
  notes: string,
  discount: number,
  minSubtotal: number,
  flagShow: boolean,
}