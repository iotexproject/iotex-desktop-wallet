import bech32 from "bech32";

export function toIoTeXAddress(ethAddress: string): string {
  if (!ethAddress.startsWith("0x")) {
    throw new Error("invalid ETH address prefix");
  }
  const payload = Buffer.from(ethAddress.substr(2), "hex");
  const grouped = bech32.toWords(payload);
  return bech32.encode("io", grouped);
}

export function toETHAddress(iotexAddress: string): string {
  const { prefix, words } = bech32.decode(iotexAddress);
  if (prefix !== "io") {
    throw new Error(`hrp ${prefix} and address prefix io don't match`);
  }
  const payload = bech32.fromWords(words);
  return `0x${Buffer.from(payload).toString("hex")}`;
}
