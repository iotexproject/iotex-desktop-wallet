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
};

export const truncate = (fullStr, strLen, separator) => {
  if (fullStr.length <= strLen) return fullStr;

  separator = separator || '...';

  let sepLen = separator.length,
    charsToShow = strLen - sepLen,
    frontChars = Math.ceil(charsToShow / 2),
    backChars = Math.floor(charsToShow / 2);

  return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
};
