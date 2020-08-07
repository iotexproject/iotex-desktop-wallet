import ethereumjs from "ethereumjs-abi";
import {
  AbiByFunc,
  getArgTypes,
  getHeaderHash
} from "iotex-antenna/lib/contract/abi-to-byte";
import { fromBytes } from "iotex-antenna/lib/crypto/address";
import { ERC20 } from "../../erc20";
import { Dict } from "../common/types";
import { getAntenna } from "./get-antenna";

export interface DecodeData {
  method: string;
  data?: Dict;
}

export function decode(
  abi: string | object,
  data: string,
  contractAddress: string = "io1p99pprm79rftj4r6kenfjcp8jkp6zc6mytuah5"
): DecodeData {
  if (data.length < 8) {
    window.console.warn("input data error");
    return { method: data, data: undefined };
  }
  const method = data.substr(0, 8);

  const ABI = typeof abi === "string" ? JSON.parse(abi) : abi;
  const erc20: ERC20 = ERC20.create(contractAddress, getAntenna().iotx, ABI);

  const contractAbi = erc20.contract.getABI() as AbiByFunc;
  for (const fnName of Object.keys(contractAbi)) {
    const fnAbi = contractAbi[fnName];
    if (fnAbi.type === "constructor") {
      continue;
    }
    const args = getArgTypes(fnAbi);
    const header = getHeaderHash(fnAbi, args);

    if (method === header) {
      const methodDef = {
        name: fnName,
        inputsNames: args.map(i => {
          return `${i.name}`;
        }),
        inputsTypes: args.map(i => {
          return `${i.type}`;
        })
      };

      const params = ethereumjs.rawDecode(
        methodDef.inputsTypes,
        Buffer.from(data.substring(8), "hex")
      );
      const values = {};

      for (let i = 0; i < methodDef.inputsTypes.length; i++) {
        if (methodDef.inputsTypes[i] === "address") {
          params[i] = fromBytes(
            Buffer.from(params[i].toString(), "hex")
          ).string();
        }
        // @ts-ignore
        values[methodDef.inputsNames[i]] = params[i];
      }

      return {
        method: methodDef.name,
        data: values
      };
    }
  }

  window.console.warn("can not found method");
  return { method: data, data: undefined };
}
