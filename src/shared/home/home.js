import gql from 'graphql-tag';
import {Component} from 'react';
import {Table, Layout} from 'antd';

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

export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {counter: 0};
  }

  render() {
    return (
      <ContentPadding>
        <div>{this.state.counter}</div>
        <button onClick={e => {
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

        <Layout>
          <Layout.Content style={{backgroundColor: '#fff', padding: '8px'}}>
            <h2>ant.design heading</h2>
            <Table dataSource={dataSource} columns={columns}/>
          </Layout.Content>
        </Layout>
      </ContentPadding>
    );
  }
}
