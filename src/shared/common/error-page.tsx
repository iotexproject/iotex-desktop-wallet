// @ts-ignore
import { assetURL } from "onefx/lib/asset-url";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import { PureComponent } from "react";
import React from "react";
import { Flex } from "./flex";
import { FOOTER_ABOVE } from "./footer";
// import { fullOnPalm } from "./styles/style-media";
import { ContentPadding } from "./styles/style-padding";
import { Button } from "antd";

type Props = {
  bar: string;
  title: string;
  info: string;
};

export class ErrorPage extends PureComponent<Props> {
  public render(): JSX.Element {
    const { bar, title, info } = this.props;
    return (
      <ContentPadding
        style={{
          background: `url(${assetURL("/bg_404.png")}) no-repeat center`
        }}
      >
        <Helmet title={`${bar} - ${t("topbar.brand")}`} />
        <Flex {...FOOTER_ABOVE}>
          <Flex column={true} margin={"8px"} alignItems={"flex-start"}>
            <h1 style={{ fontWeight: "bold" }}>{title}</h1>
            <Info>{info}</Info>
            <Button style={{ marginTop: "30px" }} type={"primary"}>
              Back Home
            </Button>
          </Flex>
        </Flex>
      </ContentPadding>
    );
  }
}

const Info = styled("div", (_: React.CSSProperties) => ({
  color: "rgb(102,102,102)",
  fontSize: "1.6em"
}));
