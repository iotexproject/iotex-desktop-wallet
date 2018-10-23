// @flow

import Component from 'inferno-component';
import Helmet from 'inferno-helmet';
import isBrowser from 'is-browser';
import window from 'global';
import {CommonMargin} from '../common/common-margin';
import {TableWrapper} from '../common/table-wrapper';
import type {TDelegate} from '../../entities/delegate-types';

export class Delegates extends Component {

  constructor(props: any) {
    super(props);
  }

  componentWillMount() {
    if (isBrowser) {
      this.props.fetchDelegates();
    }
  }

  componentDidMount() {
    if (isBrowser) {
      const fetchDelegates = window.setInterval(() => this.props.fetchDelegates(), 5000);
      this.setState({fetchDelegates});
    }
  }

  componentWillUnmount() {
    window.clearInterval(this.state.fetchDelegates);
  }

  render() {
    const {delegates, width} = this.props;

    return (
      <div className='column container'>
        <Helmet
          title={'Delegate - IoTeX'}
        />
        <div>
          <h1 className='title'>Delegates</h1>
          <TableWrapper
            fetching={delegates.fetching}
            error={delegates.error}
            items={delegates.items}
            name={'Delegates'}
            displayPagination={false}
            displayViewMore={false}>
            {<DelegatesList
              delegates={delegates.items}
              width={width}
              sortAddress={this.props.sortAddress}
            />}
          </TableWrapper>
        </div>
        <CommonMargin/>
      </div>
    );
  }
}

export class DelegatesList extends Component {
  props: {
    delegates: Array<TDelegate>,
    width: string,
    sortAddress: any,
  };

  render() {
    const {delegates} = this.props;

    return (
      <table className='bx--data-table-v2'>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Address <button onClick={this.props.sortAddress}>Sort</button></th>
            <th>Creation Height</th>
            <th>Last Update Height</th>
            <th>Total Vote</th>
          </tr>
        </thead>
        <tbody>
          {delegates.map((d, i) => (
            <tr style={{backgroundColor: d.isDelegate ? (d.isProducer ? 'green' : 'blue') : ''}} className='bx--parent-row-v2' data-parent-row>
              <td>{i + 1}</td>
              <td>{d.address}</td>
              <td>{d.creationHeight}</td>
              <td>{d.lastUpdateHeight}</td>
              <td>{d.totalVote}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
