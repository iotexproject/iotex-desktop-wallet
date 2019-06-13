import { Account } from "iotex-antenna/lib/account/account";
import { IERC20TokenInfoDict } from "../../erc20/erc20Token";

export type QueryType = "CONTRACT_INTERACT";

export type QueryParams = {
  amount?: number;
  gasPrice?: string;
  gasLimit?: number;
  abi?: string;
  type?: QueryType;
  queryNonce?: number;
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
  type:
    | "SET_ACCOUNT"
    | "SET_NETWORK"
    | "ADD_CUSTOM_RPC"
    | "UPDATE_ERC20_TOKENS";
  payload: {
    account?: Account;
    network?: IRPCProvider;
    customRPC?: IRPCProvider;
    erc20Tokens?: IERC20TokenInfoDict;
    defaultNetworkTokens?: Array<string>;
  };
};

export interface IWalletState {
  account?: Account;
  network?: IRPCProvider;
  customRPCs: Array<IRPCProvider>;
  erc20Tokens: IERC20TokenInfoDict;
  defaultNetworkTokens: Array<string>;
}

export const walletReducer = (
  state: IWalletState = {
    customRPCs: [],
    defaultNetworkTokens: [],
    erc20Tokens: {}
  },
  action: WalletAction
) => {
  switch (action.type) {
    case "SET_ACCOUNT":
      const { account } = action.payload;
      return { ...state, account };
    case "ADD_CUSTOM_RPC":
      const { customRPC } = action.payload;
      if (!customRPC) {
        return state;
      }
      const rpc = state.customRPCs.find(rpc => rpc.url === customRPC.url);
      if (rpc) {
        rpc.name = customRPC.name;
        return { ...state };
      }
      return {
        ...state,
        customRPCs: [...state.customRPCs, customRPC]
      };
    case "SET_NETWORK":
      return {
        ...state,
        network: action.payload.network,
        defaultNetworkTokens: action.payload.defaultNetworkTokens
      };
    case "UPDATE_ERC20_TOKENS":
      return {
        ...state,
        erc20Tokens: action.payload.erc20Tokens
      };
    default:
      return state;
  }
};
