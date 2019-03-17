import { Col, Icon, Input, Layout, Row, Statistic, Table } from "antd";
import gql from "graphql-tag";
import { Component } from "react";
import React from "react";
import { Query } from "react-apollo";
import { ContentPadding } from "../common/styles/style-padding";

const GET_CHAIN_META = gql`
  query {
    chainMeta {
      height
      numActions
      tps
      epoch {
        num
        height
      }
    }
  }
`;

const dataSource = [
  {
    key: "1",
    name: "Mike",
    age: 32,
    address: "10 Downing Street"
  },
  {
    key: "2",
    name: "John",
    age: 42,
    address: "10 Downing Street"
  }
];

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age"
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address"
  }
];

type State = {
  counter: number;
};

export class Home extends Component<{}, State> {
  public state: State = { counter: 0 };

  public render(): JSX.Element {
    return (
      <ContentPadding>
        <Row>
          <Col span={12}></Col>
          <Col span={12}>
            <div className="certain-category-search-wrapper" style={{ width: 350,marginTop: 20,marginBottom:20,float:"right"}}>
              <Input
                className="certain-category-search"
                placeholder="Search by Block # / Account / Public Key / TX"
                suffix={<Icon type="search" className="certain-category-icon" />} />
            </div>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic title="current user" value={112893} />
          </Col>
          <Col span={6}>
            <Statistic title="account" value={112893} precision={2} />
          </Col>
          <Col span={6}>
            <Statistic title="info" value={112893} />
          </Col>
          <Col span={6}>
            <Statistic title="block" value={112893} precision={2} />
          </Col>
        </Row>
        <div>{this.state.counter}</div>
        <button
          onClick={_ => {
            this.setState({ counter: this.state.counter + 1 });
          }}
        >
          +1
        </button>

        <Query query={GET_CHAIN_META}>
          {({ loading, error, data }) => {
            if (loading) {
              return "Loading...";
            }
            if (error) {
              return `Error! ${error.message}`;
            }

            return <div>{JSON.stringify(data)}</div>;
          }}
        </Query>

        <Layout tagName={"main"}>
          <Layout.Content
            tagName={"main"}
            style={{ backgroundColor: "#fff", padding: "8px" }}
          >
            <h2>ant.design heading</h2>
            <Table dataSource={dataSource} columns={columns}/>
          </Layout.Content>
        </Layout>
      </ContentPadding>
    );
  }
}
