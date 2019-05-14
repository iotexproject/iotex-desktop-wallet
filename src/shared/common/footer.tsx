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
    "social_twitter",
    "social_airfree",
    "social_reddit",
    "social_m",
    "social_youtube",
    "social_facebook",
    "social_instagram"
  ];
  return (
    <Bottom>
      <Align>
        <Flex>
          <InputWrapper>
            <input
              placeholder="Enter email for Iotex updates!"
              style={inputStyle}
            />
            <button style={buttonStyle}>Subscribe</button>
          </InputWrapper>
        </Flex>
        <Flex>
          {socialIconList.map(iconName => {
            return <SocialIconWrapper imgName={iconName} />;
          })}
        </Flex>
      </Align>
      <CopyRightWrapper>
        <div
          style={{
            display: "flex",
            [media.media960]: {
              flexDirection: "column"
            }
          }}
        >
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
                <span>
                  <span style={{ marginRight: 15 }}>
                    {`  iotex-explorer ${
                      data.fetchVersionInfo.explorerVersion
                    }`}
                  </span>
                  <span>
                    {`  iotex-core ${data.fetchVersionInfo.iotexCoreVersion}`}
                  </span>
                </span>
              );
            }}
          </Query>
        </div>
        <div>{t("footer.policy")}</div>
      </CopyRightWrapper>
    </Bottom>
  );
}

const Bottom = styled("div", (_: React.CSSProperties) => ({
  paddingTop: "65px",
  paddingBottom: "53px",
  height: `${FOOTER_HEIGHT}px`,
  backgroundColor: colors.nav02
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

const SocialIconWrapper = ({ imgName }: { imgName: string }): JSX.Element => {
  return (
    <span style={{ marginLeft: "10px" }}>
      <img src={assetURL(`/${imgName}.png`)} alt={imgName} />
    </span>
  );
};

const InputWrapper = styled("div", (_: React.CSSProperties) => ({
  [media.media960]: {
    marginBottom: "30px"
  }
}));

const inputStyle = {
  width: "290px",
  border: `1px solid ${colors.topbarGray}`,
  background: "none",
  borderBottomLeftRadius: "5px",
  borderTopLeftRadius: "5px",
  padding: "9px 123px 9px 17px",
  outline: "none"
};

const buttonStyle = {
  padding: "9px 23px",
  border: `1px solid ${colors.topbarGray}`,
  background: "none",
  borderBottomRightRadius: "5px",
  borderTopRightRadius: "5px",
  outline: "none",
  borderLeftWidth: 0
};

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
  }
}));
