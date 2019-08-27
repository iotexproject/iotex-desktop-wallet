import ethereumjs from "ethereumjs-abi";
import {
  getArgTypes,
  getHeaderHash
} from "iotex-antenna/lib/contract/abi-to-byte";
import { fromBytes } from "iotex-antenna/lib/crypto/address";

export interface DecodeData {
  method: string;
  // tslint:disable-next-line: no-any
  data: { [key: string]: any };
}

export function decode(abi: string, data: string): DecodeData {
  if (data.length < 8) {
    throw new Error("input data error");
  }
  const method = data.substr(0, 8);

  const ABI = JSON.parse(abi);
  for (const fnName of Object.keys(ABI)) {
    // @ts-ignore
    const fnAbi = erc20.contract.getABI()[fnName];
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
        values[method.inputsNames[i]] = params[i];
      }

      return {
        method: methodDef.name,
        data: values
      };
    }
  }

  throw new Error("can not found method");
}
