// @ts-ignore
import Button from "antd/lib/button";
import Row from "antd/lib/row";
import { Languages } from "iotex-react-language-dropdown";
import { LanguageSwitcher } from "iotex-react-language-dropdown/lib/language-switcher";
import isBrowser from "is-browser";
import { t } from "onefx/lib/iso-i18n";
import { styled, StyleObject } from "onefx/lib/styletron-react";
import React, { Component, useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import { connect, DispatchProp } from "react-redux";
import { Link } from "react-router-dom";
// @ts-ignore
import JsonGlobal from "safe-json-globals/get";
import { setSwitchAddress } from "../../client/javascripts/base-actions";
import { assetURL } from "./asset-url";
import { CommonMargin } from "./common-margin";
import { Logo as Icon } from "./icon";
import { Cross } from "./icons/cross.svg";
import { Hamburger } from "./icons/hamburger.svg";
import { transition } from "./styles/style-animation";
import { colors } from "./styles/style-color";
import { media, PALM_WIDTH } from "./styles/style-media";
import { contentPadding } from "./styles/style-padding";
import { TopbarExtMenu } from "./topbar-ext-menu";

const globalState = isBrowser && JsonGlobal("state");
const LanguageSwitcherMenu = () => {
  return (
    <Row className="language-switcher" style={{ marginLeft: "1em" }}>
      <LanguageSwitcher
        supportedLanguages={[
          Languages.EN,
          Languages.ZH_CN,
          Languages.IT,
          Languages.DE
        ]}
      />
    </Row>
  );
};

const AddressConverterSwitcher = (props: {
  onSwitch(s: boolean): void;
  toEthAddress: boolean;
}) => {
  const [toEthAddress, setShowIoAddress] = useState(props.toEthAddress);

  // @ts-ignore
  const convertAddress = e => {
    setShowIoAddress(!toEthAddress);
    props.onSwitch(!toEthAddress);
    e.stopPropagation();
  };

  return (
    <AddressSwitcherContainer onClick={convertAddress}>
      {/* tslint:disable-next-line:use-simple-attributes */}
      <AddressSwitcherItem
        style={{ background: toEthAddress ? "" : "#50B1A0" }}
      >
        io
      </AddressSwitcherItem>
      {/* tslint:disable-next-line:use-simple-attributes */}
      <AddressSwitcherItem
        style={{ background: toEthAddress ? "#89A8F2" : "" }}
      >
        0x
      </AddressSwitcherItem>
    </AddressSwitcherContainer>
  );
};

const AddressSwitcherContainer = styled("div", {
  display: "inline-block",
  width: "4rem",
  height: "1.3rem",
  lineHeight: "1.3rem",
  background: colors.black85,
  borderRadius: "0.125rem",
  cursor: "pointer"
});

const AddressSwitcherItem = styled("div", {
  display: "inline-block",
  width: "2rem",
  height: "1.3rem",
  lineHeight: "1.3rem",
  color: "white",
  textAlign: "center",
  cursor: "pointer"
});

const V2Entry = styled("a", {
  background: "rgba(217, 217, 217, 0.1)",
  borderRadius: "5px",
  width: "69px",
  textAlign: "center",
  fontWeight: 500,
  fontSize: "14px",
  lineHeight: "24px",
  height: "24px",
  display: "inline-block",
  color: "#44FFB2"
});

const multiChain: {
  current: string;
  chains: Array<{
    name: string;
    url: string;
  }>;
} = {
  current: (isBrowser && globalState.base.multiChain.current) || "MAINNET",
  chains: [
    {
      name: "MAINNET",
      url: "https://iotexscan.io/"
    },
    {
      name: "TESTNET",
      url: "https://testnet.iotexscan.io/"
    }
  ]
};
const CHAIN_MENU_ITEM = {
  label: multiChain.current,
  items: multiChain.chains.map(({ name, url }) => ({
    name: t(name),
    path: url
  }))
};

export const TOP_BAR_HEIGHT = 60;

type State = {
  displayMobileMenu: boolean;
};

type Props = {
  loggedIn: boolean;
  locale: string;
  grafanaLink: string;
  toEthAddress: boolean;
} & DispatchProp;

export const TopBar = connect(
  (state: {
    base: {
      userId?: string;
      locale: string;
      grafanaLink: string;
      toEthAddress: boolean;
    };
  }) => ({
    loggedIn: Boolean(state.base.userId),
    locale: state.base.locale,
    grafanaLink: state.base.grafanaLink,
    toEthAddress: state.base.toEthAddress
  })
)(
  class TopBarInner extends Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = {
        displayMobileMenu: false
      };
    }

    public componentDidMount(): void {
      window.addEventListener("resize", () => {
        if (
          document.documentElement &&
          document.documentElement.clientWidth > PALM_WIDTH
        ) {
          this.setState({
            displayMobileMenu: false
          });
        }
      });
    }

    public displayMobileMenu = () => {
      this.setState({
        displayMobileMenu: true
      });
    };

    public hideMobileMenu = () => {
      this.setState({
        displayMobileMenu: false
      });
    };

    public renderTools = (hasShadow: boolean) => {
      return (
        <TopbarExtMenu
          hasShadow={hasShadow}
          name={t("topbar.tools")}
          routes={[
            {
              name: t("topbar.explorer_playground"),
              path: "/explorer-playground/"
            },
            {
              name: t("topbar.analytics_playground"),
              path: "https://analytics.iotexscan.io/"
            },
            {
              name: t("topbar.submit_a_bug_report"),
              path: "https://github.com/iotexproject/iotex-explorer/issues/new"
            },
            {
              name: t("topbar.address_converter"),
              path: "https://member.iotex.io/tools/address-convert"
            }
          ]}
          onClick={this.hideMobileMenu}
        />
      );
    };

    public renderWallets = (hasShadow: boolean) => {
      return (
        <TopbarExtMenu
          hasShadow={hasShadow}
          name={t("topbar.wallet")}
          routes={[
            {
              name: t("topbar.wallet.ioPayMobile"),
              path: "https://iopay.iotex.io"
            },
            {
              name: t("topbar.wallet.ioPayDesktop"),
              path: "https://iopay.iotex.io/desktop"
            },
            {
              name: t("topbar.wallet.web"),
              path: "https://iotexscan.io/wallet"
            }
          ]}
          onClick={this.hideMobileMenu}
        />
      );
    };

    public renderBlockchain = (hasShadow: boolean) => {
      return (
        <TopbarExtMenu
          hasShadow={hasShadow}
          name={t("topbar.dashboard")}
          routes={[
            { name: t("topbar.dashboard"), path: "/" },
            { name: t("topbar.actions"), path: "/action" },
            { name: t("topbar.blocks"), path: "/block" },
            { name: t("topbar.accounts"), path: "/account" }
          ]}
          onClick={this.hideMobileMenu}
        />
      );
    };

    public renderToken = (hasShadow: boolean) => {
      return (
        <TopbarExtMenu
          hasShadow={hasShadow}
          name={t("topbar.tokensMenu")}
          routes={[
            { name: t("topbar.tokens"), path: "/tokens" },
            { name: t("topbar.xrc20Transfer"), path: "/tokentxns" },
            { name: t("topbar.xrc721Tokens"), path: "/xrc721-tokens" },
            { name: t("topbar.xrc721Transfer"), path: "/xrc721-tokentxns" }
          ]}
          onClick={this.hideMobileMenu}
        />
      );
    };

    public renderNetSelector = (hasShadow: boolean) => {
      return (
        <TopbarExtMenu
          hasShadow={hasShadow}
          name={t(CHAIN_MENU_ITEM.label)}
          routes={CHAIN_MENU_ITEM.items}
          onClick={this.hideMobileMenu}
        />
      );
    };

    public renderMobileMenu = () => {
      if (!this.state.displayMobileMenu) {
        return null;
      }

      return (
        <OutsideClickHandler onOutsideClick={this.hideMobileMenu}>
          <Dropdown>
            {this.renderBlockchain(true)}
            {this.renderToken(true)}
            {this.renderTools(true)}
            <StyledExternalLink
              href="https://member.iotex.io"
              target="_blank"
              onClick={this.hideMobileMenu}
            >
              {t("topbar.voting")}
            </StyledExternalLink>
            <StyledLink to="/wallet/transfer" onClick={this.hideMobileMenu}>
              {t("topbar.wallet")}
            </StyledLink>
            {this.renderNetSelector(true)}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                marginTop: "12px"
              }}
            >
              <V2Entry href="https://v2.iotexscan.io/">v2 beta</V2Entry>
            </div>
          </Dropdown>
        </OutsideClickHandler>
      );
    };

    public render(): JSX.Element {
      const { locale } = this.props;
      const displayMobileMenu = this.state.displayMobileMenu;

      return (
        <div
          style={{
            position: "relative",
            height: `${TOP_BAR_HEIGHT}px`
          }}
        >
          <Bar>
            <Flex>
              <LinkLogoWrapper to={`/`}>
                <Icon
                  height="38px"
                  width="auto"
                  margin="11px 0"
                  url={assetURL(
                    locale === "en"
                      ? "/logo_explorer.png"
                      : "/logo_explorer.png"
                  )}
                />
              </LinkLogoWrapper>
              <HiddenOnMobile>
                <CommonMargin />
                <CommonMargin />
                {this.renderBlockchain(true)}
                {this.renderToken(true)}
                {this.renderTools(true)}
                <BrandLinkExternalUrl
                  href="https://member.iotex.io"
                  target="_blank"
                  onClick={this.hideMobileMenu}
                >
                  {t("topbar.voting")}
                </BrandLinkExternalUrl>
                {this.renderWallets(true)}
                <CommonMargin />

                {this.renderNetSelector(true)}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "24px"
                  }}
                >
                  <V2Entry href="https://v2.iotexscan.io/">v2 beta</V2Entry>
                </div>
              </HiddenOnMobile>
            </Flex>
            <Flex>
              <HamburgerBtn
                onClick={this.displayMobileMenu}
                displayMobileMenu={displayMobileMenu}
              >
                <Hamburger />
              </HamburgerBtn>
              <CrossBtn displayMobileMenu={displayMobileMenu}>
                <Cross />
              </CrossBtn>
              <Flex style={{ alignItems: "center", justifyContent: "center" }}>
                <AddressConverterSwitcher
                  toEthAddress={this.props.toEthAddress}
                  onSwitch={s => {
                    this.props.dispatch(setSwitchAddress(s));
                  }}
                />
                <LanguageSwitcherMenu />
              </Flex>
            </Flex>
          </Bar>
          {this.renderMobileMenu()}
        </div>
      );
    }
  }
);

const Bar = styled("div", {
  display: "flex",
  position: "inherit",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  lineHeight: `${TOP_BAR_HEIGHT}px`,
  height: `${TOP_BAR_HEIGHT}px`,
  backgroundColor: colors.nav01,
  top: "0px",
  left: "0px",
  width: "100%",
  "z-index": "70",
  ...contentPadding,
  boxSizing: "border-box",
  boxShadow: "0",
  [media.mediaHeaderWide]: {
    position: "fixed"
  },
  [media.mediaHeaderDeskTopMin]: {
    position: "fixed"
  }
});

function HamburgerBtn({
  displayMobileMenu,
  children,
  onClick
}: {
  displayMobileMenu: boolean;
  children: Array<JSX.Element> | JSX.Element;
  onClick: Function;
}): JSX.Element {
  const Styled = styled("div", {
    ":hover": {
      color: colors.primary
    },
    color: colors.white,
    display: "none!important",
    [media.mediaHeaderWide]: {
      display: "flex!important",
      ...(displayMobileMenu ? { display: "none!important" } : {})
    },
    [media.mediaHeaderDeskTopMin]: {
      display: "flex!important",
      ...(displayMobileMenu ? { display: "none!important" } : {})
    },
    cursor: "pointer",
    justifyContent: "center",
    alignItems: "center"
  });
  return (
    <Styled
      // @ts-ignore
      onClick={onClick}
    >
      {children}
    </Styled>
  );
}

function CrossBtn({
  displayMobileMenu,
  children
}: {
  displayMobileMenu: boolean;
  children: Array<JSX.Element> | JSX.Element;
}): JSX.Element {
  const Styled = styled("div", {
    ":hover": {
      color: colors.primary
    },
    color: colors.white,
    display: "none!important",
    [media.mediaHeaderWide]: {
      display: "none!important",
      ...(displayMobileMenu ? { display: "flex!important" } : {})
    },
    [media.mediaHeaderDeskTopMin]: {
      display: "none!important",
      ...(displayMobileMenu ? { display: "flex!important" } : {})
    },
    cursor: "pointer",
    justifyContent: "center",
    alignItems: "center",
    padding: "5px"
  });
  return <Styled>{children}</Styled>;
}

const LinkLogoWrapper = styled(Link, {
  width: `${TOP_BAR_HEIGHT * 3}px`,
  height: `${TOP_BAR_HEIGHT}px`
});
const menuItem: StyleObject = {
  color: colors.topbarColor,
  textDecoration: "none",
  ":hover": {
    color: colors.primary
  },
  transition,
  padding: "0 20px",
  [media.mediaHeaderWide]: {
    boxSizing: "border-box",
    width: "100%",
    padding: "16px 0 16px 0"
  },
  [media.mediaHeaderDeskTopMin]: {
    boxSizing: "border-box",
    width: "100%",
    padding: "16px 0 16px 0"
  }
};
const BrandLinkExternalUrl = styled("a", {
  ...menuItem,
  [media.mediaHeaderWide]: {},
  [media.mediaHeaderDeskTopMin]: {}
});
// @ts-ignore
const StyledLink = styled(Link, menuItem);
const StyledExternalLink = styled("a", menuItem);

const Flex = styled("div", (_: React.CSSProperties) => ({
  flexDirection: "row",
  display: "flex",
  boxSizing: "border-box"
}));

const Dropdown = styled("div", {
  backgroundColor: colors.nav01,
  display: "flex",
  flexDirection: "column",
  ...contentPadding,
  position: "fixed",
  top: `${TOP_BAR_HEIGHT}px`,
  "z-index": "999",
  width: "100vw",
  height: "100vh",
  alignItems: "flex-end!important",
  boxSizing: "border-box"
});

const HiddenOnMobile = styled("div", {
  display: "flex!important",
  flex: 1,
  [media.mediaHeaderWide]: {
    display: "none!important"
  },
  [media.mediaHeaderDeskTopMin]: {
    display: "none!important"
  }
});
