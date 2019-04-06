// @ts-ignore
import { styled } from "onefx/lib/styletron-react";
import React from "react";
import { Query, QueryResult } from "react-apollo";
import { VersionInfo } from "../../api-gateway/resolvers/meta";
import { FETCH_VERSION_INFO } from "../queries";
import { Flex } from "./flex";
import { colors } from "./styles/style-color";
import { contentPadding } from "./styles/style-padding";
import { TOP_BAR_HEIGHT } from "./top-bar";

export const FOOTER_HEIGHT = 89;

export const FOOTER_ABOVE = {
  minHeight: `calc(100vh - ${FOOTER_HEIGHT + TOP_BAR_HEIGHT}px)`
};

export function Footer(): JSX.Element {
  return (
    <Align>
      <Flex>
        <span
          style={{ marginRight: 15 }}
        >{`Copyright © ${new Date().getFullYear()}`}</span>
        <Query query={FETCH_VERSION_INFO}>
          {({
            loading,
            error,
            data
          }: QueryResult<{ fetchVersionInfo: VersionInfo }>) => {
            if (loading) {
              return "Loading...";
            }
            if (error) {
              return `Error! ${error.message}`;
            }
            if (!data) {
              return null;
            }
            return (
              <span>
                <span style={{ marginRight: 15 }}>
                  {`  iotex-explorer ${data.fetchVersionInfo.explorerVersion}`}
                </span>
                <span>
                  {`  iotex-core ${data.fetchVersionInfo.iotexCoreVersion}`}
                </span>
              </span>
            );
          }}
        </Query>
      </Flex>
      <Flex>Built with ❤️ by IoTeX</Flex>
    </Align>
  );
}

const Align = styled("div", (_: React.CSSProperties) => ({
  ...contentPadding,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingTop: "32px",
  paddingBottom: "32px",
  height: `${FOOTER_HEIGHT}px`,
  backgroundColor: colors.nav02,
  color: colors.white
}));
