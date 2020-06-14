import { get } from "dottie";
import isBrowser from "is-browser";
// @ts-ignore
import JsonGlobal from "safe-json-globals/get";

const globalState = isBrowser && JsonGlobal("state");

export interface TokenMetadata {
  name: string;
  address: string;
  logo: string;
  type: string;
  symbol: string;
}

export const GetTokenMetadataMap = () => {
  let metadatasMap: { [key: string]: TokenMetadata };
  if (get(globalState, "base.multiChain.current") === "mainnet") {
    metadatasMap = require("iotex-token-metadata");
  } else {
    metadatasMap = require("iotex-testnet-token-metadata");
  }
  return metadatasMap;
};
