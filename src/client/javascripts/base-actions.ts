import {BaseAction} from "./base-reducer";

export const setSwitchAddress = (
  toEthAddress?: boolean
): BaseAction => ({
  type: "SWITCH_ADDRESS",
  payload: {
    toEthAddress: toEthAddress
  }
});
