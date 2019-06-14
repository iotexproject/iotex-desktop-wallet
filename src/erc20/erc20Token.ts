import BigNumber from "bignumber.js";
import { Account } from "iotex-antenna/lib/account/account";
import { toRau } from "iotex-antenna/lib/account/utils";
import { getAntenna } from "../shared/wallet/get-antenna";
import { DecodeData, ERC20, IERC20 } from "./erc20";

BigNumber.config({ DECIMAL_PLACES: 6 });

export interface IERC20TokenInfo {
  erc20TokenAddress: string;
  balance: BigNumber;
  decimals: BigNumber;
  symbol: string;
  name: string;
  balanceString: string;
}

export interface IERC20TokenDict {
  [index: string]: ERC20Token;
}

export interface IERC20TokenInfoDict {
  [index: string]: IERC20TokenInfo;
}

export class ERC20Token {
  private readonly erc20: IERC20;
  private static readonly erc20Refs: { [index: string]: IERC20 } = {};
  private static readonly erc20TokenRefs: { [index: string]: ERC20Token } = {};

  constructor(erc20TokenAddress: string) {
    if (!ERC20Token.erc20Refs[erc20TokenAddress]) {
      ERC20Token.erc20Refs[erc20TokenAddress] = ERC20.create(
        erc20TokenAddress,
        getAntenna().iotx
      );
    }
    this.erc20 = ERC20Token.erc20Refs[erc20TokenAddress];
    ERC20Token.erc20TokenRefs[erc20TokenAddress] = this;
  }

  public static getToken(erc20TokenAddress: string): ERC20Token {
    if (!ERC20Token.erc20TokenRefs[erc20TokenAddress]) {
      ERC20Token.erc20TokenRefs[erc20TokenAddress] = new ERC20Token(
        erc20TokenAddress
      );
    }
    return ERC20Token.erc20TokenRefs[erc20TokenAddress];
  }

  public decode(data: string): DecodeData {
    return this.erc20.decode(data);
  }

  public async checkValid(): Promise<boolean> {
    try {
      const symbol = await this.erc20.symbol(this.erc20.address);
      return `${symbol}`.length > 0;
    } catch (error) {
      return false;
    }
  }

  public async getInfo(walletAddress: string): Promise<IERC20TokenInfo> {
    const erc20 = this.erc20;
    const [balance, name, symbol, decimals] = await Promise.all<
      BigNumber,
      string,
      string,
      BigNumber
    >([
      erc20.balanceOf(walletAddress, walletAddress),
      erc20.name(walletAddress),
      erc20.symbol(walletAddress),
      erc20.decimals(walletAddress)
    ]);
    const balanceString = balance
      .dividedBy(10 ** decimals.toNumber())
      .toString(10);

    return {
      erc20TokenAddress: this.erc20.address,
      balance,
      decimals,
      symbol,
      name,
      balanceString
    };
  }

  public async transfer(
    to: string,
    value: BigNumber,
    account: Account,
    gasPrice: string,
    gasLimit: string
  ): Promise<string> {
    return this.erc20.transfer(to, value, account, gasPrice, gasLimit);
  }

  public async claim(account: Account): Promise<string> {
    return this.erc20.claim(account, toRau("1", "Qev"), "100000");
  }
}
