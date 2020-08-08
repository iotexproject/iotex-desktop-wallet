import { get } from "dottie";
import { Envelop } from "iotex-antenna/lib/action/envelop";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import { ActionInfo } from "../../api-gateway/resolvers/antenna-types";
import { Dict } from "./types";

export const actionsTypes = [
  "execution",
  "grantReward",
  "transfer",
  "depositToRewardingFund",
  "claimFromRewardingFund",
  "putBlock",
  "createDeposit",
  "settleDeposit",
  "putPollResult",
  "stakeCreate",
  "stakeUnstake",
  "stakeWithdraw",
  "stakeAddDeposit",
  "stakeRestake",
  "stakeChangeCandidate",
  "stakeTransferOwnership",
  "candidateRegister",
  "candidateUpdate"
];

export function getActionType(info: ActionInfo | {}): string {
  for (let i = 0; i < actionsTypes.length; i++) {
    if (get(info, `action.core.${actionsTypes[i]}`)) {
      return t(`action.type.${actionsTypes[i]}`);
    }
  }
  return "";
}

export function getActionTypeInEnvelop(envelop: Envelop): Dict {
  for (let i = 0; i < actionsTypes.length; i++) {
    if (get(envelop, actionsTypes[i])) {
      return {
        method: actionsTypes[i],
        ...(get(envelop, actionsTypes[i]) || {})
      };
    }
  }
  return {};
}
