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

export const truncate = (fullStr: string, strLen: number, separator: string) => {
  if (fullStr.length <= strLen) { return fullStr; }

  const sep = separator || "...";

  const sepLen = sep.length;
  const charsToShow = strLen - sepLen;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);

  return fullStr.substr(0, frontChars) + sep + fullStr.substr(fullStr.length - backChars);
};

export const resolveAddress = (addr: string): string => {
  return addr?.startsWith("0x")
    ? convertAddress(false, addr)
    : addr
};
