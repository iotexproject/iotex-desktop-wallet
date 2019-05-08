// @ts-ignore
import window from "global/window";

// tslint:disable: no-any
const tmpdata: { [index: string]: any } = {};
// The xconf is a polyfill for user configurations used by electron.
export const xconf: {
  getConf<T>(name: string, defaultvalue?: T): T;
  setConf<T>(name: string, value: T): boolean;
} = window.xconf || {
  getConf: (name: string, defaultvalue?: any): any => {
    return tmpdata[name] || defaultvalue;
  },
  setConf: (name: string, value: any): boolean => {
    tmpdata[name] = value;
    return true;
  }
};

export enum XConfKeys {
  KEYSTORES = "keystores",
  LAST_USED_KEYSTORE_NAME = "last_used_keystore_name"
}
