import gql from 'graphql-tag';
import {Component} from 'react';

import {Query} from 'react-apollo';
import {ContentPadding} from '../common/styles/style-padding';

const GET_HEALTH = gql`
  {
    health
  }
`;

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
      </ContentPadding>
    );
  }
}
