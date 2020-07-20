// tslint:disable:no-any
import Avatar from "antd/lib/avatar";
import Button from "antd/lib/button";
import Input from "antd/lib/input";
import { assetURL } from "onefx/lib/asset-url";
import { t } from "onefx/lib/iso-i18n";
import { styled } from "onefx/lib/styletron-react";
import React from "react";
import { colors } from "./styles/style-color";
import { media } from "./styles/style-media";
import { contentPadding } from "./styles/style-padding";
import { TOP_BAR_HEIGHT } from "./top-bar";

export const FOOTER_HEIGHT = 325;

export const FOOTER_ABOVE = {
  minHeight: `calc(100vh - ${FOOTER_HEIGHT + TOP_BAR_HEIGHT}px)`
};

const images = () => [
  {
    src: "footer/twitter.png",
    href: "https://twitter.com/iotex_io"
  },
  {
    src: "footer/t.me.png",
    href: "https://t.me/IoTeXGroup"
  },
  {
    src: "footer/reddit.png",
    href: "https://www.reddit.com/r/IoTeX/"
  },
  {
    src: "footer/medium.png",
    href: "https://medium.com/iotex"
  },
  {
    src: "footer/youtube.png",
    href: "https://www.youtube.com/channel/UCdj3xY3LCktuamvuFusWOZw"
  },
  {
    src: "footer/facebook.png",
    href: "https://www.facebook.com/iotex.io/"
  },
  {
    src: "footer/instagram.png",
    href:
      "https://instagram.com/iotexproject?utm_source=ig_profile_share&igshid=n1x5vxo61e00"
  }
];

const links = [
  {
    name: "footer.resource",
    value: [
      {
        name: "footer.launch",
        href: "https://www.launch.iotex.io/"
      },
      {
        name: "footer.research_paper",
        href: "https://iotex.io/academics"
      },
      {
        name: "footer.announcemenets",
        href: "https://iotex.io/feed"
      },
      {
        name: "footer.delegates_program",
        href: "https://member.iotex.io/"
      },
      {
        name: "footer.charity_program",
        href: "https://iotex.io/charity"
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
        name: "footer.libraries_tools",
        href: "https://docs.iotex.io/docs/libraries-and-tools.html"
      },
      {
        name: "footer.explorer",
        href: "https://iotexscan.io/"
      },
      {
        name: "footer.wallet",
        href: "https://iotexscan.io/wallet"
      }
    ]
  },
  {
    name: t("footer.about_us"),
    value: [
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

export function Footer(): JSX.Element {
  return (
    <FooterWrapper>
      <Align>
        <Flex>
          {links.map((link, i) => (
            <LinkWrapper key={i}>
              <Title>{t(link.name)}</Title>
              {link.value.map((res, j) => (
                <div key={`${i}-${j}`}>
                  <Link href={res.href}>{t(res.name)}</Link>
                </div>
              ))}
            </LinkWrapper>
          ))}
          <FooterRight>
            <FooterInput placeholder={t("footer.enter_email")} />
            <FooterButton>{t("footer.subscribe")}</FooterButton>
            <FooterImages>
              {images().map((image, index) => (
                <a key={index} href={image.href}>
                  <FooterAvatar src={assetURL(image.src)} />
                </a>
              ))}
            </FooterImages>
          </FooterRight>
        </Flex>
      </Align>
      <FooterBottom>
        <span>
          <span>© {`${new Date().getFullYear()}`} IoTeX</span>
          <Team href={"https://iotex.io/policy"}>{t("footer.policy")}</Team>
        </span>
      </FooterBottom>
    </FooterWrapper>
  );
}

const Flex = styled("div", {
  display: "flex",
  alignItems: "top",
  width: "100%",
  justifyContent: "space-between",
  flexWrap: "wrap"
});

const Team = styled("a", {
  marginLeft: "50px",
  textDecoration: "underline",
  color: "#dbdbdb"
});

const LinkWrapper = styled("div", {
  marginRight: "20px",
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
  marginLeft: "10px",
  [media.media1024]: {
    marginLeft: 0,
    marginRight: "10px",
    width: "36px",
    height: "36px"
  }
});

const FooterRight = styled("div", {
  flex: "none",
  textAlign: "right",
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
  color: "#dbdbdb"
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
  fontSize: "16px",
  lineHeight: 2,
  color: "#dbdbdb",
  [media.media1024]: { lineHeight: 1.5 }
});

const Link = styled("a", {
  fontSize: "14px",
  lineHeight: 2,
  color: "#0fcdc9",
  [media.media1024]: { lineHeight: 1.5 }
});

const FooterImages = styled("div", {
  marginTop: "32px",
  [media.media1024]: { marginTop: "10px" }
});

const FooterWrapper = styled("div", {
  ...contentPadding,
  paddingTop: "32px",
  paddingBottom: "32px",
  minHeight: `${FOOTER_HEIGHT}px`,
  backgroundColor: colors.nav02,
  color: colors.white,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  width: "100%",
  [media.media1024]: {
    minWidth: 0,
    paddingTop: "16px",
    paddingBottom: "16px"
  }
});
const Align = styled("div", {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%"
});
