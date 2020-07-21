// @ts-ignore
import window from "global/window";
import isElectron from "is-electron";
import { t } from "onefx/lib/iso-i18n";
import { MouseEvent } from "react";

export const onElectronClick = (url: string) => (e: MouseEvent): boolean => {
  if (!isElectron()) {
    return true;
  }
  e.preventDefault();
  window.xopen(url);
  return false;
};

export const getIoPayDesktopVersionName = (
  prefix: string = "wallet.desktop.app"
) => {
  if (!isElectron() || !window.getAppInfo) {
    return "";
  }
  const appInfo = window.getAppInfo();
  const appVersion = appInfo.appVersion;
  return `${t(prefix, { appVersion })}`;
};
