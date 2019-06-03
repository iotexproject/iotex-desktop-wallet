// @ts-ignore
import Avatar from "antd/lib/avatar";
import Card from "antd/lib/card";
import Form from "antd/lib/form/Form";
import { WrappedFormUtils } from "antd/lib/form/Form";
import Icon from "antd/lib/icon";
import Input from "antd/lib/input";
import InputNumber from "antd/lib/input-number";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import React from "react";
import { Link } from "react-router-dom";
import { Flex } from "../../common/flex";
import { formItemLayout } from "../../common/form-item-layout";
import { rulesMap } from "../../common/rules";
import { colors } from "../../common/styles/style-color";
import { inputStyle } from "../wallet";

const { TextArea } = Input;

type CardFunctionProps = {
  title: string;
  description: string;
  redirectUrl: string;
  imageSrc: string;
  moreUrl: string;
};

const ICON_SIZE = 168;

const cardStyle = {
  maxWidth: 310,
  borderRadius: "4px",
  boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.16)",
  margin: "10px 5px"
};

export const FormItemLabel = styled("label", {
  fontWeight: "bold"
});

export const CardFunction = ({
  title,
  description,
  redirectUrl,
  imageSrc,
  moreUrl
}: CardFunctionProps): JSX.Element => (
  <Card style={cardStyle}>
    <Flex column={true}>
      <Link to={redirectUrl}>
        <Avatar
          src={imageSrc}
          size={ICON_SIZE}
          shape={"square"}
          style={{ margin: "20px" }}
        />
      </Link>
      <h3 style={{ fontSize: "1.2em", fontWeight: "bold" }}>{title}</h3>
      <p style={{ color: colors.black60 }}>{description}</p>
      {moreUrl && (
        <Link to={moreUrl} style={{ color: colors.secondary }}>
          <Flex alignItems={"end"}>
            <span>{t("wallet.contract.learn")}</span>
            <Icon type={"right"} style={{ fontSize: "12px", padding: "6px" }} />
          </Flex>
        </Link>
      )}
    </Flex>
  </Card>
);

export function AbiFormInputItem(
  form: WrappedFormUtils,
  initialValue?: string,
  onChange?: React.ChangeEventHandler
): JSX.Element {
  const { getFieldDecorator } = form;
  return (
    <Form.Item
      {...formItemLayout}
      label={<FormItemLabel>{t("wallet.input.abi")}</FormItemLabel>}
    >
      {getFieldDecorator("abi", {
        initialValue: initialValue || "",
        rules: rulesMap.abi
      })(
        <TextArea
          rows={4}
          style={inputStyle}
          placeholder={t("wallet.interact.abiTemplate")}
          onChange={onChange}
        />
      )}
    </Form.Item>
  );
}

export function NonceFormInputItem(
  form: WrappedFormUtils,
  initialValue?: string | number
): JSX.Element {
  const { getFieldDecorator } = form;
  return (
    <Form.Item
      {...formItemLayout}
      label={<FormItemLabel>{t("wallet.input.nonce")}</FormItemLabel>}
    >
      {getFieldDecorator("nonce", {
        initialValue: initialValue || "",
        rules: rulesMap.nonce
      })(<InputNumber size="large" step={1} min={1} style={inputStyle} />)}
    </Form.Item>
  );
}

export function GasPriceFormInputItem({
  form,
  initialValue
}: {
  form: WrappedFormUtils;
  initialValue?: string;
}): JSX.Element {
  const { getFieldDecorator } = form;
  return (
    <Form.Item
      {...formItemLayout}
      label={<FormItemLabel>{t("wallet.input.gasPrice")}</FormItemLabel>}
    >
      {getFieldDecorator("gasPrice", {
        initialValue: initialValue || "1",
        rules: rulesMap.gasPrice
      })(
        <Input
          className="form-input"
          placeholder="0"
          name="gasPrice"
          addonAfter="Qev"
        />
      )}
    </Form.Item>
  );
}

export function GasLimitFormInputItem({
  form,
  initialValue
}: {
  form: WrappedFormUtils;
  initialValue?: number;
}): JSX.Element {
  const { getFieldDecorator } = form;
  return (
    <Form.Item
      {...formItemLayout}
      label={<FormItemLabel>{t("wallet.input.gasLimit")}</FormItemLabel>}
    >
      {getFieldDecorator("gasLimit", {
        initialValue: initialValue || "10000",
        rules: rulesMap.gasLimit
      })(
        <Input
          className="form-input"
          placeholder="0"
          name="gasLimit"
          addonAfter="Rau"
        />
      )}
    </Form.Item>
  );
}

export function AmountFormInputItem({
  form,
  initialValue,
  symbol = "IOTX"
}: {
  form: WrappedFormUtils;
  initialValue?: number;
  symbol?: string;
}): JSX.Element {
  const { getFieldDecorator } = form;
  return (
    <Form.Item
      label={<FormItemLabel>{t("wallet.input.amount")} </FormItemLabel>}
      {...formItemLayout}
    >
      {getFieldDecorator("amount", {
        initialValue: initialValue,
        rules: rulesMap.amount
      })(
        <Input
          className="form-input"
          placeholder="1"
          addonAfter={symbol}
          name="amount"
        />
      )}
    </Form.Item>
  );
}

export function PasswordFormInputItem({
  form,
  initialValue
}: {
  form: WrappedFormUtils;
  initialValue?: number;
}): JSX.Element {
  const { getFieldDecorator } = form;
  return (
    <Form.Item
      label={<FormItemLabel>{t("wallet.input.password")}</FormItemLabel>}
    >
      {getFieldDecorator("password", {
        initialValue: initialValue,
        rules: rulesMap.password
      })(
        <Input.Password
          className="form-input"
          name="password"
          autoComplete="on"
        />
      )}
    </Form.Item>
  );
}
