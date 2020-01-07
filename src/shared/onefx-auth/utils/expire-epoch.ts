export function getExpireEpoch(minutes: number): number {
  return Date.now() + minutes * 60 * 1000;
}

export function getExpireEpochDays(days: number): number {
  return Date.now() + days * 24 * 60 * 60 * 1000;
}
