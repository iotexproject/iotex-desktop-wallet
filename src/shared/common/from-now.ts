import fn from "fromnow";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";

export function fromNow(ts: number): string {
  // @ts-ignore
  return fn(ts * 1000, { max: 3, suffix: true });
}

export function translateFn(ts: number): string {
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
