import { Account } from "iotex-antenna/lib/account/account";
import { ITokenInfoDict } from "../../erc20/token";

export type QueryType = "CONTRACT_INTERACT";

export type QueryParams = {
  amount?: number;
  gasPrice?: string;
  gasLimit?: number;
  abi?: string;
  type?: QueryType;
  queryNonce?: number;
  contractAddress?: string;
  method?: string;
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
  type: "SET_ACCOUNT" | "SET_NETWORK" | "ADD_CUSTOM_RPC" | "UPDATE_TOKENS";
  payload: {
    account?: Account;
    network?: IRPCProvider;
    customRPC?: IRPCProvider;
    tokens?: ITokenInfoDict;
    defaultNetworkTokens?: Array<string>;
  };
};

export interface IWalletState {
  account?: Account;
  network?: IRPCProvider;
  customRPCs: Array<IRPCProvider>;
  tokens: ITokenInfoDict;
  defaultNetworkTokens: Array<string>;
}

export const walletReducer = (
  state: IWalletState = {
    customRPCs: [],
    defaultNetworkTokens: [],
    tokens: {}
  },
  action: WalletAction
) => {
  switch (action.type) {
    case "SET_ACCOUNT":
      const { account } = action.payload;
      if (!account) {
        return state;
      }
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
    case "UPDATE_TOKENS":
      return {
        ...state,
        tokens: action.payload.tokens
      };
    default:
      return state;
  }
};
