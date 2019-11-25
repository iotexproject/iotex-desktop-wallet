// import notification from "antd/lib/notification";
// // @ts-ignore
// import { t } from "onefx/lib/iso-i18n";
// // @ts-ignore
// import { styled } from "onefx/lib/styletron-react";
// import React, { ChangeEvent, useState } from "react";
// import { Query, QueryResult, withApollo, WithApolloClient } from "react-apollo";
// import { SendGridInfo, VersionInfo } from "../../api-gateway/resolvers/meta";
// import { media } from "../common/styles/style-media";
// import { ADD_SUBSCRIPTION, FETCH_VERSION_INFO } from "../queries";
// import { assetURL } from "./asset-url";
// import { Flex } from "./flex";
// import { colors } from "./styles/style-color";
// import { contentPadding } from "./styles/style-padding";
// import { TOP_BAR_HEIGHT } from "./top-menu-bar";

// export const FOOTER_HEIGHT = 375;

// export const FOOTER_ABOVE = {
//   minHeight: `calc(100vh - ${FOOTER_HEIGHT + TOP_BAR_HEIGHT}px)`
// };

// const socialIconList = [
//   {
//     name: "social_twitter",
//     href: "https://twitter.com/iotex_io"
//   },
//   {
//     name: "social_airfree",
//     href: "https://t.me/IoTeXGroup"
//   },
//   {
//     name: "social_reddit",
//     href: "https://www.reddit.com/r/IoTeX/"
//   },
//   {
//     name: "social_m",
//     href: "https://medium.com/iotex"
//   },
//   {
//     name: "social_youtube",
//     href: "https://www.youtube.com/channel/UCdj3xY3LCktuamvuFusWOZw"
//   },
//   {
//     name: "social_facebook",
//     href: "https://www.facebook.com/iotex.io/"
//   },
//   {
//     name: "social_instagram",
//     href:
//       "https://instagram.com/iotexproject?utm_source=ig_profile_share&igshid=n1x5vxo61e00"
//   }
// ];

// type SubscriptionProps = WithApolloClient<object>;

// const SubscriptionComponent = ({ client }: SubscriptionProps): JSX.Element => {
//   const [email, setEmail] = useState("");
//   const [isEmailValid, setEmailValid] = useState(false);
//   const [isLoading, setLoading] = useState(false);
//   const emailChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const {
//       value,
//       validity: { valid }
//     } = event.target;

//     setEmail(value);
//     setEmailValid(!!value && !!valid);
//   };

//   const onSubscribe = () => {
//     setLoading(true);
//     client
//       .mutate<{ addSubscription: SendGridInfo }>({
//         mutation: ADD_SUBSCRIPTION,
//         variables: {
//           email
//         }
//       })
//       .then(({ data }) => {
//         setLoading(false);
//         const isSubscribeSuccess = (data as { addSubscription: SendGridInfo })
//           .addSubscription.isSubscribeSuccess;
//         const message = isSubscribeSuccess
//           ? "footer.subscribe.success"
//           : "footer.subscribe.failed";
//         const notice = { message: t(message), duration: 3 };

//         if (isSubscribeSuccess) {
//           notification.success(notice);
//         } else {
//           notification.error(notice);
//         }
//       });
//   };
//   return (
//     <InputWrapper>
//       <Input
//         type="email"
//         placeholder={`${t("footer.enter_email")}`}
//         onChange={emailChange}
//       />
//       {isEmailValid && !isLoading ? (
//         <Button onClick={onSubscribe} className="ant-btn-primary">
//           {t("footer.subscribe")}
//         </Button>
//       ) : (
//         <Button style={disabledButton} disabled={true}>
//           {t("footer.subscribe")}
//         </Button>
//       )}
//     </InputWrapper>
//   );
// };

// const Subscription = withApollo(SubscriptionComponent);

// export function Footer(): JSX.Element {
//   return (
//     <Bottom>
//       <Align>
//         <Flex>
//           <Subscription />
//         </Flex>
//         <Flex>
//           {socialIconList.map((icon, index) => {
//             return <SocialIconWrapper key={index} icon={icon} />;
//           })}
//         </Flex>
//       </Align>
//       <CopyRightWrapper>
//         <CopyRight>
//           <span
//             style={{ marginRight: 15 }}
//           >{`© ${new Date().getFullYear()} IoTeX`}</span>
//           <Query query={FETCH_VERSION_INFO}>
//             {({
//               loading,
//               error,
//               data
//             }: QueryResult<{ fetchVersionInfo: VersionInfo }>) => {
//               if (loading || error || !data) {
//                 if (error) {
//                   notification.error({
//                     message: `failed to qeury version info: ${error}`
//                   });
//                 }
//                 return null;
//               }
//               return (
//                 <VersionWrapper>
//                   <span style={{ marginRight: 15 }}>
//                     {`  iotex-explorer ${data.fetchVersionInfo.explorerVersion}`}
//                   </span>
//                   <span>
//                     {`  iotex-core ${data.fetchVersionInfo.iotexCoreVersion}`}
//                   </span>
//                 </VersionWrapper>
//               );
//             }}
//           </Query>
//         </CopyRight>
//         <a
//           href="https://v1.iotex.io/policy"
//           style={{ textDecoration: "underline", color: colors.topbarGray }}
//         >
//           <div>{t("footer.policy")}</div>
//         </a>
//       </CopyRightWrapper>
//     </Bottom>
//   );
// }

// const Bottom = styled("div", (_: React.CSSProperties) => ({
//   paddingTop: "65px",
//   paddingBottom: "53px",
//   height: `${FOOTER_HEIGHT}px`,
//   backgroundColor: colors.nav02,
//   [media.palm]: {
//     paddingTop: "15px",
//     height: "291px"
//   }
// }));

// const CopyRightWrapper = styled("div", (_: React.CSSProperties) => ({
//   ...contentPadding,
//   color: colors.topbarGray,
//   margin: "0 auto",
//   display: "flex",
//   justifyContent: "space-between",
//   [media.media960]: {
//     flexDirection: "column",
//     alignItems: "center"
//   }
// }));

// const CopyRight = styled("div", (_: React.CSSProperties) => ({
//   display: "flex",
//   [media.media960]: {
//     flexDirection: "column",
//     textAlign: "center"
//   }
// }));

// const VersionWrapper = styled("span", (_: React.CSSProperties) => ({
//   [media.palm]: {
//     display: "flex",
//     flexDirection: "column"
//   }
// }));

// const SocialIconWrapper = ({
//   icon
// }: {
//   icon: { name: string; href: string };
// }): JSX.Element => {
//   return (
//     <a href={icon.href}>
//       <span style={{ marginLeft: "10px" }}>
//         <img src={assetURL(`/${icon.name}.png`)} alt={icon.name} />
//       </span>
//     </a>
//   );
// };

// const InputWrapper = styled("div", (_: React.CSSProperties) => ({
//   [media.media960]: {
//     marginBottom: "10px"
//   },
//   [media.palm]: {
//     textAlign: "center"
//   }
// }));

// const Input = styled("input", (_: React.CSSProperties) => ({
//   width: "290px",
//   border: `1px solid ${colors.topbarGray}`,
//   background: "none",
//   borderBottomLeftRadius: "5px",
//   borderTopLeftRadius: "5px",
//   padding: "9px 0 9px 17px",
//   outline: "none",
//   [media.palm]: {
//     borderBottomRightRadius: "5px",
//     borderTopRightRadius: "5px"
//   }
// }));

// const Button = styled("button", (_: React.CSSProperties) => ({
//   padding: "9px 23px",
//   borderColor: `${colors.topbarGray}`,
//   borderStyle: "solid",
//   borderBottomRightRadius: "5px",
//   borderTopRightRadius: "5px",
//   outline: "none",
//   borderLeftWidth: 0,
//   borderRightWidth: "1px",
//   borderTopWidth: "1px",
//   borderBottomWidth: "1px",
//   cursor: "pointer",
//   [media.palm]: {
//     borderLeftWidth: "1px",
//     marginTop: "10px",
//     borderBottomLeftRadius: "5px",
//     borderTopLeftRadius: "5px"
//   }
// }));

// const disabledButton = {
//   cursor: "inherit",
//   background: "none",
//   color: "inherit"
// };

// const Align = styled("div", (_: React.CSSProperties) => ({
//   ...contentPadding,
//   display: "flex",
//   flexDirection: "row",
//   alignItems: "center",
//   justifyContent: "space-between",
//   marginBottom: "91px",
//   color: colors.topbarGray,
//   [media.media960]: {
//     flexDirection: "column",
//     marginBottom: "30px"
//   },
//   [media.palm]: {
//     marginBottom: "10px"
//   }
// }));

// tslint:disable:no-any
import Avatar from "antd/lib/avatar";
import Button from "antd/lib/button";
import Input from "antd/lib/input";
// @ts-ignore
import { assetURL } from "onefx/lib/asset-url";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import { colors } from "./styles/style-color";
import { media } from "./styles/style-media";
import React, { ChangeEvent, useState } from "react";
import { withApollo, WithApolloClient } from "react-apollo";
import { SendGridInfo } from "../../api-gateway/resolvers/meta";
import { ADD_SUBSCRIPTION } from "../queries";
import notification from "antd/lib/notification";

export const FOOTER_HEIGHT = 375;

const images = [
  {
    src: "/footer/twitter.png",
    href: "https://twitter.com/iotex_io"
  },
  {
    src: "/footer/t.me.png",
    href: "https://t.me/IoTeXGroup"
  },
  {
    src: "/footer/reddit.png",
    href: "https://www.reddit.com/r/IoTeX/"
  },
  {
    src: "/footer/medium.png",
    href: "https://medium.com/iotex"
  },
  {
    src: "/footer/youtube.png",
    href: "https://www.youtube.com/channel/UCdj3xY3LCktuamvuFusWOZw"
  },
  {
    src: "/footer/facebook.png",
    href: "https://www.facebook.com/iotex.io/"
  },
  {
    src: "/footer/instagram.png",
    href:
      "https://instagram.com/iotexproject?utm_source=ig_profile_share&igshid=n1x5vxo61e00"
  }
];

const links = [
  {
    name: "footer.resource",
    value: [
      {
        name: "Ecosystem",
        href: "https://www.iotex.io/ecosystem"
      },
      {
        name: "​Secure Hardware",
        href: "https://www.iotex.io/securehardware"
      },
      {
        name: "Community Resources",
        href: "https://www.iotex.io/community-resources"
      },
      {
        name: "Research Papers",
        href: "https://www.iotex.io/research-paper"
      },
      {
        name: "Delegate Program",
        href: "https://member.iotex.io/"
      },
      {
        name: "Charity Program",
        href: "https://www.iotex.io/charity"
      },
      {
        name: "Global Network",
        href: "https://www.iotex.io/"
      }
    ]
  },
  {
    name: "footer.develop",
    value: [
      {
        name: "footer.github",
        href: "https://github.com/iotexproject"
      },
      {
        name: "footer.documentations",
        href: "https://docs.iotex.io/"
      },
      {
        name: "footer.explorer",
        href: "https://iotexscan.io/"
      },
      {
        name: "footer.wallet",
        href: "https://iotexscan.io/wallet"
      },
      {
        name: "Libraries and tools",
        href: "https://docs.iotex.io/docs/libraries-and-tools.html"
      }
    ]
  },
  {
    name: t("footer.about_us"),
    value: [
      {
        name: t("Team"),
        href: "https://www.iotex.io/about-us"
      },
      {
        name: t("Brand Ambassador"),
        href: "https://www.iotex.io/brand-ambassador"
      },
      {
        name: t("footer.forum"),
        href: "https://forum.iotex.io/"
      },
      {
        name: t("footer.support"),
        href: "https://iotex.zendesk.com/hc/en-us"
      }
    ]
  }
];

const linkPx: Array<string> = ["40px", "240px", "413px"];

const InputWrapper = styled("div", (_: React.CSSProperties) => ({
  [media.media960]: {
    marginBottom: "10px"
  },
  [media.palm]: {
    textAlign: "center"
  }
}));

const disabledButton = {
  cursor: "inherit",
  background: "none",
  color: "inherit"
};

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
        <FooterButton onClick={onSubscribe} className="ant-btn-primary">
          {t("footer.subscribe")}
        </FooterButton>
      ) : (
        <FooterButton
          style={{ cursor: "inherit", background: "none", color: "inherit" }}
        >
          {t("footer.subscribe")}
        </FooterButton>
      )}
    </InputWrapper>
  );
};

const Subscription = withApollo(SubscriptionComponent);

export function Footer(): JSX.Element {
  return (
    <FooterWrapper>
      <Align>
        {links.map((link, i) => (
          <LinkWrapper key={i} style={{ left: linkPx[i] }}>
            <Title>{t(link.name)}</Title>
            <TitleValue>
              {link.value.map((res, j) => (
                <LinkP key={`${i}-${j}`}>
                  <LinkSpan>
                    <Link href={res.href}>{t(res.name)}</Link>
                  </LinkSpan>
                </LinkP>
              ))}
            </TitleValue>
          </LinkWrapper>
        ))}
        <FooterRight>
          <Subscription />
          <FooterImages>
            {images.map((image, index) => (
              <a key={index} href={image.href}>
                <FooterAvatar src={assetURL(image.src)} />
              </a>
            ))}
          </FooterImages>
        </FooterRight>
      </Align>
      <FooterBottom>
        <span>
          <span>© 2019 IoTeX</span>
          <Team href={"https://iotex.io/policy"}>{t("footer.policy")}</Team>
        </span>
      </FooterBottom>
    </FooterWrapper>
  );
}

// const Flex = styled("div", {
//   display: "flex",
//   alignItems: "top",
//   width: "100%",
//   justifyContent: "space-between",
//   flexWrap: "wrap"
// });

const Team = styled("a", {
  marginLeft: "50px",
  textDecoration: "underline",
  color: "#dbdbdb"
});

const LinkWrapper = styled("div", {
  flex: 0,
  [media.media1024]: { marginRight: 0 }
});

const FooterInput = styled(Input, {
  backgroundColor: colors.nav02,
  width: "220px",
  height: "48px",
  color: "#dbdbdb",
  borderColor: "#fff",
  borderRadius: 0
});

const FooterAvatar = styled(Avatar, {
  backgroundColor: colors.nav02,
  width: "40px",
  height: "40px",
  marginLeft: "7px",
  [media.media1024]: {
    marginLeft: 0,
    marginRight: "10px",
    width: "36px",
    height: "36px"
  }
});

const FooterRight = styled("div", {
  textAlign: "right",
  margin: "48px 0px 13px 40px",
  [media.media1024]: {
    width: "100%",
    marginTop: "16px",
    marginBottom: "10px",
    paddingLeft: 0,
    textAlign: "left"
  }
});

const FooterBottom = styled("div", {
  textAlign: "center",
  color: "#dbdbdb",
  position: "relative",
  margin: "0px 0px 18px calc((100% - 980px) * 0.87)",
  width: "394px",
  minHeight: "auto"
});

const FooterButton = styled(Button, {
  backgroundColor: colors.nav02,
  width: "90px",
  height: "48px",
  color: "#dbdbdb",
  borderColor: "#fff",
  borderRadius: 0,
  marginLeft: "8px",
  ":hover": {
    color: colors.nav02
  }
});

const Title = styled("div", {
  width: "91px",
  height: "auto",
  lineHeight: 2,
  color: "#dbdbdb",
  position: "relative",
  left: "40px",
  margin: "48px 0px 13px 0px",
  [media.media1024]: { lineHeight: 1.5 }
});

const TitleValue = styled("div", {
  width: "192px",
  height: "auto",
  position: "relative",
  left: "40px",
  margin: "0px 0px 50px 0px"
});

const LinkP = styled("p", {
  fontSize: "14px",
  lineHeight: 2,
  color: "#333435",
  margin: "0px"
});

const LinkSpan = styled("span", {
  color: "#0fcdc9"
});

const Link = styled("a", {
  target: "_blank",
  padding: "0px"
});

const FooterImages = styled("div", {
  marginTop: "32px",
  [media.media1024]: { marginTop: "10px" }
});

const FooterWrapper = styled("div", {
  minHeight: `${FOOTER_HEIGHT}px`,
  backgroundColor: colors.nav02,
  color: colors.white,
  minWidth: "980px",
  width: "100%",
  position: "static"
});

const Align = styled("div", {
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  width: "100%",
  minWidth: "980px",
  margin: "0px 0px 0px calc((100% - 980px) * 0.5)"
});
