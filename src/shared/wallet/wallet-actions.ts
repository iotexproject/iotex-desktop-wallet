import { Account } from "iotex-antenna/lib/account/account";
import { ITokenInfoDict } from "../../erc20/token";
import { IRPCProvider, WalletAction } from "./wallet-reducer";

export const setNetwork = (
  network: IRPCProvider,
  defaultNetworkTokens: Array<string> = []
): WalletAction => {
  return {
    type: "SET_NETWORK",
    payload: {
      network,
      defaultNetworkTokens
    }
  };
};

export const addCustomRPC = (network: IRPCProvider): WalletAction => ({
  type: "ADD_CUSTOM_RPC",
  payload: {
    customRPC: network
  }
});

export const setAccount = (account?: Account): WalletAction => ({
  type: "SET_ACCOUNT",
  payload: {
    account
  }
});

export const setTokens = (tokens: ITokenInfoDict): WalletAction => ({
  type: "UPDATE_TOKENS",
  payload: {
    tokens
  }
});

/**
 * Default after 2 hours;
 */
export const setLockTime = (after = 2 * 60 * 60 * 1000): WalletAction => {
  const lockAt = after === 0 ? 0 : Date.now() + after;

  return {
    type: "SET_LOCK_TIME",
    payload: {
      lockAt
    }
  };
};

export const forbidSetLockAt = (isLockAtLocked: boolean): WalletAction => ({
  type: "FORBID_RESET_LOCK_AT",
  payload: {
    isLockAtLocked
  }
});
