/* tslint:disable:no-any */
import isElectron from "is-electron";

let m: any = {};

export function initAssetURL(manifest: any = {}): void {
  m = manifest || {};
}

export function assetURL(filename: string): string {
  if (isElectron()) {
    return `https://iotexscan.io/${filename}`;
  }

  const manifestFile = m[filename];
  if (manifestFile) {
    return `/${manifestFile}`;
  }

  return filename;
}
