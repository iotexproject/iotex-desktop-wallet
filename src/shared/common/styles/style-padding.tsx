import { styled } from "onefx/lib/styletron-react";
import React, { CSSProperties } from "react";

import { CenterFlex } from "../flex";
import { media } from "./style-media";

export const wideContentPadding = {
  paddingLeft: "16px",
  paddingRight: "16px"
};

export const contentPadding = {
  width: "100%",
  [media.palm]: wideContentPadding,
  paddingLeft: "6.6vw",
  paddingRight: "6.6vw",
  [media.deskWide]: {
    paddingLeft: "16vw",
    paddingRight: "16vw"
  }
};

const Pd = styled("div", contentPadding);

export const ContentPadding = ({
  children,
  style
}: {
  // tslint:disable-next-line:no-any
  children: any;
  style?: CSSProperties;
}) => (
  <Pd style={style}>
    <CenterFlex>
      <div style={{ maxWidth: "1320px", width: "100%" }}>{children}</div>
    </CenterFlex>
  </Pd>
);

export const WideContentPadding = styled("div", contentPadding);
