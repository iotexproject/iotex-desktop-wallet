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
  nonce: [rules.required]
};
