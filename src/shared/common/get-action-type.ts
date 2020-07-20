import { get } from "dottie";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import { ActionInfo } from "../../api-gateway/resolvers/antenna-types";

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
