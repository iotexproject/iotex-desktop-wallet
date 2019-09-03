import { Button, Col, Drawer, Dropdown, Icon, Menu, Row } from "antd";
import { RowProps } from "antd/lib/row";
// @ts-ignore
import window from "global/window";
import { Languages } from "iotex-react-language-dropdown";
import { LanguageSwitcher } from "iotex-react-language-dropdown/lib/language-switcher";
import isBrowser from "is-browser";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
// @ts-ignore
import JsonGlobal from "safe-json-globals/get";
import { assetURL } from "./asset-url";
import { colors } from "./styles/style-color";
import { ContentPadding } from "./styles/style-padding";

const globalState = isBrowser && JsonGlobal("state");

const multiChain: {
  current: string;
  chains: [
    {
      name: string;
      url: string;
    }
  ];
} = (isBrowser && globalState.base.multiChain) || {
  current: "mainnet",
  chains: [
    {
      name: "mainnet",
      url: "https://iotexscan.io/"
    },
    {
      name: "testnet",
      url: "https://testnet.iotexscan.io/"
    }
  ]
};
export interface INavMenuItem {
  label: string;
  path?: string;
  items?: Array<INavMenuItem>;
}

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
      }
    ]
  },
  {
    label: "topbar.tools",
    items: [
      {
        label: "topbar.explorer_playground",
        path: "/api-gateway"
      },
      {
        label: "topbar.analytics_playground",
        path: "https://analytics.iotexscan.io/"
      }
    ]
  },
  {
    label: "topbar.voting",
    path: "https://member.iotex.io"
  },
  {
    label: "topbar.wallet",
    path: "/wallet"
  }
];

const CHAIN_MENU_ITEM = {
  label: multiChain.current,
  items: multiChain.chains.map(({ name, url }) => ({
    path: url,
    label: name
  }))
};

const IotexLogo = () => (
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

const HoverableStyle = {
  ":hover": {
    color: `${colors.primary} !important`
  },
  cursor: "pointer"
};

const HoverableLink = styled(Link, HoverableStyle);
const HoverableA = styled("a", HoverableStyle);
const HoverableDiv = styled("div", HoverableStyle);

const TopMobileMenu = (): JSX.Element => {
  const [collapsed, setCollapsed] = useState(true);
  const icon = collapsed ? "menu" : "close";
  const mobileMenus: Array<INavMenuItem> = [...MAIN_NAV_MENUS, CHAIN_MENU_ITEM];
  if (isBrowser) {
    window.document.body.style.overflow = collapsed ? "" : "hidden";
  }
  return (
    <div>
      <Row
        type="flex"
        align="middle"
        justify="space-between"
        style={{ height: 80 }}
        onClick={() => !collapsed && setCollapsed(true)}
      >
        <Col>
          <IotexLogo />
        </Col>
        <Row
          type="flex"
          align="middle"
          justify="end"
          style={{ height: 80, color: colors.white }}
        >
          <Col>
            <LanguageSwitcher
              supportedLanguages={[
                Languages.EN,
                Languages.ZH_CN,
                Languages.IT,
                Languages.DE
              ]}
            />
          </Col>
          <Col>
            <Button
              onClick={() => setCollapsed(!collapsed)}
              style={{
                padding: 0,
                color: colors.white,
                fontSize: 30,
                backgroundColor: "rgba(0,0,0,0)",
                border: 0
              }}
              icon={icon}
            ></Button>
          </Col>
        </Row>
      </Row>
      <Row
        style={{
          height: collapsed ? 0 : "100vh",
          backgroundColor: colors.nav01
        }}
      >
        {mobileMenus.map((item, i) => (
          <Col xs={24} key={`menu-item-${i}`}>
            <TopMenuItem menu={item} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

const TopMenuItem = ({ menu }: { menu: INavMenuItem }): JSX.Element => {
  const { path = "", items, label } = menu;
  const itemStyle = {
    cursor: "pointer",
    color: colors.white
  };
  if (!items) {
    if (path.match(/^https?:\/\//i)) {
      return (
        <HoverableA
          style={itemStyle}
          href={path}
          target="_blank"
          rel="noreferrer"
        >
          {t(label)}
        </HoverableA>
      );
    }
    return (
      <HoverableLink style={itemStyle} to={path}>
        {t(label)}
      </HoverableLink>
    );
  }
  const overlayMenu = (
    <Menu
      style={{
        border: 0,
        borderRadius: 0,
        paddingTop: 30,
        backgroundColor: colors.nav01,
        cursor: "pointer",
        minWidth: 150
      }}
    >
      {items.map((item, i) => (
        <Menu.Item key={`${item.label}-${i}`}>
          <TopMenuItem menu={item} />
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <Dropdown trigger={["hover"]} overlay={overlayMenu}>
      <HoverableDiv style={itemStyle}>
        <span>{t(label)}</span>
        <Icon type="caret-down" style={{ paddingLeft: 24 }} />
      </HoverableDiv>
    </Dropdown>
  );
};

const TopWideMenu = (): JSX.Element => {
  const rowProps: RowProps = {
    type: "flex",
    align: "middle",
    justify: "space-between",
    style: { height: 80, color: colors.white },
    gutter: 60
  };
  return (
    <Row {...rowProps}>
      <Row {...rowProps}>
        <Col style={{ marginRight: 40 }}>
          <IotexLogo />
        </Col>
        {MAIN_NAV_MENUS.map((item, i) => (
          <Col>
            <TopMenuItem menu={item} />
          </Col>
        ))}
      </Row>
      <Row {...rowProps} gutter={30} justify="end">
        {multiChain && (
          <Col>
            <TopMenuItem
              menu={{
                label: multiChain.current,
                items: multiChain.chains.map(({ name, url }) => ({
                  path: url,
                  label: name
                }))
              }}
            />
          </Col>
        )}
        <Col>
          <LanguageSwitcher
            supportedLanguages={[
              Languages.EN,
              Languages.ZH_CN,
              Languages.IT,
              Languages.DE
            ]}
          />
        </Col>
      </Row>
    </Row>
  );
};

const TopMenuNav = (): JSX.Element => {
  return (
    <ContentPadding
      style={{
        backgroundColor: colors.nav01
      }}
    >
      <Row>
        <Col xs={24} lg={0}>
          <TopMobileMenu />
        </Col>
        <Col xs={0} lg={24}>
          <TopWideMenu />
        </Col>
      </Row>
    </ContentPadding>
  );
};
export { TopMenuNav };
