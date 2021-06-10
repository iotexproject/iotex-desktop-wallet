import { validateAddress } from "iotex-antenna/lib/account/utils";
import { fromString } from "iotex-antenna/lib/crypto/address";

export const convertAddress = (toEthAddress: boolean, address: string): string => {
  if (toEthAddress && address.startsWith("io") && validateAddress(address)) {
    return fromString(address).stringEth()
  }
  return address
};
