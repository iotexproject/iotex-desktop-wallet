// @ts-ignore
import window from "global/window";

export type XConfKeyTypes =
  | "keystores"
  | "last_used_keystore_name"
  | "tokens_address"
  | "last_interact_contract"
  | "whitelists";

// tslint:disable: no-any
const tmpdata: { [index in XConfKeyTypes]?: any } = {};
// The xconf is a polyfill for user configurations used by electron.
export const xconf: {
  getConf<T>(name: string, defaultvalue?: T): T;
  setConf<T>(name: string, value: T): boolean;
} = window.xconf || {
  getConf: <T>(name: XConfKeyTypes, defaultvalue?: T): T => {
    try {
      const value = window.localStorage.getItem(name);
      if (value) {
        return JSON.parse(value);
      }
      return defaultvalue as T;
    } catch (e) {
      return tmpdata[name] || defaultvalue;
    }
  },
  setConf: <T>(name: XConfKeyTypes, value: T): boolean => {
    try {
      window.localStorage.setItem(name, JSON.stringify(value));
    } catch (e) {
      tmpdata[name] = value;
    }
    return true;
  }
};
window.xconf = xconf;

export enum XConfKeys {
  KEYSTORES = "keystores",
  LAST_USED_KEYSTORE_NAME = "last_used_keystore_name",
  TOKENS_ADDRS = "tokens_address",
  LAST_INTERACT_CONTRACT = "last_interact_contract",
  WHITELISTS = "whitelists"
}
