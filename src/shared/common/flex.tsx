// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import React from "react";

type Element = JSX.Element | string | boolean;

type PropTypes = {
  children?: Array<Element> | Element;
  column?: boolean;
  center?: boolean;
  nowrap?: boolean;
  alignItems?: string;
  width?: string;
  backgroundColor?: string;
  justifyContent?: string;
  height?: string;
  media?: { [key: string]: string };
  alignContent?: string;
} & React.CSSProperties;

const AUTO = "auto";

// @ts-ignore
export function Flex({
  children,
  column = false,
  center,
  nowrap,
  alignItems,
  width = AUTO,
  height = AUTO,
  media = {},
  alignContent = AUTO,
  backgroundColor = AUTO,
  justifyContent,
  ...otherProps
}: PropTypes): JSX.Element {
  // @ts-ignore
  const StyledDiv = styled("div", {
    display: "flex",
    "-webkit-box-flex": 1,
    flexDirection: column ? "column" : "row",
    justifyContent: justifyContent
      ? justifyContent
      : center
      ? "center"
      : "space-between",
    "-webkit-justify-content": center ? "center" : "space-between",
    boxSizing: "border-box",
    flexWrap: nowrap ? "nowrap" : "wrap",
    alignContent: alignContent || (center ? "center" : "space-between"),
    alignItems: alignItems || "center",
    width,
    height,
    ...media,
    backgroundColor,
    ...otherProps
  });

  return <StyledDiv>{children}</StyledDiv>;
}

// @ts-ignore
export const CenterFlex = styled("div", {
  display: "flex",
  "-webkit-box-flex": 1,
  justifyContent: "center",
  "-webkit-justify-content": "center",
  alignContent: "center",
  alignItems: "center",
  width: "100%"
});
