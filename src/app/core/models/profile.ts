export interface IProfileAddress {
  latitude: string,
  longitude: string,
  description: string,
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