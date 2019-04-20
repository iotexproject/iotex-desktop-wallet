// @ts-ignore
import AntdDropdown from "antd/lib/dropdown";
import Icon from "antd/lib/icon";
import Input from "antd/lib/input";
import AntdMenu from "antd/lib/menu";
import notification from "antd/lib/notification";
import { get } from "dottie";
import { publicKeyToAddress } from "iotex-antenna/lib/crypto/crypto";
// @ts-ignore
import { assetURL } from "onefx/lib/asset-url";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import React from "react";
import { Component } from "react";
import { withApollo, WithApolloClient } from "react-apollo";
import OutsideClickHandler from "react-outside-click-handler";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import {
  GetActionsRequest,
  GetBlockMetasRequest
} from "../../api-gateway/resolvers/antenna-types";
import { GET_ACTIONS, GET_BLOCK_METAS } from "../queries";
import { Logo } from "./icon";
import { Cross } from "./icons/cross.svg";
import { Hamburger } from "./icons/hamburger.svg";
import { transition } from "./styles/style-animation";
import { colors } from "./styles/style-color";
import { media, PALM_WIDTH } from "./styles/style-media";
import { contentPadding } from "./styles/style-padding";

export const TOP_BAR_HEIGHT = 62;

type State = {
  displayMobileMenu: boolean;
};

type PathParamsType = {
  hash: string;
};

type Props = RouteComponentProps<PathParamsType> & WithApolloClient<{}> & {};

class TopBarComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      displayMobileMenu: false
    };
  }

  public componentDidMount(): void {
    this.props.history.listen(() => {
      this.hideMobileMenu();
    });
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

  public searchInput = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    let { value = "" } = e.target as HTMLInputElement;
    const { history, client } = this.props;
    value = value.trim();

    if (value.startsWith("io")) {
      history.push(`/address/${value}`);
    } else if (value.length === 130) {
      history.push(`/address/${publicKeyToAddress(value)}`);
    } else if (isNormalInteger(value)) {
      try {
        const { data } = await client.query({
          query: GET_BLOCK_METAS,
          variables: {
            byIndex: {
              start: parseInt(value, 10) || 0,
              count: 1
            }
          } as GetBlockMetasRequest
        });
        if (data) {
          const hash = get(data, "getBlockMetas.blkMetas.0.hash");
          history.push(`/block/${hash}`);
        }
      } catch (error) {
        notification.error({
          message: "Error",
          description: `failed to search block: ${error.message}`,
          duration: 3
        });
      }
    } else {
      try {
        const validAction = await client.query({
          query: GET_ACTIONS,
          variables: {
            byHash: {
              actionHash: value,
              checkingPending: true
            }
          } as GetActionsRequest
        });
        if (validAction) {
          history.push(`/action/${value}`);
        }
      } catch (error) {
        try {
          const validBlock = await client.query({
            query: GET_ACTIONS,
            variables: {
              byBlk: {
                blkHash: value,
                start: 0,
                count: 1
              }
            } as GetActionsRequest
          });

          if (validBlock) {
            history.push(`/block/${value}`);
          }
        } catch (error) {
          history.push(`/notfound`);
        }
      }
    }
  };

  public renderBlockchainMenu = () => {
    return (
      <AntdMenu>
        <AntdMenu.Item key={0}>
          <StyledLink to="/actions">{t("topbar.actions")}</StyledLink>
        </AntdMenu.Item>
        <AntdMenu.Item key={1}>
          <StyledLink to="/blocks">{t("topbar.blocks")}</StyledLink>
        </AntdMenu.Item>
        <AntdMenu.Divider />
        <AntdMenu.Item key={2}>
          <A href="/api-gateway/" target="_blank">
            {t("topbar.graphql_playground")}
          </A>
        </AntdMenu.Item>
        <AntdMenu.Item key={3}>
          <A href="/doc/api-gateway/" target="_blank">
            {t("topbar.graphql_doc")}
          </A>
        </AntdMenu.Item>
      </AntdMenu>
    );
  };

  public renderMenu = () => {
    return [
      <StyledLink key={0} to="/" onClick={this.hideMobileMenu}>
        {t("topbar.home")}
      </StyledLink>,
      <AntdDropdown
        key={1}
        trigger={["click", "hover"]}
        overlay={this.renderBlockchainMenu()}
        getPopupContainer={trigger => trigger.parentElement || document.body}
      >
        <StyledLink className="ant-dropdown-link" to="#">
          {t("topbar.blockchain")} <Icon type="down" />
        </StyledLink>
      </AntdDropdown>,
      <StyledLink key={2} to="/wallet/" onClick={this.hideMobileMenu}>
        {t("topbar.wallet")}
      </StyledLink>
    ];
  };

  public renderMobileMenu = () => {
    if (!this.state.displayMobileMenu) {
      return null;
    }

    return (
      <OutsideClickHandler onOutsideClick={this.hideMobileMenu}>
        <Dropdown>{this.renderMenu()}</Dropdown>
      </OutsideClickHandler>
    );
  };

  public render(): JSX.Element {
    const displayMobileMenu = this.state.displayMobileMenu;

    return (
      <div>
        <Bar>
          <Flex>
            <LogoContent />
          </Flex>
          <Flex style={{ flex: 1, paddingLeft: 1, whiteSpace: "nowrap" }}>
            <Menu>{this.renderMenu()}</Menu>
          </Flex>
          <Flex
            className={"certain-category-search-wrapper"}
            style={{
              width: 350,
              marginBottom: 0,
              float: "right",
              padding: "0 1em"
            }}
          >
            <Input
              className={"certain-category-search"}
              placeholder={t("topbar.search")}
              onPressEnter={this.searchInput}
              suffix={
                <Icon type="search" className={"certain-category-icon"} />
              }
            />
          </Flex>
          <HamburgerBtn
            onClick={this.displayMobileMenu}
            displayMobileMenu={displayMobileMenu}
          >
            <Hamburger />
          </HamburgerBtn>
          <CrossBtn displayMobileMenu={displayMobileMenu}>
            <Cross />
          </CrossBtn>
        </Bar>
        <BarPlaceholder />
        {this.renderMobileMenu()}
      </div>
    );
  }
}

export const TopBar = withRouter(withApollo(TopBarComponent));

const Bar = styled("div", {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  lineHeight: `${TOP_BAR_HEIGHT}px`,
  height: `${TOP_BAR_HEIGHT}px`,
  backgroundColor: colors.nav01,
  color: colors.white,
  position: "fixed",
  top: "0px",
  left: "0px",
  width: "100%",
  "z-index": "70",
  ...contentPadding,
  boxSizing: "border-box"
});

const BarPlaceholder = styled("div", (_: React.CSSProperties) => {
  const height = TOP_BAR_HEIGHT / 2;
  return {
    display: "block",
    padding: `${height}px ${height}px ${height}px ${height}px`,
    backgroundColor: colors.nav01
  };
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
    display: "none!important",
    [media.palm]: {
      display: "flex!important",
      ...(displayMobileMenu ? { display: "none!important" } : {})
    },
    cursor: "pointer",
    justifyContent: "center"
  });
  return <Styled onClick={onClick}>{children}</Styled>;
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
    display: "none!important",
    [media.palm]: {
      display: "none!important",
      ...(displayMobileMenu ? { display: "flex!important" } : {})
    },
    cursor: "pointer",
    justifyContent: "center",
    padding: "5px"
  });
  return <Styled>{children}</Styled>;
}

const LogoWrapper = styled("a", {
  width: "120px",
  height: "50px"
});

function LogoContent(): JSX.Element {
  return (
    <LogoWrapper href="/">
      <Logo url={assetURL("//iotex.io/logo.svg")} />
    </LogoWrapper>
  );
}

const menuItem = {
  color: colors.white,
  marginLeft: "14px",
  textDecoration: "none",
  ":hover": {
    color: colors.primary
  },
  transition,
  fontWeight: "bold",
  [media.palm]: {
    boxSizing: "border-box",
    width: "100%",
    padding: "16px 0 16px 0",
    borderBottom: "1px #EDEDED solid"
  }
};
const A = styled("a", menuItem);
// const BrandText = styled("a", {
//   ...menuItem,
//   marginLeft: 0,
//   [media.palm]: {}
// });
// @ts-ignore
const StyledLink = styled(Link, menuItem);

const Flex = styled("div", (_: React.CSSProperties) => ({
  flexDirection: "row",
  display: "flex",
  boxSizing: "border-box"
}));

const Menu = styled("div", {
  display: "flex!important",
  [media.palm]: {
    display: "none!important"
  }
});

const Dropdown = styled("div", {
  backgroundColor: colors.nav01,
  display: "flex",
  flexDirection: "column",
  ...contentPadding,
  position: "fixed",
  top: TOP_BAR_HEIGHT,
  "z-index": "10",
  width: "100vw",
  height: "100vh",
  alignItems: "flex-end!important",
  boxSizing: "border-box"
});

function isNormalInteger(str: string): boolean {
  const n = Math.floor(Number(str));
  return n !== Infinity && String(n) === str && n >= 0;
}
