import { Account } from "iotex-antenna/lib/account/account";
import { IERC20TokenInfoDict } from "../../erc20/erc20Token";

export type QueryType = "CONTRACT_INTERACT";

export type QueryParams = {
  amount?: number;
  gasPrice?: string;
  gasLimit?: number;
  abi?: string;
  type?: QueryType;
};

type QueryParamAction = {
  type: "QUERY_PARAMS";
  payload: QueryParams;
};

export const queryParamsReducer = (
  state: {} = {},
  action: QueryParamAction
) => {
  if (action.type === "QUERY_PARAMS") {
    return {
      ...state,
      ...action.payload
    };
  }
  return state || {};
};

export interface IRPCProvider {
  name: string;
  url: string;
}

export type WalletAction = {
  type: "SET_WALLET" | "SET_NETWORK" | "ADD_CUSTOM_RPC" | "UPDATE_ERC20_TOKENS";
  payload: {
    account?: Account;
    network?: string;
    customRPC?: Array<IRPCProvider>;
    erc20Tokens?: IERC20TokenInfoDict;
  };
};

export type WalletState = {
  account?: Account;
  network?: string;
  customRPC?: Array<IRPCProvider>;
  erc20Tokens?: IERC20TokenInfoDict;
};

export const walletReducer = (
  state: WalletState = {},
  action: WalletAction
) => {};
