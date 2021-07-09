import { validateAddress } from "iotex-antenna/lib/account/utils";
import { fromBytes, fromString } from "iotex-antenna/lib/crypto/address";
import { useSelector } from "react-redux";

export const convertAddress = (toEthAddress: boolean, address: string = ""): string => {
  if (toEthAddress && address.startsWith("io") && validateAddress(address)) {
    return fromString(address).stringEth()
  }
  if (!toEthAddress && address.startsWith("0x")) {
     return fromBytes(Buffer.from(String(address).replace(/^0x/, ""), "hex")).string()
  }
  return address
};

export const useConvertAddress = () => {
   const toEthAddress = useSelector((state: {
    base: {
      toEthAddress: boolean
    };
  }) => state.base.toEthAddress)
  return (address: string) => {
    return  convertAddress(toEthAddress, address)
  }
}