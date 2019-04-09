// @ts-ignore
import { Avatar, Card, Icon } from "antd";
import { assetURL } from "onefx/lib/asset-url";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React from "react";
import { Link } from "react-router-dom";
import { Flex } from "../common/flex";
import { colors } from "../common/styles/style-color";

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
