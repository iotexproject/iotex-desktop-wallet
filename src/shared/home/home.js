import {Component} from 'react';

import {ContentPadding} from '../common/styles/style-padding';

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
      </ContentPadding>
    );
  }
}
