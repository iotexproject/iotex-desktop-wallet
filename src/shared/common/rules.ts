// @ts-ignore
import { t } from "onefx/lib/iso-i18n";

import { ValidationRule } from "antd/lib/form";

interface Rules {
  [key: string]: ValidationRule;
}

export const rules: Rules = {
  required: {
    required: true,
    validator: (_, value, callback) => {
      if (value) {
        callback();
      } else {
        callback(t("wallet.error.required"));
      }
    }
  },
  number: {
    type: "number",
    transform: (value: string) => {
      return Number(value);
    },
    validator: (_, value, callback) => {
      if (typeof value === "number") {
        callback();
      } else {
        callback(t("wallet.error.number"));
      }
    }
  },
  boolean: {
    type: "boolean",
    transform: (value: string) => {
      return value === "true";
    },
    validator: (_, value, callback) => {
      if (typeof value === "boolean") {
        callback();
      } else {
        callback(t("wallet.error.boolean"));
      }
    }
  },
  abi: {
    message: t("wallet.interact.invalidABI")
  },
  addressLength: {
    validator: (_, value, callback) => {
      if (String(value).trim().length === 41) {
        callback();
      } else {
        callback(t("input.error.raw_address.length"));
      }
    }
  },
  strongPassword: {
    validator: (_, value, callback) => {
      if (String(value).length <= 6) {
        callback(t("input.error.password.too_weak"));
      }

      callback();
    }
  }
};

export const rulesMap = {
  address: [rules.required, rules.addressLength],
  amount: [rules.number],
  gasLimit: [rules.required, rules.number],
  gasPrice: [rules.required, rules.number],
  abi: [rules.required, rules.abi],
  dataIndex: [],
  nonce: [rules.required],
  password: [rules.required, rules.strongPassword],

  // ABIDataTypes
  uint256: [rules.number],
  boolean: [rules.boolean],
  string: [],
  bytes: []
} as { [key: string]: Array<ValidationRule> };
