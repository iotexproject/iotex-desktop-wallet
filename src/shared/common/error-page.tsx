import Button from "antd/lib/button";
// @ts-ignore

// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import { PureComponent } from "react";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Flex } from "./flex";
import { FOOTER_ABOVE } from "./footer";
import { ContentPadding } from "./styles/style-padding";

type PathParamsType = {
  hash: string;
};

type Props = RouteComponentProps<PathParamsType> & {
  bar: string;
  title: string;
  info?: string;
  bg: string;
};
class ErrorPageComponent extends PureComponent<Props> {
  public render(): JSX.Element {
    const { bar, title, info, bg } = this.props;
    return (
      <ContentPadding
        style={{
          background: `url(${bg}) no-repeat center`
        }}
      >
        <Helmet title={`${bar} - ${t("topbar.brand")}`} />
        <Flex {...FOOTER_ABOVE}>
          <Flex column={true} margin={"8px"} alignItems={"flex-start"}>
            <h1 style={{ fontWeight: "bold" }}>{title}</h1>
            {info && <Info>{info}</Info>}
            <Button
              href="#"
              type="primary"
              style={{ marginTop: "30px" }}
              onClick={() => {
                this.props.history.push("/");
              }}
            >
              {t("button.backHome")}
            </Button>
          </Flex>
        </Flex>
      </ContentPadding>
    );
  }
}

export const ErrorPage = withRouter(ErrorPageComponent);

const Info = styled("div", (_: React.CSSProperties) => ({
  color: "rgb(102,102,102)",
  fontSize: "1.6em"
}));
