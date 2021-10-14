export interface IBranchListTheme {
  primaryColor: string,
  secondaryColor: string,
  darkenedColorTheme: string,
}

export interface IBranchListBusinessHour {
  startTime: string,
  endTime: string,
  status: string,
}

export interface IBranches {
  branchCode: string,
  branchName: string,
  bannerImageUrl: string,
  thumbnailImageUrl: string,
  latitude: number,
  longitude: number,
  radius: number,
  distance: string,
  distanceText: string,
  deliveryMode: boolean,
  flagNearMe: boolean,
  theme: IBranchListTheme,
  businessHour: IBranchListBusinessHour,
}

export interface IBranchList {
  companyCode: string,
  companyName: string,
  nearMeBranchCount: number,
  notNearMeBranchCount: number,
  deliveryBranchCount: number,
  nearestBranchDistance: number,
  nearestBranchDistanceText: string,
  branches: IBranches[],
  bannerImageUrls: string[],
  popupImageUrls: string[]
}