// @flow

import Component from 'inferno-component';
import Helmet from 'inferno-helmet';
import {Link} from 'inferno-router';
import isBrowser from 'is-browser';
import {CommonMargin} from '../common/common-margin';
import type {TTransfer} from '../../entities/explorer-types';
import {TableWrapper} from '../common/table-wrapper';
import {ellipsisText, hideColClass, singleColEllipsisText} from '../common/utils';
import type {Error} from '../../entities/common-types';
import {t} from '../../lib/iso-i18n';
import {EmptyMessage} from '../common/message';
import type {fetchTransfers} from './transfers-actions';

type PropsType = {
  statistic: {
    height: number,
  },
};

export class Transfers extends Component {
  props: {
    state: {
      fetching: boolean,
      error: Error,
      offset: number,
      count: number,
      items: Array<TTransfer>,
      total: number,
      tip: number,
    },
    fetchTransfers: fetchTransfers,
    width: number,
    statistic: {
      height: number,
    },
  };

  constructor(props: any) {
    super(props);
    this.state = {
      height: 0,
    };
  }

  componentWillMount() {
    if (isBrowser) {
      this.props.fetchTransfers({tip: this.state.height, offset: 0, count: this.props.state.count});
    }
  }

  componentWillReceiveProps(nextProps: PropsType, nextContext: any) {
    if (nextProps.statistic && this.state.height !== nextProps.statistic.height) {
      this.setState(state => {
        state.height = nextProps.statistic.height;
      }, () => {
        if (this.props.state.offset === 0) {
          this.props.fetchTransfers({tip: this.state.height, offset: 0, count: this.props.state.count});
        }
      });
    }
  }

  render() {
    return (
      <div className='column container'>
        <Helmet
          title={`${t('meta.transfers')} - IoTeX`}
        />
        <div>
          <h1 className='title'>{t('meta.transfers')}</h1>
          <TableWrapper
            fetching={this.props.state.fetching}
            error={this.props.state.error}
            offset={this.props.state.offset}
            count={this.props.state.count}
            items={this.props.state.items}
            fetch={this.props.fetchTransfers}
            tip={this.props.state.tip}
            name={t('meta.transfers')}
            displayPagination={true}
          >
            {<TransfersListOnlyId
              transfers={this.props.state.items}
              width={this.props.width}
              isHome={false}
            />}
          </TableWrapper>
        </div>
        <CommonMargin/>
      </div>
    );
  }
}

export class TransfersList extends Component {
  props: {
    transfers: Array<TTransfer>,
    width: string,
  };

  render() {
    let transfers = this.props.transfers;
    // null
    if (!transfers) {
      return (
        <EmptyMessage item={t('meta.transfers')}/>
      );
    }
    // only 1 item
    if (!Array.isArray(transfers)) {
      transfers = [transfers];
    }
    return (
      <table className='bx--data-table-v2'>
        <thead>
          <tr>
            <th className={hideColClass(this.props.width) ? 'first-col' : 'none-on-palm'}>{t('transfer.hash')}</th>
            <th className={hideColClass(this.props.width) ? '' : 'second-to-none-header'}>{t('transfer.sender')}</th>
            <th>{t('transfer.recipient')}</th>
            <th>{t('meta.amount')}</th>
          </tr>
        </thead>
        <tbody>
          {transfers.map((transfer: TTransfer) => (
            <tr className='bx--parent-row-v2' data-parent-row>
              <td className={hideColClass(this.props.width) ? 'first-col' : 'none-on-palm'}><Link to={`/transfers/${transfer.id}`} className='link'>{ellipsisText(transfer.id, this.props.width)}</Link></td>
              {transfer.sender === '' ?
                <td>{t('transfer.coinBase')}</td> :
                <td className={hideColClass(this.props.width) ? '' : 'second-to-none'}><Link to={`/address/${transfer.sender}`} className='link'>{ellipsisText(transfer.sender, this.props.width)}</Link></td>
              }
              <td><Link to={`/address/${transfer.recipient}`} className='link'>{ellipsisText(transfer.recipient, this.props.width)}</Link></td>
              <td>{hideColClass(this.props.width) ? transfer.amount : <Link to={`/transfers/${transfer.id}`} className='link'>{transfer.amount}</Link>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export class TransfersListOnlyId extends Component {
  props: {
    transfers: Array<TTransfer>,
    width: number,
    isHome: boolean,
  };

  render() {
    let transfers = this.props.transfers;
    // null
    if (!transfers) {
      return (
        <EmptyMessage item={t('meta.transfers')}/>
      );
    }
    // only 1 item
    if (!Array.isArray(transfers)) {
      transfers = [transfers];
    }
    return (
      <table className='bx--data-table-v2'>
        <thead>
          <tr>
            <th className='single-col-header'>{t('transfer.hash')}</th>
          </tr>
        </thead>
        <tbody>
          {transfers.map((transfer: TTransfer) => (
            <tr className='bx--parent-row-v2' data-parent-row>
              <td className='single-col-row'><Link to={`/transfers/${transfer.id}`} className='link'>{singleColEllipsisText(transfer.id, this.props.width, this.props.isHome)}</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

