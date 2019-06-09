import { Account } from "iotex-antenna/lib/account/account";
import { IERC20TokenInfoDict } from "../../erc20/erc20Token";
import { IRPCProvider, WalletAction } from "./wallet-reducer";

export const setNetwork = (network: IRPCProvider): WalletAction => {
  return {
    type: "SET_NETWORK",
    payload: {
      network
    }
  };
};

export const addCustomRPC = (network: IRPCProvider): WalletAction => ({
  type: "ADD_CUSTOM_RPC",
  payload: {
    customRPC: network
  }
});

export const setAccount = (account: Account): WalletAction => ({
  type: "SET_ACCOUNT",
  payload: {
    account
  }
});

export const setERC20Tokens = (
  erc20Tokens: IERC20TokenInfoDict
): WalletAction => ({
  type: "UPDATE_ERC20_TOKENS",
  payload: {
    erc20Tokens
  }
});
