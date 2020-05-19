import notification from "antd/lib/notification";
import BigNumber from "bignumber.js";
import ethereumjs from "ethereumjs-abi";
// @ts-ignore
import window from "global/window";
import { Account } from "iotex-antenna/lib/account/account";
import { SealedEnvelop } from "iotex-antenna/lib/action/envelop";
import { ExecutionMethod, SignerPlugin } from "iotex-antenna/lib/action/method";
import { ABIDefinition } from "iotex-antenna/lib/contract/abi";
import {
  getArgTypes,
  getHeaderHash
} from "iotex-antenna/lib/contract/abi-to-byte";
import { Contract } from "iotex-antenna/lib/contract/contract";
import { fromBytes } from "iotex-antenna/lib/crypto/address";
import { IRpcMethod } from "iotex-antenna/lib/rpc-method/types";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import { getAntenna } from "../shared/wallet/get-antenna";
import { ABI } from "./abi";

const GAS_LIMIT_MULTIPLIED_BY = 3;

export interface Method {
  name: string;
  inputsNames: [string];
  inputsTypes: [string];
}

export interface IGasEstimation {
  gasPrice: string;
  gasLimit: string;
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
  public contract: Contract;
  public provider: IRpcMethod;
  protected methods: { [key: string]: Method };

  public static create(
    address: string,
    provider: IRpcMethod,
    abi: Array<ABIDefinition> = ABI
  ): ERC20 {
    const erc20 = new ERC20();
    erc20.address = address;
    erc20.provider = provider;
    erc20.contract = new Contract(abi, address, {
      provider: provider,
      // @ts-ignore
      signer: provider.signer
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
      value.toFixed(0)
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

  public async readMethod(
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

  public async executeMethod(
    method: string,
    account: Account,
    gasPrice: string,
    gasLimit: string,
    amount: string,
    // tslint:disable-next-line
    ...args: Array<any>
  ): Promise<string> {
    try {
      const canExec = await this.canExecuteMethod(
        method,
        account,
        gasPrice,
        gasLimit,
        amount,
        ...args
      );
      if (!canExec) {
        return "";
      }
    } catch (error) {
      notification.error({
        message: `${error.message}`
      });
      return "";
    }
    // Needed for debug purpose.
    window.console.log(`executeMethod`, {
      method,
      account: { ...account, privateKey: "****" },
      gasPrice,
      gasLimit,
      amount,
      args
    });
    return this.contract.methods[method](...args, {
      account: account,
      amount: amount,
      gasLimit: gasLimit,
      gasPrice: gasPrice
    });
  }

  public async canExecuteMethod(
    method: string,
    account: Account,
    gasPrice: string,
    gasLimit: string,
    amount: string,
    // tslint:disable-next-line
    ...args: Array<any>
  ): Promise<boolean> {
    const estimateGas = await this.estimateExecutionGas(
      method,
      account,
      amount, // Amount here is in RAU unit
      ...args
    );
    const gasNeeded = new BigNumber(estimateGas.gasLimit).multipliedBy(
      new BigNumber(estimateGas.gasPrice)
    );
    const gasInput = new BigNumber(gasLimit).multipliedBy(
      new BigNumber(gasPrice)
    );
    if (gasInput.isLessThan(gasNeeded)) {
      throw new Error(t("erc20.execution.error.lowGasInput"));
    }
    const { accountMeta } = await getAntenna().iotx.getAccount({
      address: account.address
    });
    if (!accountMeta) {
      throw new Error(t("erc20.execution.error.notEnoughBalance"));
    }

    const requireAmount = new BigNumber(amount).plus(gasNeeded);
    const availableBalance = new BigNumber(accountMeta.balance);
    if (availableBalance.isLessThan(requireAmount)) {
      throw new Error(t("erc20.execution.error.notEnoughBalance"));
    }
    return true;
  }

  public async estimateExecutionGas(
    method: string,
    account: Account,
    amount: string,
    // tslint:disable-next-line
    ...args: Array<any>
  ): Promise<IGasEstimation> {
    const execution = this.contract.pureEncodeMethod(amount, method, ...args);
    const executionMethod = new ExecutionMethod(
      getAntenna().iotx,
      account,
      execution
    );
    const { gasPrice } = await getAntenna().iotx.suggestGasPrice({});
    const envelop = await executionMethod.baseEnvelop("100000", `${gasPrice}`);
    envelop.execution = execution;

    let gasLimit = "400000";
    try {
      const { gas } = await getAntenna().iotx.estimateActionGasConsumption({
        transfer: envelop.transfer,
        execution: envelop.execution,
        callerAddress: account.address
      });
      gasLimit = new BigNumber(gas)
        .multipliedBy(GAS_LIMIT_MULTIPLIED_BY)
        .toFixed(0);
    } catch (e) {
      window.console.log("estimateGasForAction failed!");
    }

    return {
      gasPrice: `${gasPrice}`,
      gasLimit
    };
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
