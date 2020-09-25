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
  args?: string; // JSON of Array<any>
};

type QueryParamAction = {
  type: "QUERY_PARAMS";
  payload: QueryParams;
};

export type SignParams = {
  reqId?: number;
  type?: "SIGN_AND_SEND" | "GET_ACCOUNTS" | "SIGN_MSG";
  msg?: string;
  content?: string; // message
  envelop?: string;
  method?: string | Array<string>;
  origin?: string;
};

export type SignParamAction = {
  type: "SIGN_PARAMS";
  payload: SignParams;
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

export const signParamsReducer = (state: {} = {}, action: SignParamAction) => {
  if (action.type === "SIGN_PARAMS") {
    return {
      ...state,
      ...action.payload
    };
  }
  if (action.type === "CLEAR_SIGN_MSG") {
    return {
      ...state,
      type: "",
      msg: ""
    };
  }
  return state || {};
};

export interface IRPCProvider {
  name: string;
  url: string;
  coreUrl: string;
}

export function actionClearSignMsg(): { type: "CLEAR_SIGN_MSG" } {
  return {
    type: "CLEAR_SIGN_MSG"
  };
}

export type WalletAction = {
  type:
    | "SET_ACCOUNT"
    | "SET_NETWORK"
    | "ADD_CUSTOM_RPC"
    | "UPDATE_TOKENS"
    | "SET_LOCK_TIME"
    | "SET_ORIGIN"
    | "DELAY_LOCK";
  payload: {
    account?: Account;
    hideExport?: boolean;
    network?: IRPCProvider;
    customRPC?: IRPCProvider;
    tokens?: ITokenInfoDict;
    defaultNetworkTokens?: Array<string>;
    lockAt?: number;
    isLockDelayed?: boolean;
  };
};

export interface IWalletState {
  account?: Account;
  hideExport?: boolean;
  network?: IRPCProvider;
  customRPCs: Array<IRPCProvider>;
  tokens: ITokenInfoDict;
  defaultNetworkTokens: Array<string>;
  lockAt?: number; // milliseconds to lock wallet. 0: never lock. 1: never to reset it;
  isLockDelayed?: boolean;
  showUnlockModal?: boolean;
}

export const walletReducer = (
  state: IWalletState = {
    customRPCs: [],
    defaultNetworkTokens: [],
    tokens: {},
    lockAt: 0,
    isLockDelayed: false
  },
  action: WalletAction
) => {
  switch (action.type) {
    case "SET_ACCOUNT":
      const { account, hideExport } = action.payload;
      return { ...state, account, hideExport };
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
    case "SET_LOCK_TIME":
      return {
        ...state,
        lockAt: action.payload.lockAt
      };
    case "DELAY_LOCK":
      return {
        ...state,
        isLockDelayed: action.payload.isLockDelayed
      };
    default:
      return state;
  }
};
