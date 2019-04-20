// @ts-ignore
import { t } from "onefx/lib/iso-i18n";

import { ValidationRule } from "antd/lib/form";

interface Rules {
  [key: string]: ValidationRule;
}

export const rules: Rules = {
  required: {
    required: true,
    message: t("wallet.error.required")
  },
  number: {
    type: "number",
    message: t("wallet.error.number"),
    transform: (value: string) => {
      return Number(value);
    }
  },
  boolean: {
    type: "boolean",
    message: t("wallet.error.boolean"),
    transform: (value: string) => {
      return value === "true";
    }
  },
  abi: {
    message: t("wallet.interact.invalidABI")
  },
  addressLength: {
    len: 41,
    message: t("input.error.raw_address.length")
  }
};

export const rulesMap = {
  address: [rules.required, rules.addressLength],
  amount: [rules.required, rules.number],
  gasLimit: [rules.required, rules.number],
  gasPrice: [rules.required, rules.number],
  abi: [rules.required, rules.abi],
  dataIndex: [],
  nonce: [rules.required],

  // ABIDataTypes
  uint256: [rules.number],
  boolean: [rules.boolean],
  string: [],
  bytes: []
} as { [key: string]: Array<ValidationRule> };
