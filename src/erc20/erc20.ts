import BigNumber from "bignumber.js";
import ethereumjs from "ethereumjs-abi";
import { Account } from "iotex-antenna/lib/account/account";
import { Contract } from "iotex-antenna/lib/contract/contract";
import { IRpcMethod } from "iotex-antenna/lib/rpc-method/types";
import { ABI } from "./abi";

export interface IERC20 {
  address: string;

  name(callerAddress: string): Promise<string>;

  symbol(callerAddress: string): Promise<string>;

  decimals(callerAddress: string): Promise<Number>;

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
}

export class ERC20 implements IERC20 {
  public address: string;
  private contract: Contract;
  public provider: IRpcMethod;

  public static create(address: string, provider: IRpcMethod): IERC20 {
    const erc20 = new ERC20();
    erc20.address = address;
    erc20.provider = provider;
    erc20.contract = new Contract(ABI, address, {
      provider: provider
    });
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

  public async decimals(callerAddress: string): Promise<Number> {
    const result = await this.readMethod("decimals", callerAddress);
    const data = ethereumjs.rawDecode(["uint8"], Buffer.from(result, "hex"));
    if (data.length > 0) {
      return data[0];
    }
    return 0;
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
}
