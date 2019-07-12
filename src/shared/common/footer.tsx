import notification from "antd/lib/notification";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import React, { ChangeEvent, useState } from "react";
import { Query, QueryResult, withApollo, WithApolloClient } from "react-apollo";
import { SendGridInfo, VersionInfo } from "../../api-gateway/resolvers/meta";
import { media } from "../common/styles/style-media";
import { ADD_SUBSCRIPTION, FETCH_VERSION_INFO } from "../queries";
import { assetURL } from "./asset-url";
import { Flex } from "./flex";
import { colors } from "./styles/style-color";
import { contentPadding } from "./styles/style-padding";
import { TOP_BAR_HEIGHT } from "./top-bar";

export const FOOTER_HEIGHT = 260;

export const FOOTER_ABOVE = {
  minHeight: `calc(100vh - ${FOOTER_HEIGHT + TOP_BAR_HEIGHT}px)`
};

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

type SubscriptionProps = WithApolloClient<object>;

const SubscriptionComponent = ({ client }: SubscriptionProps): JSX.Element => {
  const [email, setEmail] = useState("");
  const [isEmailValid, setEmailValid] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const emailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      value,
      validity: { valid }
    } = event.target;

    setEmail(value);
    setEmailValid(!!value && !!valid);
  };

  const onSubscribe = () => {
    setLoading(true);
    client
      .mutate<{ addSubscription: SendGridInfo }>({
        mutation: ADD_SUBSCRIPTION,
        variables: {
          email
        }
      })
      .then(({ data }) => {
        setLoading(false);
        const isSubscribeSuccess = (data as { addSubscription: SendGridInfo })
          .addSubscription.isSubscribeSuccess;
        const message = isSubscribeSuccess
          ? "footer.subscribe.success"
          : "footer.subscribe.failed";
        const notice = { message: t(message), duration: 3 };

        if (isSubscribeSuccess) {
          notification.success(notice);
        } else {
          notification.error(notice);
        }
      });
  };
  return (
    <InputWrapper>
      <Input
        type="email"
        placeholder={`${t("footer.enter_email")}`}
        onChange={emailChange}
      />
      {isEmailValid && !isLoading ? (
        <Button onClick={onSubscribe} className="ant-btn-primary">
          {t("footer.subscribe")}
        </Button>
      ) : (
        <Button style={disabledButton} disabled>
          {t("footer.subscribe")}
        </Button>
      )}
    </InputWrapper>
  );
};

const Subscription = withApollo(SubscriptionComponent);

export function Footer(): JSX.Element {
  return (
    <Bottom>
      <Align>
        <Flex>
          <Subscription />
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
                    {`  iotex-explorer ${data.fetchVersionInfo.explorerVersion}`}
                  </span>
                  <span>
                    {`  iotex-core ${data.fetchVersionInfo.iotexCoreVersion}`}
                  </span>
                </VersionWrapper>
              );
            }}
          </Query>
        </CopyRight>
        <a
          href="https://v1.iotex.io/policy"
          style={{ textDecoration: "underline", color: colors.topbarGray }}
        >
          <div>{t("footer.policy")}</div>
        </a>
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
    paddingTop: "15px",
    height: "291px"
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
  borderBottomRightRadius: "5px",
  borderTopRightRadius: "5px",
  outline: "none",
  borderLeftWidth: 0,
  borderRightWidth: "1px",
  borderTopWidth: "1px",
  borderBottomWidth: "1px",
  cursor: "pointer",
  [media.palm]: {
    borderLeftWidth: "1px",
    marginTop: "10px",
    borderBottomLeftRadius: "5px",
    borderTopLeftRadius: "5px"
  }
}));

const disabledButton = {
  cursor: "inherit",
  background: "none",
  color: "inherit"
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
  },
  [media.palm]: {
    marginBottom: "10px"
  }
}));
