import fn from "fromnow";

export function fromNow(ts: number): string {
  // @ts-ignore
  return fn(ts * 1000, { max: 3, suffix: true });
}
