import BigNumber from "bignumber.js";
import ethereumjs from "ethereumjs-abi";
import { Account } from "iotex-antenna/lib/account/account";
import {
  getArgTypes,
  getHeaderHash
} from "iotex-antenna/lib/contract/abi-to-byte";
import { Contract } from "iotex-antenna/lib/contract/contract";
import { fromBytes } from "iotex-antenna/lib/crypto/address";
import { IRpcMethod } from "iotex-antenna/lib/rpc-method/types";
import { ABI } from "./abi";

export interface Method {
  name: string;
  inputsNames: [string];
  inputsTypes: [string];
}

export interface DecodeData {
  method: string;
  // tslint:disable-next-line: no-any
  data: { [key: string]: any };
}

export interface IERC20 {
  address: string;

  name(callerAddress: string): Promise<string>;

  symbol(callerAddress: string): Promise<string>;

  decimals(callerAddress: string): Promise<BigNumber>;

  totalSupply(callerAddress: string): Promise<BigNumber>;

  balanceOf(owner: string, callerAddress: string): Promise<BigNumber>;

  transfer(
    to: string,
    value: BigNumber,
    account: Account,
    gasPrice: string,
    gasLimit: string
  ): Promise<string>;

  allowance(
    owner: string,
    spender: string,
    account: Account,
    gasPrice: string,
    gasLimit: string
  ): Promise<string>;

  approve(
    spender: string,
    value: BigNumber,
    account: Account,
    gasPrice: string,
    gasLimit: string
  ): Promise<string>;

  transferFrom(
    from: string,
    to: string,
    value: BigNumber,
    account: Account,
    gasPrice: string,
    gasLimit: string
  ): Promise<string>;

  decode(data: string): DecodeData;
}

export class ERC20 implements IERC20 {
  public address: string;
  private contract: Contract;
  public provider: IRpcMethod;
  private methods: { [key: string]: Method };

  public static create(address: string, provider: IRpcMethod): IERC20 {
    const erc20 = new ERC20();
    erc20.address = address;
    erc20.provider = provider;
    erc20.contract = new Contract(ABI, address, {
      provider: provider
    });

    const methods = {};
    // @ts-ignore
    for (const fnName of Object.keys(erc20.contract.getABI())) {
      // @ts-ignore
      const fnAbi = erc20.contract.getABI()[fnName];
      if (fnAbi.type === "constructor") {
        continue;
      }

      const args = getArgTypes(fnAbi);
      const header = getHeaderHash(fnAbi, args);

      // @ts-ignore
      methods[header] = {
        name: fnName,
        inputsNames: args.map(i => {
          return `${i.name}`;
        }),
        inputsTypes: args.map(i => {
          return `${i.type}`;
        })
      };
    }
    erc20.methods = methods;

    return erc20;
  }

  public async name(callerAddress: string): Promise<string> {
    const result = await this.readMethod("name", callerAddress);
    const data = ethereumjs.rawDecode(["string"], Buffer.from(result, "hex"));
    if (data.length > 0) {
      return data[0];
    }
    return "";
  }

  public async symbol(callerAddress: string): Promise<string> {
    const result = await this.readMethod("symbol", callerAddress);
    const data = ethereumjs.rawDecode(["string"], Buffer.from(result, "hex"));
    if (data.length > 0) {
      return data[0];
    }
    return "";
  }

  public async decimals(callerAddress: string): Promise<BigNumber> {
    const result = await this.readMethod("decimals", callerAddress);
    return new BigNumber(result, 16);
  }

  public async totalSupply(callerAddress: string): Promise<BigNumber> {
    const result = await this.readMethod("totalSupply", callerAddress);
    return new BigNumber(result, 16);
  }

  public async balanceOf(
    owner: string,
    callerAddress: string
  ): Promise<BigNumber> {
    const result = await this.readMethod("balanceOf", callerAddress, owner);
    return new BigNumber(result, 16);
  }

  public async transfer(
    to: string,
    value: BigNumber,
    account: Account,
    gasPrice: string,
    gasLimit: string
  ): Promise<string> {
    return this.executeMethod(
      "transfer",
      account,
      gasPrice,
      gasLimit,
      "0",
      to,
      value.toString()
    );
  }

  public async allowance(
    owner: string,
    spender: string,
    account: Account,
    gasPrice: string,
    gasLimit: string
  ): Promise<string> {
    return this.executeMethod(
      "allowance",
      account,
      gasPrice,
      gasLimit,
      "0",
      owner,
      spender
    );
  }

  public async approve(
    spender: string,
    value: BigNumber,
    account: Account,
    gasPrice: string,
    gasLimit: string
  ): Promise<string> {
    return this.executeMethod(
      "approve",
      account,
      gasPrice,
      gasLimit,
      "0",
      spender,
      value.toString()
    );
  }

  public async transferFrom(
    from: string,
    to: string,
    value: BigNumber,
    account: Account,
    gasPrice: string,
    gasLimit: string
  ): Promise<string> {
    return this.executeMethod(
      "transferFrom",
      account,
      gasPrice,
      gasLimit,
      "0",
      from,
      to,
      value.toString()
    );
  }

  private async readMethod(
    method: string,
    callerAddress: string,
    // @ts-ignore
    // tslint:disable-next-line: typedef
    ...args
  ): Promise<string> {
    const result = await this.provider.readContract({
      execution: this.contract.pureEncodeMethod("0", method, ...args),
      callerAddress: callerAddress
    });

    return result.data;
  }

  private executeMethod(
    method: string,
    account: Account,
    gasPrice: string,
    gasLimit: string,
    amount: string,
    // @ts-ignore
    // tslint:disable-next-line: typedef
    ...args
  ): string {
    return this.contract.methods[method](...args, {
      account: account,
      amount: amount,
      gasLimit: gasLimit,
      gasPrice: gasPrice
    });
  }

  public decode(data: string): DecodeData {
    if (data.length < 8) {
      throw new Error("input data error");
    }
    const methodKey = data.substr(0, 8);
    const method = this.methods[methodKey];
    if (!method) {
      throw new Error(`method ${methodKey} is not erc20 method`);
    }
    const params = ethereumjs.rawDecode(
      method.inputsTypes,
      Buffer.from(data.substring(8), "hex")
    );
    const values = {};

    for (let i = 0; i < method.inputsTypes.length; i++) {
      if (method.inputsTypes[i] === "address") {
        params[i] = fromBytes(
          Buffer.from(params[i].toString(), "hex")
        ).string();
      }
      // @ts-ignore
      values[method.inputsNames[i]] = params[i];
    }

    return {
      method: method.name,
      data: values
    };
  }
}
