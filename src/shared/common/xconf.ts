// @ts-ignore
import window from "global/window";

// tslint:disable: no-any
const tmpdata: { [index: string]: any } = {};

// The xconf is a polyfill for user configurations used by electron.
export const xconf: {
  getConf(name: string, defaultvalue?: any): any;
  setConf(name: string, value: any): boolean;
} = window.xconf || {
  getConf: (name: string, defaultvalue?: any): any => {
    return tmpdata[name] || defaultvalue;
  },
  setConf: (name: string, value: any): boolean => {
    tmpdata[name] = value;
    return true;
  }
};
