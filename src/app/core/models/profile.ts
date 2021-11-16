export interface IProfileAddress {
  latitude: string,
  longitude: string,
  addressDescription: string,
  displayName: string,
  notes: string,
}

export interface IProfile {
  email: string,
  fullName: string,
  phoneNumber: string | null,
  imageUrl: string | null,
  onGoingTransaction: number,
  addresses: IProfileAddress[],
}