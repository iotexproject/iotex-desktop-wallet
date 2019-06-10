// @ts-ignore
import { t } from "onefx/lib/iso-i18n";

import { ValidationRule } from "antd/lib/form";
import BigNumber from "bignumber.js";

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
  amount: {
    type: "number",
    transform: (value: string) => {
      return new BigNumber(value);
    },
    validator: (_, value: BigNumber, callback) => {
      if (value instanceof BigNumber && value.isGreaterThanOrEqualTo(0)) {
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
    validator: (_, value, callback) => {
      if (!value) {
        callback();
      }
      try {
        const abi = JSON.parse(value);
        if (abi instanceof Array && abi.length) {
          callback();
        } else {
          callback(t("wallet.interact.invalidABI"));
        }
      } catch (error) {
        callback(error.message);
      }
    }
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
  erc20AddressLength: {
    validator: (_, value, callback) => {
      if (String(value).trim().length === 41) {
        callback();
      } else {
        callback(t("input.error.erc20_address.length"));
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
  },
  url: {
    validator: (_, value, callback) => {
      if (
        `${value}`.match(
          /^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
        )
      ) {
        callback();
      } else {
        callback(t("input.error.url.invalid"));
      }
    }
  }
};

export const rulesMap = {
  address: [rules.required, rules.addressLength],
  erc20Address: [rules.required, rules.erc20AddressLength],
  transactionAmount: [rules.required, rules.amount],
  interactAmount: [rules.amount],
  gasLimit: [rules.required, rules.number],
  gasPrice: [rules.required, rules.number],
  abi: [rules.required, rules.abi],
  dataIndex: [],
  nonce: [rules.required],
  password: [rules.required, rules.strongPassword],
  name: [rules.required],
  url: [rules.required, rules.url],

  // ABIDataTypes
  uint256: [rules.number],
  boolean: [rules.boolean],
  string: [],
  bytes: []
} as { [key: string]: Array<ValidationRule> };
