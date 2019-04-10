// @ts-ignore
import { Avatar, Card, Form, Icon, Input, InputNumber } from "antd";
import { WrappedFormUtils } from "antd/lib/form/Form";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import React from "react";
import { Link } from "react-router-dom";
import { Flex } from "../common/flex";
import { formItemLayout } from "../common/form-item-layout";
import { colors } from "../common/styles/style-color";
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
  margin: "10px 0"
};

export const inputStyle = {
  width: "100%",
  background: "#f7f7f7",
  border: "none"
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
      <Link to={moreUrl} style={{ color: colors.secondary }}>
        <Flex alignItems={"end"}>
          <span>{t("wallet.contract.learn")}</span>
          <Icon type={"right"} style={{ fontSize: "12px", padding: "6px" }} />
        </Flex>
      </Link>
    </Flex>
  </Card>
);

export function AbiFormInputItem(form: WrappedFormUtils): JSX.Element {
  const { getFieldDecorator } = form;
  return (
    <Form.Item
      {...formItemLayout}
      label={<FormItemLabel>{t("wallet.input.abi")}</FormItemLabel>}
    >
      {getFieldDecorator("abi", {
        initialValue: "",
        rules: []
      })(
        <TextArea
          rows={4}
          style={inputStyle}
          placeholder={t("wallet.placeholder.abi")}
        />
      )}
    </Form.Item>
  );
}

export function NonceFormInputItem(form: WrappedFormUtils): JSX.Element {
  const { getFieldDecorator } = form;
  return (
    <Form.Item
      {...formItemLayout}
      label={<FormItemLabel>{t("wallet.input.nonce")}</FormItemLabel>}
    >
      {getFieldDecorator("nonce", {
        initialValue: "",
        rules: []
      })(<InputNumber size="large" step={1} min={1} style={inputStyle} />)}
    </Form.Item>
  );
}

export function GasPriceFormInputItem(form: WrappedFormUtils): JSX.Element {
  const { getFieldDecorator } = form;
  return (
    <Form.Item
      {...formItemLayout}
      label={<FormItemLabel>{t("wallet.input.gasPrice")}</FormItemLabel>}
    >
      {getFieldDecorator("gasPrice", {
        initialValue: "",
        rules: []
      })(<InputNumber size="large" step={10} min={0} style={inputStyle} />)}
    </Form.Item>
  );
}

export function GasLimitFormInputItem(form: WrappedFormUtils): JSX.Element {
  const { getFieldDecorator } = form;
  return (
    <Form.Item
      {...formItemLayout}
      label={<FormItemLabel>{t("wallet.input.gasLimit")}</FormItemLabel>}
    >
      {getFieldDecorator("gasLimit", {
        initialValue: "",
        rules: []
      })(<InputNumber size="large" step={10} min={0} style={inputStyle} />)}
    </Form.Item>
  );
}
