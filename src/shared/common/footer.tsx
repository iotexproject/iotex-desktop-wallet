import Avatar from "antd/lib/avatar";
import Input from "antd/lib/input";
import Form from "antd/lib/form";
// @ts-ignore
import { assetURL } from "onefx/lib/asset-url";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import { colors } from "./styles/style-color";
import { media } from "./styles/style-media";
import React from "react";
// import { withApollo, WithApolloClient } from "react-apollo";
// import { SendGridInfo } from "../../api-gateway/resolvers/meta";
// import { ADD_SUBSCRIPTION } from "../queries";
// import notification from "antd/lib/notification";
// import {webBpApolloClient} from "../common/apollo-client"

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
        name: "footer.libraries_tools",
        href: "https://docs.iotex.io/docs/libraries-and-tools.html"
      }
    ]
  },
  {
    name: "footer.about_us",
    value: [
      {
        name: "footer.team",
        href: "https://www.iotex.io/about-us"
      },
      {
        name: "Brand Ambassador",
        href: "https://www.iotex.io/brand-ambassador"
      },
      {
        name: "footer.forum",
        href: "https://forum.iotex.io/"
      },
      {
        name: "footer.support",
        href: "https://iotex.zendesk.com/hc/en-us"
      }
    ]
  }
];

const linkPx: Array<string> = ["40px", "240px", "413px"];

// const InputWrapper = styled("div", (_: React.CSSProperties) => ({
//   [media.media960]: {
//     marginBottom: "10px"
//   },
//   [media.palm]: {
//     textAlign: "center"
//   }
// }));

// type SubscriptionProps = WithApolloClient<object>;

// const SubscriptionComponent = ({ client }: SubscriptionProps): JSX.Element => {
//   const [email, setEmail] = useState("");
//   const emailChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const { value } = event.target;

//     setEmail(value);
//   };

//   const onSubscribe = () => {
//     try {
//       client
//         .mutate<{ addSubscription: SendGridInfo }>({
//           mutation: ADD_SUBSCRIPTION,
//           variables: {
//             email
//           }
//         })
//         .then(({ data }) => {
//           // setLoading(false);
//           const isSubscribeSuccess = (data as { addSubscription: SendGridInfo })
//             .addSubscription.isSubscribeSuccess;
//           const message = isSubscribeSuccess
//             ? "footer.subscribe.success"
//             : "footer.subscribe.failed";
//           const notice = { message: t(message), duration: 3 };

//           if (isSubscribeSuccess) {
//             notification.success(notice);
//           } else {
//             notification.error(notice);
//           }
//         })
//         .catch(err => {
//           alert(JSON.stringify(err));
//         });
//     } catch (err) {
//       alert(JSON.stringify(err));
//     }
//   };
//   return (
//     <InputWrapper>
//       <Form onSubmit={onSubscribe}>
//         <FooterInput
//           type="email"
//           placeholder={`${t("footer.enter_email")}`}
//           onChange={emailChange}
//         />
//         <FooterSubmit type="submit" value={`${t("footer.subscribe")}`} />
//       </Form>
//     </InputWrapper>
//   );
// };

// const Subscription = withApollo(SubscriptionComponent);

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
          <Form>
            <FooterInput
              type="email"
              placeholder={`${t("footer.enter_email")}`}
            />
            <FooterSubmit type="submit" value={`${t("footer.subscribe")}`} />
          </Form>
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
  borderRadius: 0,
  borderColor: "#dbdbdb",
  ":focus": {
    color: "#dbdbdb",
    backgroundColor: colors.nav02,
    borderColor: "#dbdbdb"
  },
  ":hover": {
    borderColor: "#dbdbdb"
  }
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
  width: "500px",
  minHeight: "auto"
});

const FooterSubmit = styled(Input, {
  backgroundColor: colors.nav02,
  width: "90px",
  height: "48px",
  color: "#dbdbdb",
  borderRadius: 0,
  marginLeft: "8px",
  ":hover": {
    color: colors.nav02,
    backgroundColor: "#dbdbdb",
    cursor: "pointer",
    borderColor: colors.nav02
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
  backgroundColor: "rgba(0, 0, 0, 0.82)",
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
