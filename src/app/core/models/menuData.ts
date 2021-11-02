export interface IRelatedMenus {
  menuID: number,
  orderID: number,
}

export interface IPackages {
  menuGroupID: number,
  menuID: number,
  sellPrice: number,
  flagDefault: number,
  menuName: string,
  menuCode: string,
  menuShortName: string,
  qty: number,
  flagSoldOut: boolean,
}

export interface IExtras {
  menuGroupID: number,
  menuExtraID: number,
  menuExtraName: string,
  menuExtraShortName: string,
  sellPrice: number,
  minExtraQty: number,
  maxExtraQty: number,
  notes: string,
  flagSoldOut: boolean,
}

export interface IMenuPackages {
  menuGroupID: number,
  menuGroup: string,
  minQty: number,
  maxQty: number,
  notes: string,
  packages: IPackages[],
}

export interface IMenuExtras {
  menuGroupID: number,
  menuGroup: string,
  minQty: number,
  maxQty: number,
  notes: string,
  extras: IExtras[],
}

export interface IMenuIcons {
  iconName: string,
  iconUrl: string,
}

export interface IMenus {
  menuID: number,
  menuName: string,
  menuShortName: string,
  menuCode: string,
  specialPriceID: string | null,
  sellPrice: number,
  originalSellPrice: number,
  flagTax: boolean,
  flagOtherTax: boolean,
  zeroValueText: string,
  showMenuImage: number,
  imageUrl: string,
  catDetailImageUrl: string | null,
  description: string,
  qty: number,
  flagSoldOut: boolean,
  flagRecommendation: number,
  menuIcons: IMenuIcons[],
  orderID: number,
  menuPackages: IMenuPackages[],
  menuExtras: IMenuExtras[],
  relatedMenus: IRelatedMenus[],
  // Other field might be needed
  flagVegan?: boolean,
  flagSpicy?: boolean,
  flagHot?: boolean,
}

export interface IMenuCategoryDetails {
  menuCategoryDetailID: number,
  menuCategoryDetailDesc: string,
  imageUrl: string | null,
  description: string,
  menus: IMenus[],
}

export interface IRangeMenuPrice {
  labelAveragePrice: string,
  averagePrice: number,
  currencySign: string,
}

export interface IMenuCategories {
  menuCategoryID: number,
  menuCategoryDesc: string,
  imageUrl: string,
  description: string,
  menuCategoryDetails: IMenuCategoryDetails[],
}

export interface IMenuRecommendations {
  menuRecommendationGroupID: number,
  menuRecommendationGroupName: string,
  menuIDs: number[],
}

export interface IMenuData {
  rangeMenuPrice: IRangeMenuPrice,
  menuCategories: IMenuCategories[],
  menuRecommendations: IMenuRecommendations[],
}