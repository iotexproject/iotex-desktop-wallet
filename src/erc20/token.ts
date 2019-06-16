import BigNumber from "bignumber.js";
import { Account } from "iotex-antenna/lib/account/account";
import { toRau } from "iotex-antenna/lib/account/utils";
import isBrowser from "is-browser";
// @ts-ignore
import JsonGlobal from "safe-json-globals/get";
import { getAntenna } from "../shared/wallet/get-antenna";
import { DecodeData, ERC20 } from "./erc20";
import { Vita } from "./vita";
const state = isBrowser && JsonGlobal("state");
const vitaTokens = isBrowser && state.base.vitaTokens;

BigNumber.config({ DECIMAL_PLACES: 6 });

export interface ITokenInfo {
  tokenAddress: string;
  balance: BigNumber;
  decimals: BigNumber;
  symbol: string;
  name: string;
  balanceString: string;
}

export interface IERC20TokenDict {
  [index: string]: Token;
}

export interface ITokenInfoDict {
  [index: string]: ITokenInfo;
}

export class Token {
  protected readonly api: ERC20 | Vita;
  protected static readonly tokenRefs: { [index: string]: Token } = {};

  constructor(api: ERC20 | Vita) {
    this.api = api;
  }

  public isVita(): boolean {
    return this.api instanceof Vita;
  }

  public static getToken(tokenAddress: string): Token {
    if (Token.tokenRefs[tokenAddress]) {
      return Token.tokenRefs[tokenAddress];
    }
    const isVita = (vitaTokens || []).indexOf(tokenAddress) >= 0;
    const api = (isVita ? Vita : ERC20).create(tokenAddress, getAntenna().iotx);
    const token = new Token(api);
    Token.tokenRefs[tokenAddress] = token;
    return token;
  }

  public decode(data: string): DecodeData {
    return this.api.decode(data);
  }

  public async checkValid(): Promise<boolean> {
    try {
      const symbol = await this.api.symbol(this.api.address);
      return `${symbol}`.length > 0;
    } catch (error) {
      return false;
    }
  }

  public async getInfo(walletAddress: string): Promise<ITokenInfo> {
    const erc20 = this.api;
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
      tokenAddress: this.api.address,
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
    return this.api.transfer(to, value, account, gasPrice, gasLimit);
  }

  public async claim(account: Account): Promise<string> {
    if (this.api instanceof Vita) {
      return this.api.claim(account, toRau("1", "Qev"), "100000");
    }
    throw new Error(`Token ${this.api.address} is not Vita!`);
  }
}
