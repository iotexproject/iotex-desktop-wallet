// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { VersionInfo } from "../../api-gateway/resolvers/meta";
import { media } from "../common/styles/style-media";
import { FETCH_VERSION_INFO } from "../queries";
import { assetURL } from "./asset-url";
import { Flex } from "./flex";
import { colors } from "./styles/style-color";
import { contentPadding } from "./styles/style-padding";
import { TOP_BAR_HEIGHT } from "./top-bar";

export const FOOTER_HEIGHT = 260;

export const FOOTER_ABOVE = {
  minHeight: `calc(100vh - ${FOOTER_HEIGHT + TOP_BAR_HEIGHT}px)`
};

export function Footer(): JSX.Element {
  const socialIconList = [
    {
      name: "social_twitter",
      href: "https://twitter.com/iotex_io"
    },
    {
      name: "social_airfree",
      href: "https://t.me/IoTeXGroup"
    },
    {
      name: "social_reddit",
      href: "https://www.reddit.com/r/IoTeX/"
    },
    {
      name: "social_m",
      href: "https://medium.com/iotex"
    },
    {
      name: "social_youtube",
      href: "https://www.youtube.com/channel/UCdj3xY3LCktuamvuFusWOZw"
    },
    {
      name: "social_facebook",
      href: "https://www.facebook.com/iotex.io/"
    },
    {
      name: "social_instagram",
      href:
        "https://instagram.com/iotexproject?utm_source=ig_profile_share&igshid=n1x5vxo61e00"
    }
  ];
  return (
    <Bottom>
      <Align>
        <Flex>
          <InputWrapper>
            <Input placeholder={`${t("footer.enter_email")}`} />
            <Button>{t("footer.subscribe")}</Button>
          </InputWrapper>
        </Flex>
        <Flex>
          {socialIconList.map((icon, index) => {
            return <SocialIconWrapper key={index} icon={icon} />;
          })}
        </Flex>
      </Align>
      <CopyRightWrapper>
        <CopyRight>
          <span
            style={{ marginRight: 15 }}
          >{`© ${new Date().getFullYear()} IoTeX`}</span>
          <Query query={FETCH_VERSION_INFO}>
            {({
              loading,
              error,
              data
            }: QueryResult<{ fetchVersionInfo: VersionInfo }>) => {
              if (loading || error || !data) {
                return null;
              }
              return (
                <VersionWrapper>
                  <span style={{ marginRight: 15 }}>
                    {`  iotex-explorer ${
                      data.fetchVersionInfo.explorerVersion
                    }`}
                  </span>
                  <span>
                    {`  iotex-core ${data.fetchVersionInfo.iotexCoreVersion}`}
                  </span>
                </VersionWrapper>
              );
            }}
          </Query>
        </CopyRight>
        <div>{t("footer.policy")}</div>
      </CopyRightWrapper>
    </Bottom>
  );
}

const Bottom = styled("div", (_: React.CSSProperties) => ({
  paddingTop: "65px",
  paddingBottom: "53px",
  height: `${FOOTER_HEIGHT}px`,
  backgroundColor: colors.nav02,
  [media.palm]: {
    paddingTop: "15px"
  }
}));

const CopyRightWrapper = styled("div", (_: React.CSSProperties) => ({
  ...contentPadding,
  color: colors.topbarGray,
  margin: "0 auto",
  display: "flex",
  justifyContent: "space-between",
  [media.media960]: {
    flexDirection: "column",
    alignItems: "center"
  }
}));

const CopyRight = styled("div", (_: React.CSSProperties) => ({
  display: "flex",
  [media.media960]: {
    flexDirection: "column",
    textAlign: "center"
  }
}));

const VersionWrapper = styled("span", (_: React.CSSProperties) => ({
  [media.palm]: {
    display: "flex",
    flexDirection: "column"
  }
}));

const SocialIconWrapper = ({
  icon
}: {
  icon: { name: string; href: string };
}): JSX.Element => {
  return (
    <a href={icon.href}>
      <span style={{ marginLeft: "10px" }}>
        <img src={assetURL(`/${icon.name}.png`)} alt={icon.name} />
      </span>
    </a>
  );
};

const InputWrapper = styled("div", (_: React.CSSProperties) => ({
  [media.media960]: {
    marginBottom: "10px"
  },
  [media.palm]: {
    textAlign: "center"
  }
}));

const Input = styled("input", (_: React.CSSProperties) => ({
  width: "290px",
  border: `1px solid ${colors.topbarGray}`,
  background: "none",
  borderBottomLeftRadius: "5px",
  borderTopLeftRadius: "5px",
  padding: "9px 0 9px 17px",
  outline: "none",
  [media.palm]: {
    borderBottomRightRadius: "5px",
    borderTopRightRadius: "5px"
  }
}));

const Button = styled("button", (_: React.CSSProperties) => ({
  padding: "9px 23px",
  borderColor: `${colors.topbarGray}`,
  borderStyle: "solid",
  background: "none",
  borderBottomRightRadius: "5px",
  borderTopRightRadius: "5px",
  outline: "none",
  borderLeftWidth: 0,
  borderRightWidth: "1px",
  borderTopWidth: "1px",
  borderBottomWidth: "1px",
  [media.palm]: {
    borderLeftWidth: "1px",
    marginTop: "10px",
    borderBottomLeftRadius: "5px",
    borderTopLeftRadius: "5px"
  }
}));

const Align = styled("div", (_: React.CSSProperties) => ({
  ...contentPadding,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "91px",
  color: colors.topbarGray,
  [media.media960]: {
    flexDirection: "column",
    marginBottom: "30px"
  },
  [media.palm]: {
    marginBottom: "10px"
  }
}));
