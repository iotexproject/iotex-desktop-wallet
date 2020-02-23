import AntIcon from "antd/lib/icon";
import { MouseEventHandler, useState } from "react";
import React from "react";
import { Link } from "react-router-dom";
import { styled } from "styletron-react";
import { colors } from "./styles/style-color";
import { media } from "./styles/style-media";

const SubMenuIcon = styled("i", {
  fontSize: "12px",
  position: "absolute",
  top: "-8px",
  left: "18px",
  color: "#fff",
  [media.toWide]: {
    display: "none !important"
  }
});

const SubMenuA = styled(Link, {
  color: colors.white,
  whiteSpace: "nowrap",
  textDecoration: "none",
  display: "block",
  ":hover": {
    color: colors.primary
  },
  [media.toWide]: {
    boxSizing: "border-box",
    width: "100%",
    padding: "5px"
  }
});

const ExternalSubMenuA = styled("a", {
  color: colors.white,
  whiteSpace: "nowrap",
  textDecoration: "none",
  display: "block",
  ":hover": {
    color: colors.primary
  },
  [media.toWide]: {
    boxSizing: "border-box",
    width: "100%",
    padding: "5px"
  }
});

const SubMenu = styled("div", (props: { shadow: string }) => ({
  minWidth: "120px",
  boxShadow: props.shadow ? "0" : "0 0 4px 0 #c6c6c6ba!important",
  textAlign: "left",
  backgroundColor: colors.nav02,
  position: "absolute",
  left: "-5px",
  padding: "5px 10px",
  borderBottomRightRadius: "4px",
  borderBottomLeftRadius: "4px",
  zIndex: 1,
  lineHeight: "35px",
  transition: "opacity 0.3s linear",
  [media.toWide]: {
    position: "relative",
    padding: "5px",
    borderTop: "none",
    color: "#fff",
    left: "20px",
    lineHeight: "25px",
    marginBottom: "-13px",
    backgroundColor: colors.nav01
  }
}));

export function TopbarExtMenu({
  name,
  routes,
  onClick,
  hasShadow
}: {
  name: string | JSX.Element;
  routes: Array<{ name: string | JSX.Element; path: string }>;
  onClick: MouseEventHandler;
  hasShadow: boolean;
}): JSX.Element {
  const [shouldDisplay, setShouldDisplay] = useState(false);
  const shadowAttr: string = hasShadow ? "true" : "";
  return (
    <A
      onMouseEnter={() => setShouldDisplay(true)}
      onMouseLeave={() => setShouldDisplay(false)}
      onClick={() => setShouldDisplay(true)}
    >
      {name}
      <AntIcon type="down" style={{ marginLeft: "4px" }} />
      <SubMenu
        shadow={shadowAttr}
        style={{
          opacity: shouldDisplay ? "1" : "0",
          display: shouldDisplay ? "block" : "none"
        }}
      >
        <SubMenuIcon className="fas fa-caret-up" />
        {routes.map(
          (r: { name: string | JSX.Element; path: string }, i: number) =>
            r.path.startsWith("http") ? (
              <ExternalSubMenuA key={i} href={r.path}>
                {r.name}
              </ExternalSubMenuA>
            ) : (
              <SubMenuA key={i} to={r.path} onClick={onClick}>
                {r.name}
              </SubMenuA>
            )
        )}
      </SubMenu>
    </A>
  );
}
const menuItem = {
  cursor: "pointer",
  textDecoration: "none",
  color: colors.white,
  ":hover": {
    color: colors.primary
  },
  position: "relative",
  padding: "0 20px",
  textTransform: "capitalize",
  [media.toWide]: {
    boxSizing: "border-box",
    width: "100%",
    padding: "16px 0 16px 0"
  }
};
// @ts-ignore
const A = styled("div", menuItem);
