// @flow

import bech32 from 'bech32';

// eslint-disable-next-line max-statements,complexity
function convertBits(words, fromBits, toBits) {
  const regrouped = [];
  let nextByte = 0;
  let filledBits = 0;
  for (let i = 0; i < words.length; i++) {
    let b = words[i];
    b = (b << (8 - fromBits)) & 0xff;
    let remFromBits = fromBits;
    while (remFromBits > 0) {
      const remToBits = toBits - filledBits;
      let toExtract = remFromBits;
      if (remToBits < toExtract) {
        toExtract = remToBits;
      }
      nextByte = ((nextByte << toExtract) & 0xff) | ((b >> (8 - toExtract)) & 0xff);
      b = (b << toExtract) & 0xff;
      remFromBits -= toExtract;
      filledBits += toExtract;
      if (filledBits === toBits) {
        regrouped.push(nextByte);
        filledBits = 0;
        nextByte = 0;
      }
    }
  }
  if (filledBits > 0 && (filledBits > 4 || nextByte !== 0)) {
    return null;
  }
  if (regrouped[0] < 1) {
    return null;
  }
  return regrouped.slice(5, 25);
}

function toHex(i) {
  const hi = Number(i).toString(16);
  if (hi.length < 2) {
    return `0${ hi}`;
  }
  return hi;
}

export function decodeAddress(address: string): {address: string, error: any} {
  try {
    const {prefix, words} = bech32.decode(address);
    if (prefix !== 'io' && prefix !== 'it') {
      return {address: '', error: null};
    }
    const data = convertBits(words, 5, 8);
    if (data === null) {
      return {address: '', error: null};
    }
    let retval = '';
    for (const i of data) {
      retval += toHex(i);
    }
    return {address: retval, error: null};
  } catch (error) {
    // TODO: handle error
    return {address: '', error};
  }
}
