// @ts-ignore
import window from "global/window";
import isElectron from "is-electron";
import { MouseEvent } from "react";

export const onElectronClick = (url: string) => (e: MouseEvent): boolean => {
  if (!isElectron()) {
    return true;
  }
  e.preventDefault();
  window.xopen(url);
  return false;
};
