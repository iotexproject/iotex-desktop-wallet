// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import { Timestamp } from "../../api-gateway/resolvers/antenna-types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
dayjs.extend(relativeTime);
dayjs.extend(utc);

export function fromNow(ts: Timestamp | undefined): string {
  if (!ts) {
    return "";
  }
  return dayjs.utc(ts.seconds * 1000).fromNow();
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
  if (text.includes(t(`time.fn.hour`)) || text.includes(t(`time.fn.hours`))) {
    return text.replace(/^an?/, "1");
  }
  return text.replace(/^an?/, "a");
}
