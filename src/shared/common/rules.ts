// @ts-ignore
import { t } from "onefx/lib/iso-i18n";

import { ValidationRule } from "antd/lib/form";
import BigNumber from "bignumber.js";
import { getNonce } from "../../erc20/token";
import { IAuthorizedMessage } from "../../erc20/vita";

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
  numberGe1: {
    type: "number",
    transform: (value: string) => {
      return Number(value);
    },
    validator: (_, value, callback) => {
      if (typeof value === "number") {
        if (value >= 1) callback();
        else callback(t("wallet.error.number-ge1"));
      } else {
        callback(t("wallet.error.number"));
      }
    }
  },
  interger: {
    transform: (value: string) => {
      return new BigNumber(value);
    },
    validator: (_, value, callback) => {
      if (value instanceof BigNumber && value.isInteger()) {
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
  authMessage: {
    transform: (value: string): IAuthorizedMessage | null => {
      try {
        return JSON.parse(value);
      } catch (e) {
        return null;
      }
    },
    validator: (_, value: IAuthorizedMessage, callback) => {
      if (value && value.address && value.msg && value.sig && value.version) {
        try {
          getNonce(value.msg);
        } catch (e) {
          return callback(e);
        }
        callback();
      } else {
        callback(t("account.error.invalidAuthorizedMessage"));
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
  tokenAddressLength: {
    validator: (_, value, callback) => {
      if (String(value).trim().length === 41) {
        callback();
      } else {
        callback(t("input.error.xrc20_address.length"));
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
  tokenAddress: [rules.required, rules.tokenAddressLength],
  transactionAmount: [rules.required, rules.amount],
  interactAmount: [rules.amount],
  gasLimit: [rules.required, rules.number],
  gasPrice: [rules.required, rules.numberGe1],
  abi: [rules.abi],
  dataIndex: [],
  nonce: [rules.required, rules.interger],
  password: [rules.required, rules.strongPassword],
  name: [rules.required],
  url: [rules.required, rules.url],
  authMessage: [rules.required, rules.authMessage],

  // ABIDataTypes
  uint256: [rules.number],
  boolean: [rules.boolean],
  string: [],
  bytes: []
} as { [key: string]: Array<ValidationRule> };
