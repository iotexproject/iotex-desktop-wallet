import { get } from "dottie";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import { ActionInfo } from "../../api-gateway/resolvers/antenna-types";

export function getActionType(info: ActionInfo | {}): string {
  if (get(info, "action.core.transfer")) {
    return t("action.type.transfer");
  }
  if (get(info, "action.core.execution")) {
    return t("action.type.execution");
  }
  if (get(info, "action.core.grantReward")) {
    return t("action.type.grant_reward");
  }
  return "";
}
