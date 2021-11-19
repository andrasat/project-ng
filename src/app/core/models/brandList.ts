export interface IBrandListCategory {
  brandCategoryID: number | null,
  brandCategoryName: string | null,
}

export interface IBrands {
  brandID: string,
  brandName: string,
  brandImageUrl: string | null,
  brandCategory: IBrandListCategory,
  nearMeBranchCount: number,
  nearestBranchDistance: number | null,
  nearestBranchDistanceText: string | null,
}

export interface IBrandList {
  brands: IBrands[],
  popupImageUrls: string[],
}