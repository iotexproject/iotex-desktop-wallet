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
  content?: string; // message
  envelop?: string;
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
    | "UPDATE_TOKENS"
    | "SET_LOCK_TIME"
    | "SET_MODAL_GATE"
    | "OPEN_MODAL_GATE"
    | "DELAY_LOCK";
  payload: {
    account?: Account;
    network?: IRPCProvider;
    customRPC?: IRPCProvider;
    tokens?: ITokenInfoDict;
    defaultNetworkTokens?: Array<string>;
    lockAt?: number;
    isLockDelayed?: boolean;
    modalGate?: number; // desktop wallet modal logic gate; 0-0-0 correspond to isWhitelistModalForbidden-isWhitelistModalShow-isSignAndSendModalShow
  };
};

export interface IWalletState {
  account?: Account;
  network?: IRPCProvider;
  customRPCs: Array<IRPCProvider>;
  tokens: ITokenInfoDict;
  defaultNetworkTokens: Array<string>;
  lockAt?: number; // milliseconds to lock wallet. 0: never lock. 1: never to reset it;
  isLockDelayed?: boolean;
  modalGate?: number;
}

export const walletReducer = (
  state: IWalletState = {
    customRPCs: [],
    defaultNetworkTokens: [],
    tokens: {},
    lockAt: 0,
    isLockDelayed: false,
    modalGate: 1 << 2
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
    case "SET_MODAL_GATE":
      return {
        ...state,
        modalGate: action.payload.modalGate
      };
    case "OPEN_MODAL_GATE": {
      const { modalGate } = state;

      return {
        ...state,
        modalGate: (modalGate as number) < 1 << 2 ? 1 : 1 << 1
      };
    }

    default:
      return state;
  }
};
