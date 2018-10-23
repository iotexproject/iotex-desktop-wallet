// @flow
import Component from 'inferno-component';
import Helmet from 'inferno-helmet';
import isBrowser from 'is-browser';
import {Link} from 'inferno-router';
import {CommonMargin} from '../common/common-margin';
import type {TTransfer} from '../../entities/explorer-types';
import {EmptyMessage, ErrorMessage, LoadingMessage, PendingMessage} from '../common/message';
import {t} from '../../lib/iso-i18n';
import {SingleItemTable} from '../common/single-item-table';
import {fromNow} from '../common/from-now';

export class Transfer extends Component {
  props: {
    state: {
      transfer: TTransfer,
      fetching: boolean,
      error: {
        code: string,
        message: string,
      },
    },
    params: {
      id: string,
    },
    fetchTransferId(data: any): void,
  };

  render() {
    return (
      <div className='column container'>
        <Helmet
          title={`${t('transfer.title')} - IoTeX`}
        />
        <div>
          <h1 className='title'>{t('transfer.title')}</h1>
          <TransferSummary
            transfer={this.props.state.transfer}
            fetching={this.props.state.fetching}
            error={this.props.state.error}
            id={this.props.params.id}
            fetchTransferId={this.props.fetchTransferId}
          />
        </div>
        <CommonMargin/>
      </div>
    );
  }
}

export class TransferSummary extends Component {
  props: {
    transfer: TTransfer,
    fetchTransferId(data: any): void,
    error: {
      code: string,
      message: {
        code: string,
      },
    },
    fetching: boolean,
    id: string,
  };

  componentWillMount() {
    if (isBrowser) {
      this.props.fetchTransferId({id: this.props.id});
    }
  }

  render() {
    const transfer: TTransfer = this.props.transfer;
    if (this.props.fetching) {
      return (
        <LoadingMessage
          fakeRows={false}
        />
      );
    }
    if (this.props.error) {
      return (
        <ErrorMessage
          error={this.props.error}
        />
      );
    }
    if (!transfer) {
      return (
        <EmptyMessage item={t('meta.transfer')}/>
      );
    }
    if (transfer.isPending) {
      return (
        <PendingMessage/>
      );
    }
    const rows = [
      {
        c1: t('transfer.sender'),
        c2: transfer.sender === '' ? t('transfer.coinBase') : (<Link to={`/address/${transfer.sender}`} className='link'>{transfer.sender}</Link>),
      }, {
        c1: t('transfer.recipient'),
        c2: (<Link to={`/address/${transfer.recipient}`} className='link'>{transfer.recipient}</Link>),
      }, {
        c1: t('meta.amount'),
        c2: (transfer.amount),
      },
      // {
      //   c1: t('transfer.fee'),
      //   c2: (transfer.fee),
      // },
      {
        c1: t('meta.timestamp'),
        c2: fromNow(transfer.timestamp),
      }, {
        c1: t('meta.block'),
        c2: (<Link to={`/blocks/${transfer.blockId}`} className='link'>{transfer.blockId}</Link>),
      },
    ];
    if (transfer.payload) {
      // eslint-disable-next-line no-undef
      const output = new Buffer(transfer.payload, 'hex');
      rows.push({c1: t('meta.payload'), c2: `${(output.toString())}`});
    }
    return (
      <SingleItemTable
        subtitle={transfer.id}
        rows={rows}
      />
    );
  }
}
