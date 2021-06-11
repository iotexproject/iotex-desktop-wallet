export type BaseAction = {
  type:
    | "SWITCH_ADDRESS"
  payload: {
    toEthAddress?: boolean;
  };
};

export const baseReducer = (
  state = {},
  action: BaseAction
) => {
  switch (action.type) {
    case "SWITCH_ADDRESS":
      const { toEthAddress } = action.payload;
      return { ...state, toEthAddress };
    default:
      return state;
  }
};
