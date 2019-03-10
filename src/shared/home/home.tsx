import {Layout, Table} from 'antd';
import gql from 'graphql-tag';
import {Component} from 'react';
import React from 'react';
import {Query} from 'react-apollo';
import {ContentPadding} from '../common/styles/style-padding';

const GET_HEALTH = gql`
  {
    health
  }
`;

const dataSource = [{
  key: '1',
  name: 'Mike',
  age: 32,
  address: '10 Downing Street',
}, {
  key: '2',
  name: 'John',
  age: 42,
  address: '10 Downing Street',
}];

const columns = [{
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
}, {
  title: 'Age',
  dataIndex: 'age',
  key: 'age',
}, {
  title: 'Address',
  dataIndex: 'address',
  key: 'address',
}];

type State = {
  counter: number,
}

export class Home extends Component<{}, State> {
  public state: State = {counter: 0};

  public render(): JSX.Element {
    return (
      <ContentPadding>
        <div>{this.state.counter}</div>
        <button onClick={_ => {
          this.setState({counter: this.state.counter + 1});
        }}>+1
        </button>

        <Query query={GET_HEALTH}>
          {({loading, error, data}) => {
            if (loading) {
              return 'Loading...';
            }
            if (error) {
              return `Error! ${error.message}`;
            }

            return (
              <div>{JSON.stringify(data)}</div>
            );
          }}
        </Query>

        <Layout tagName={'main'}>
          <Layout.Content tagName={'main'} style={{backgroundColor: '#fff', padding: '8px'}}>
            <h2>ant.design heading</h2>
            <Table dataSource={dataSource} columns={columns}/>
          </Layout.Content>
        </Layout>
      </ContentPadding>
    );
  }
}
