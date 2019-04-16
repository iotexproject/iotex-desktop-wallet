import fn from "fromnow";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import { Timestamp } from "../../api-gateway/resolvers/antenna-types";

export function fromNow(ts: Timestamp | undefined): string {
  if (!ts) {
    return "";
  }
  return fn(new Date(ts.seconds * 1000), { max: 3, suffix: true });
}

export function translateFn(ts: Timestamp): string {
  const keyMessage = [
    "years",
    "year",
    "months",
    "month",
    "days",
    "day",
    "hours",
    "hour",
    "minutes",
    "minute",
    "ago",
    "just now"
  ];
  let text = fromNow(ts);
  keyMessage.map(value => {
    text = text.replace(value, t(`time.fn.${value.replace(" ", "")}`));
  });
  return text;
}
