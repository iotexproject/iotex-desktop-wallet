import BigNumber from "bignumber.js";
// @ts-ignore
import window from "global/window";
import { Account } from "iotex-antenna/lib/account/account";
import { toRau } from "iotex-antenna/lib/account/utils";
import isBrowser from "is-browser";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import JsonGlobal from "safe-json-globals/get";
import { xconf, XConfKeys } from "../shared/common/xconf";
import { toIoTeXAddress } from "../shared/wallet/address";
import { getAntenna } from "../shared/wallet/get-antenna";
import { BID_ABI } from "./abi";
import { DecodeData, ERC20, IGasEstimation } from "./erc20";
import { IAuthorizedMessage, Vita } from "./vita";

const state = isBrowser && JsonGlobal("state");
const vitaTokens = isBrowser && state.base.vitaTokens;

const regex = /^([0-9]+)I authorize 0x[0-9a-fA-F]{40} to claim in (0x[0-9A-Fa-f]{40})$/;

export interface ITokenInfo {
  tokenAddress: string;
  balance: BigNumber;
  decimals: BigNumber;
  symbol: string;
  name: string;
  balanceString: string;
}

export interface ITokenBasicInfo {
  tokenAddress: string;
  symbol: string;
  name: string;
  decimals: BigNumber;
  totalSupply: string;
  contractAddress: string;
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
  protected isBidToken: boolean;

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

  public static getVitaToken(
    tokenAddresses: Array<string>
  ): string | undefined {
    return tokenAddresses.find(tokenAddress =>
      vitaTokens.includes(tokenAddress)
    );
  }

  public getApi(): ERC20 | Vita {
    return this.api;
  }

  public static getBiddingToken(tokenAddress: string): Token {
    if (
      Token.tokenRefs[tokenAddress] &&
      Token.tokenRefs[tokenAddress].isBidToken
    ) {
      return Token.tokenRefs[tokenAddress];
    }
    const api = ERC20.create(tokenAddress, getAntenna().iotx, BID_ABI);
    const token = new Token(api);
    token.isBidToken = true;
    Token.tokenRefs[tokenAddress] = token;
    return token;
  }

  public decode(data: string): DecodeData {
    return this.api.decode(data);
  }

  public async checkValid(): Promise<boolean> {
    try {
      const { symbol } = await this.getBasicTokenInfo();
      return `${symbol}`.length > 0;
    } catch (error) {
      return false;
    }
  }

  public async claimableAmount(walletAddress: string): Promise<BigNumber> {
    if (this.api instanceof Vita) {
      return this.api.claimableAmount(walletAddress, walletAddress);
    }
    throw new Error(`Token ${this.api.address} is not Vita!`);
  }

  public async getInfo(walletAddress: string): Promise<ITokenInfo> {
    const api = this.api;
    const [balance, name, symbol, decimals] = await Promise.all<
      BigNumber,
      string,
      string,
      BigNumber
    >([
      api.balanceOf(walletAddress, walletAddress),
      api.name(walletAddress),
      api.symbol(walletAddress),
      api.decimals(walletAddress)
    ]);
    const balanceString = balance
      .dividedBy(new BigNumber(`1e${decimals.toNumber()}`))
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

  public async getBasicTokenInfo(): Promise<ITokenBasicInfo> {
    const api = this.api;
    const cache = xconf.getConf<{ [index: string]: ITokenBasicInfo }>(
      XConfKeys.TOKENS_BASIC_INFOS,
      {}
    );
    if (!cache[api.address] || !cache[api.address].totalSupply) {
      const [name, symbol, decimals, totalSupply] = await Promise.all<
        string,
        string,
        BigNumber,
        BigNumber
      >([
        api.name(api.address),
        api.symbol(api.address),
        api.decimals(api.address),
        api.totalSupply(api.address)
      ]);
      const totalSupplyString = totalSupply
        .dividedBy(new BigNumber(`1e${decimals.toNumber()}`))
        .toString(10);
      cache[api.address] = {
        tokenAddress: this.api.address,
        decimals,
        symbol,
        name,
        totalSupply: totalSupplyString,
        contractAddress: api.contract.getAddress() || ""
      };
      xconf.setConf(XConfKeys.TOKENS_BASIC_INFOS, cache);
    }
    return cache[api.address];
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
      return this.api.claim(account);
    }
    throw new Error(`Token ${this.api.address} is not Vita!`);
  }

  public async estimateClaimGas(account: Account): Promise<IGasEstimation> {
    if (this.api instanceof Vita) {
      return this.api.estimateClaimGas(account);
    }
    throw new Error(`Token ${this.api.address} is not Vita!`);
  }

  public async claimAs(
    authMessage: IAuthorizedMessage,
    account: Account
  ): Promise<string> {
    if (this.api instanceof Vita) {
      const { address, msg, sig } = authMessage;
      const nonce = getNonce(msg, this.api.address.toLowerCase());
      return this.api.claimAs(toIoTeXAddress(address), sig, nonce, account);
    }
    throw new Error(`Token ${this.api.address} is not Vita!`);
  }

  public async estimateClaimAsGas(
    authMessage: IAuthorizedMessage,
    account: Account
  ): Promise<IGasEstimation> {
    if (this.api instanceof Vita) {
      const { address, msg, sig } = authMessage;
      const nonce = getNonce(msg, this.api.address.toLowerCase());
      return this.api.estimateClaimAsGas(
        toIoTeXAddress(address),
        sig,
        nonce,
        account
      );
    }
    throw new Error(`Token ${this.api.address} is not Vita!`);
  }

  public async bid(account: Account, amount: string): Promise<string> {
    if (!this.isBidToken) {
      throw new Error(`Invalid bid token!`);
    }
    const amountRau = toRau(amount, "Iotx");
    const { gasLimit, gasPrice } = await this.estimateBidGas(
      account,
      amountRau
    );
    return this.api.executeMethod(
      "bid",
      account,
      gasPrice,
      gasLimit,
      amountRau
    );
  }

  public async estimateBidGas(
    account: Account,
    amount: string
  ): Promise<IGasEstimation> {
    if (!this.isBidToken) {
      throw new Error(`Invalid bid token!`);
    }
    return this.api.estimateExecutionGas("bid", account, amount);
  }

  public async estimateMaxBidAmount(account: Account): Promise<string> {
    const { accountMeta } = await getAntenna().iotx.getAccount({
      address: account.address
    });
    if (!accountMeta) {
      return "0";
    }
    const { gasLimit, gasPrice } = await this.api.estimateExecutionGas(
      "bid",
      account,
      accountMeta.balance
    );
    const gasNeeded = new BigNumber(gasLimit).multipliedBy(
      new BigNumber(gasPrice)
    );
    return new BigNumber(accountMeta.balance)
      .plus(gasNeeded.negated())
      .toString();
  }
}

export function getNonce(msg: string, address?: string): BigNumber {
  const matches = msg.match(regex);
  if (!matches || matches.length !== 3) {
    throw new Error(t("account.error.invalidAuthorizedMessage"));
  }
  if (address && toIoTeXAddress(matches[2]) !== address) {
    throw new Error(`invalid token address ${matches[2]}`);
  }
  return new BigNumber(matches[1], 10);
}
