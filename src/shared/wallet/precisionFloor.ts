import BN from "bignumber.js";
import numeral from "numeral";

type Option = { decimals?: number; format?: string };
const countNonZeroNumbers = (str: string) => {
  let index = 0;
  length = str.length;
  // TODO: Need more readble code, like:
  // while (index < length && (str[index] === "0" || str[index] === ".")) {
  //   index += 1;
  // }
  // tslint:disable-next-line:curly
  for (
    ;
    index < length && (str[index] === "0" || str[index] === ".");
    index += 1
  );
  return length - index - Number(str.includes("."));
};
export const toPrecisionFloor = (
  str: number | string,
  options: Option = { decimals: 6, format: "" }
) => {
  const { decimals, format } = options;
  if (!str || isNaN(Number(str))) {
    return "";
  }
  if (countNonZeroNumbers(String(str)) <= Number(decimals)) {
    return String(str);
  }
  const numStr = new BN(str).toFixed();
  let result = "";
  let index = 0;
  const numLength = numStr.length;

  // tslint:disable-next-line:curly
  for (; numStr[index] === "0" && index < numLength; index += 1);

  if (index === numLength) {
    return "0";
  }

  if (numStr[index] === ".") {
    // number < 0
    result = "0";
    for (
      ;
      (numStr[index] === "0" || numStr[index] === ".") && index < numLength;
      index += 1
    ) {
      result = result + numStr[index];
    }
  }
  let resultNumLength = 0;
  for (
    ;
    index < numLength &&
    (resultNumLength < Number(decimals) || !result.includes("."));
    index += 1
  ) {
    result = result + numStr[index];

    if (numStr[index] !== ".") {
      resultNumLength += 1;
    }
  }
  if (format) {
    return numeral(Number(result)).format(format);
  }

  return new BN(result).toFixed();
};
