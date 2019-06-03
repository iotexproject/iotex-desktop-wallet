import BigNumber from "bignumber.js";
import { getAntenna } from "../shared/wallet/get-antenna";
import { ERC20, IERC20 } from "./erc20";

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
  constructor(erc20TokenAddress: string) {
    this.erc20 = ERC20.create(erc20TokenAddress, getAntenna().iotx);
  }

  public async getInfo(walletAddress: string): Promise<IERC20TokenInfo | null> {
    const erc20 = this.erc20;
    try {
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
        .toString();
      return {
        erc20TokenAddress: this.erc20.address,
        balance,
        decimals,
        symbol,
        name,
        balanceString
      };
    } catch (error) {
      return null;
    }
  }
}
