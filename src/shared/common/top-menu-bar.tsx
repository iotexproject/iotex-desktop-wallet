import Button from "antd/lib/button";
import Col from "antd/lib/col";
import Drawer from "antd/lib/drawer";
import Icon from "antd/lib/icon";
import Menu from "antd/lib/menu";
import Row from "antd/lib/row";
import { RowProps } from "antd/lib/row";
import { Languages } from "iotex-react-language-dropdown";
import { LanguageSwitcher } from "iotex-react-language-dropdown/lib/language-switcher";
import isBrowser from "is-browser";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
// @ts-ignore
import JsonGlobal from "safe-json-globals/get";
import { assetURL } from "./asset-url";
import { Flex } from "./flex";
import { SignInModal } from "./sign-in-modal";
import { colors } from "./styles/style-color";
import { WideContentPadding } from "./styles/style-padding";

const globalState = isBrowser && JsonGlobal("state");
export const TOP_BAR_HEIGHT = 60;

const multiChain: {
  current: string;
  chains: [
    {
      name: string;
      url: string;
    }
  ];
} = {
  current: (isBrowser && globalState.base.multiChain.current) || "MAINNET",
  chains: (isBrowser && globalState.base.chainArray) || [
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
export interface INavMenuItem {
  label: string;
  path?: string;
  items?: Array<INavMenuItem>;
}

const CHAIN_MENU_ITEM = {
  label: multiChain.current,
  items: multiChain.chains.map(({ name, url }) => ({
    path: url,
    label: name
  }))
};

const IotexLogo = connect((state: { base: { isEnterprise: boolean } }) => ({
  isEnterprise: state.base.isEnterprise
}))(({ isEnterprise }: { isEnterprise: boolean }) => {
  const commonVersion = (
    <Link to="/">
      <img
        alt="iotex-logo"
        src={assetURL("/logo_explorer.png")}
        style={{
          height: 38,
          width: "auto"
        }}
      />
    </Link>
  );
  const enterpriseVersion = (
    <Link to="/">
      <Flex alignItems="center">
        <img
          alt="enterprise-logo"
          src={assetURL("/xunlian-logo.png")}
          style={{
            height: 26,
            width: "auto"
          }}
        />
        <div style={{ marginLeft: "15px" }}>
          <h4 style={{ margin: 0, fontSize: "20px", fontWeight: 600 }}>
            讯联科技
          </h4>
          <p style={{ margin: 0, fontSize: "12px", color: "#808080" }}>
            用信任链接世界
          </p>
        </div>
      </Flex>
    </Link>
  );

  return isEnterprise ? enterpriseVersion : commonVersion;
});

const HoverableStyle = {
  ":hover": {
    color: `${colors.primary} !important`
  },
  color: `${colors.topbarColor} !important`,
  cursor: "pointer"
};

const HoverableLink = styled(Link, HoverableStyle);
const HoverableA = styled("a", HoverableStyle);
const HoverableRow = styled(Row, HoverableStyle);

const SignInMenuItem = () => {
  const [visible, setVisible] = useState(false);
  return (
    <HoverableRow style={{ marginRight: 5 }}>
      <span onClick={() => setVisible(!visible)} role="menu">
        {t("topbar.sign_in")}
      </span>
      <SignInModal visible={visible} closeModal={() => setVisible(false)} />
    </HoverableRow>
  );
};

const LanguageSwitcherMenu = () => {
  return (
    <HoverableRow className="language-switcher">
      <LanguageSwitcher
        supportedLanguages={[
          Languages.EN,
          Languages.ZH_CN,
          Languages.IT,
          Languages.DE
        ]}
      />
    </HoverableRow>
  );
};

const renderMenuItem = (menu: INavMenuItem): JSX.Element => {
  const { path = "", items, label } = menu;
  if (!items) {
    return (
      <Menu.Item key={`menu-item-${label}`}>
        {path.match(/^https?:\/\//i) || path.match("/api-gateway/") ? (
          <HoverableA href={path} target="_blank" rel="noreferrer">
            {t(label)}
          </HoverableA>
        ) : (
          <HoverableLink to={path}>{t(label)}</HoverableLink>
        )}
      </Menu.Item>
    );
  }

  return (
    <Menu.SubMenu
      title={
        <HoverableRow type="flex" justify="space-between">
          <Col>
            {t(label)} <Icon style={{ fontSize: 12 }} type="down" />
          </Col>
        </HoverableRow>
      }
      key={`sub-${label}`}
      className="top-nav-submenu"
    >
      {items.map(renderMenuItem)}
    </Menu.SubMenu>
  );
};

// tslint:disable-next-line:max-func-body-length
const TopMobileMenu = ({
  enableSignIn,
  isEnterprise,
  menu
}: {
  enableSignIn?: boolean;
  isEnterprise: boolean;
  menu: Array<INavMenuItem>;
}): JSX.Element => {
  const [collapsed, setCollapsed] = useState(true);
  const icon = collapsed ? "menu" : "close";
  const mobileMenus: Array<INavMenuItem> = [...menu, CHAIN_MENU_ITEM];
  return (
    <div
      style={{
        position: "relative",
        height: TOP_BAR_HEIGHT
      }}
    >
      <WideContentPadding
        style={{
          position: "fixed",
          backgroundColor: colors.nav01,
          top: 0,
          height: TOP_BAR_HEIGHT,
          width: "100vw",
          zIndex: 9999
        }}
      >
        <Row
          type="flex"
          align="middle"
          justify="space-between"
          style={{ height: TOP_BAR_HEIGHT, color: colors.topbarColor }}
          gutter={{
            xs: 5,
            sm: 10,
            md: 20
          }}
        >
          <Col>
            <IotexLogo />
          </Col>
          <Row
            type="flex"
            align="middle"
            justify="end"
            style={{ height: TOP_BAR_HEIGHT }}
            gutter={{
              xs: 10,
              sm: 20,
              md: 40
            }}
          >
            {enableSignIn && (
              <Col>
                <SignInMenuItem />
              </Col>
            )}
            {!isEnterprise && (
              <Col>
                <LanguageSwitcherMenu />
              </Col>
            )}
            <Col>
              <Button
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  padding: 0,
                  color: colors.topbarColor,
                  fontSize: 30,
                  border: 0,
                  backgroundColor: colors.nav01
                }}
                icon={icon}
              />
            </Col>
          </Row>
        </Row>
        <Drawer
          getContainer="#top-mobile-menu-nav"
          bodyStyle={{
            padding: 0,
            paddingTop: collapsed ? 0 : TOP_BAR_HEIGHT
          }}
          visible={!collapsed}
          placement="top"
          height="100%"
        >
          <WideContentPadding>
            <Menu
              mode="inline"
              theme="dark"
              selectable={false}
              onClick={() => {
                setCollapsed(true);
              }}
              style={{
                backgroundColor: colors.nav01
              }}
            >
              {mobileMenus.map(renderMenuItem)}
            </Menu>
          </WideContentPadding>
        </Drawer>
      </WideContentPadding>
    </div>
  );
};

const TopWideMenu = ({
  enableSignIn,
  isEnterprise,
  menu
}: {
  enableSignIn?: boolean;
  isEnterprise: boolean;
  menu: Array<INavMenuItem>;
}): JSX.Element => {
  const rowProps: RowProps = {
    type: "flex",
    align: "middle",
    justify: "space-between",
    style: { height: TOP_BAR_HEIGHT, color: colors.topbarColor },
    gutter: 60
  };
  const theme = isEnterprise ? "light" : "dark";
  return (
    <WideContentPadding style={{ backgroundColor: colors.nav01 }}>
      <Row {...rowProps}>
        <Row {...rowProps}>
          <Col style={{ marginRight: 40 }}>
            <IotexLogo />
          </Col>
          <Col>
            <Menu
              theme={theme}
              mode="horizontal"
              selectable={false}
              style={{ backgroundColor: colors.nav01 }}
            >
              {menu.map(renderMenuItem)}
            </Menu>
          </Col>
        </Row>
        <Row {...rowProps} gutter={30} justify="end">
          {!isEnterprise && multiChain && (
            <Col>
              <Menu
                mode="horizontal"
                theme="dark"
                selectable={false}
                style={{ backgroundColor: colors.nav01 }}
              >
                {renderMenuItem(CHAIN_MENU_ITEM)}
              </Menu>
            </Col>
          )}
          {enableSignIn && (
            <Col>
              <SignInMenuItem />
            </Col>
          )}
          {!isEnterprise && (
            <Col>
              <LanguageSwitcherMenu />
            </Col>
          )}
        </Row>
      </Row>
    </WideContentPadding>
  );
};

const TopMenuBar = connect(
  ({
    base: { enableSignIn, isEnterprise }
  }: {
    base: { enableSignIn: boolean; isEnterprise: boolean };
  }) => ({ enableSignIn, isEnterprise })
)(
  ({
    enableSignIn,
    isEnterprise
  }: {
    enableSignIn?: boolean;
    isEnterprise: boolean;
  }): JSX.Element => {
    const MAIN_NAV_MENUS: Array<INavMenuItem> = [
      {
        label: "topbar.dashboard",
        items: [
          {
            label: "topbar.dashboard",
            path: "/"
          },
          {
            label: "topbar.actions",
            path: "/action"
          },
          {
            label: "topbar.blocks",
            path: "/block"
          },
          {
            label: "topbar.accounts",
            path: "/account"
          }
        ]
      },
      {
        label: "topbar.tokensMenu",
        items: [
          {
            label: "topbar.tokens",
            path: "/tokens"
          },
          {
            label: "topbar.xrc20Transfer",
            path: "/tokentxns"
          }
        ]
      },
      {
        label: "topbar.tools",
        items: [
          {
            label: "topbar.explorer_playground",
            path: "/api-gateway/"
          },
          {
            label: "topbar.analytics_playground",
            path: "https://analytics.iotexscan.io/"
          }
        ]
      },
      ...(isEnterprise
        ? []
        : [
            {
              label: "topbar.voting",
              path: "https://member.iotex.io"
            }
          ]),
      {
        label: "topbar.wallet",
        path: "/wallet/transfer"
      }
    ];
    return (
      <Row
        style={{
          position: "relative",
          zIndex: 9999,
          textTransform: "capitalize",
          borderBottom: isEnterprise ? "1px #EDEDED solid" : 0
        }}
      >
        <Col xs={24} lg={0}>
          <div id="top-mobile-menu-nav" />
          <TopMobileMenu
            enableSignIn={enableSignIn}
            isEnterprise={isEnterprise}
            menu={MAIN_NAV_MENUS}
          />
        </Col>
        <Col xs={0} lg={24}>
          <TopWideMenu
            enableSignIn={enableSignIn}
            isEnterprise={isEnterprise}
            menu={MAIN_NAV_MENUS}
          />
        </Col>
      </Row>
    );
  }
);
export { TopMenuBar };
