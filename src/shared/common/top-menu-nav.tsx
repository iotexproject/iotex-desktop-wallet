import { Button, Col, Drawer, Icon, Row } from "antd";
import { Languages } from "iotex-react-language-dropdown";
import { LanguageSwitcher } from "iotex-react-language-dropdown/lib/language-switcher";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { CSSProperties, useState } from "react";
import { Link } from "react-router-dom";
import { assetURL } from "./asset-url";
import { colors } from "./styles/style-color";
import { ContentPadding } from "./styles/style-padding";

export interface INavMenuItem {
  name: string;
  label: string;
  path?: string;
  items?: Array<INavMenuItem>;
}

const MAIN_MENUS: Array<INavMenuItem> = [
  {
    name: "dashboard",
    label: t("topbar.dashboard"),
    items: [
      {
        name: "dashboard",
        label: t("topbar.dashboard"),
        path: "/"
      },
      {
        name: "actions",
        label: t("topbar.actions"),
        path: "/action"
      },
      {
        name: "blocks",
        label: t("topbar.blocks"),
        path: "/block"
      }
    ]
  },
  {
    name: "tools",
    label: t("topbar.tools"),
    items: [
      {
        name: "explorer_playground",
        label: t("topbar.analytics_playground"),
        path: "/api-gateway/"
      },
      {
        name: "analytics_playground",
        label: t("topbar.analytics_playground"),
        path: "https://analytics.iotexscan.io/"
      }
    ]
  },
  {
    name: "vote",
    label: t("topbar.voting"),
    path: "https://member.iotex.io"
  },
  {
    name: "wallet",
    label: t("topbar.wallet"),
    path: "/wallet"
  }
];

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

const TopMobileMenu = (): JSX.Element => {
  const [collapsed, setCollapsed] = useState(true);
  const icon = collapsed ? "menu" : "close";
  return (
    <Row
      type="flex"
      align="middle"
      justify="space-between"
      style={{ height: 80 }}
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
          >
            <Drawer
              placement="top"
              closable={false}
              onClose={() => setCollapsed(true)}
              visible={!collapsed}
              className="top-menu-drawer"
              style={{ backgroundColor: colors.nav02 }}
              bodyStyle={{ backgroundColor: colors.transparent }}
            ></Drawer>
          </Button>
        </Col>
      </Row>
    </Row>
  );
};

const TopWideMenu = (): JSX.Element => {
  return (
    <Row
      type="flex"
      align="middle"
      justify="space-between"
      style={{ height: 80 }}
    >
      <Col>
        <IotexLogo />
      </Col>
      <Col></Col>
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
