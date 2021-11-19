import { IAddress } from "@core/models";

export function separateAddress(address: string): IAddress {
  const splittedAddress = address.split(', ');
  return {
    addressName: splittedAddress.shift() || '',
    address: splittedAddress.join(', '),
  };
}