const PRIVATE_KEY_LENGTH = 72;
const PRIVATE_KEY_LENGTH_V2 = 64;
const RAW_ADDRESS_LENGTH = 49;
const RAW_ADDRESS_LENGTH_V2 = 41;

const PRIVATE_KEY_REGEX = /^[A-Za-z0-9]+$/;
const RAW_ADDRESS_REGEX = /^io[A-Za-z0-9]+$/;
const INTEGER_REGEX = /^[0-9]+$/;
const FLOAT_REGEX = /^[0-9]*\.?[0-9]*$/;
const BYTE_REGEX = /^(0x|)[A-Fa-f0-9]+$/;
const INT_REGEX = /.*int.*/;

export function isValidJSON(str: string): string | null {
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
}

export function isValidPrivateKey(str: string): string {
  if (
    str.length !== PRIVATE_KEY_LENGTH &&
    str.length !== PRIVATE_KEY_LENGTH_V2
  ) {
    return "input.error.private_key.length";
  }
  if (str.match(PRIVATE_KEY_REGEX)) {
    return "";
  }
  return "input.error.private_key.invalid";
}

export function isValidRawAddress(str: string): string {
  if (
    str.length !== RAW_ADDRESS_LENGTH &&
    str.length !== RAW_ADDRESS_LENGTH_V2
  ) {
    return "input.error.raw_address.length";
  }
  if (str.match(RAW_ADDRESS_REGEX)) {
    return "";
  }
  return "input.error.raw_address.invalid";
}

export function onlyFloat(str: string): string {
  if (str.length === 0) {
    return "input.error.number.length";
  }
  if (str.match(FLOAT_REGEX)) {
    return "";
  }
  return "input.error.number.invalid";
}

export function onlyNumber(str: string): string {
  if (str.length === 0) {
    return "input.error.number.length";
  }
  if (str.match(INTEGER_REGEX)) {
    return "";
  }
  return "input.error.float.invalid";
}

export function isValidBytes(str: string): string {
  if (str.length % 2 !== 0) {
    return "input.error.bytes.length";
  }
  if (str === "0x" || str.match(BYTE_REGEX)) {
    return "";
  }
  return "input.error.bytes.invalid";
}

export function isINTType(str: string): RegExpMatchArray | null {
  return str.match(INT_REGEX);
}

export function acceptableNonce(nonce: string, currentNonce: string): string {
  if (parseInt(nonce, 10) > parseInt(currentNonce, 10)) {
    return "";
  }
  return "input.error.nonceTooLow";
}
