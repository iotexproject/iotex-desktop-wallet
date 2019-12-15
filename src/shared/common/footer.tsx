import { styled } from "onefx/lib/styletron-react";
import React from "react";
import { Flex } from "./flex";
import { colors } from "./styles/style-color";
import { contentPadding } from "./styles/style-padding";
import { TOP_BAR_HEIGHT } from "./top-menu-bar";

export const ENTERPRISE_FOOTER_HEIGHT = 89;
export const LINE = "1px #EDEDED solid";

export const ENTERPRISE_FOOTER_ABOVE = {
  minHeight: `calc(100vh - ${ENTERPRISE_FOOTER_HEIGHT + TOP_BAR_HEIGHT}px)`
};

export function EnterpriseFooter(): JSX.Element {
  return (
    <Align>
      <Flex>{`Copyright © ${new Date().getFullYear()}`}</Flex>
      <Flex column={true} alignItems="flex-end">
        <Flex>讯联科技</Flex>
      </Flex>
    </Align>
  );
}

const Align = styled("div", (_: React.CSSProperties) => ({
  ...contentPadding,
  borderTop: LINE,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingTop: "32px",
  paddingBottom: "32px",
  minHeight: `${ENTERPRISE_FOOTER_HEIGHT}px`,
  color: colors.text01
}));
