const observers: Array<string> = [];

export function addSubscription(email: string): Promise<boolean> {
  observers.push(email);

  return Promise.resolve(true);
}
