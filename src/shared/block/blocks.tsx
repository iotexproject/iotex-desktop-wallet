import { Layout } from "antd";
import React, { Component } from "react";
import { Flex } from "../common/flex";
import { colors } from "../common/styles/style-color";
import { ContentPadding } from "../common/styles/style-padding";
import { BlockTable } from "./block-table";

type State = {};

export class Blocks extends Component<{}, State> {
  public state: State = {};

  public render(): JSX.Element {
    return (
      <ContentPadding>
        <Layout tagName={"main"} className={"main-container"}>
          <Layout.Content tagName={"main"}>
            <Flex
              backgroundColor={colors.white}
              column={true}
              alignItems={"baselines"}
            >
              <h1 style={{ padding: "16px" }}>Blocks</h1>
              <BlockTable />
            </Flex>
          </Layout.Content>
        </Layout>
      </ContentPadding>
    );
  }
}
