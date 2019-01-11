// @flow
import {fromRau} from 'iotex-client-js/dist/account/utils';
import Component from 'inferno-component';
import Helmet from 'inferno-helmet';
import isBrowser from 'is-browser';
import {Link} from 'inferno-router';
import {CommonMargin} from '../common/common-margin';
import {EmptyMessage, ErrorMessage, LoadingMessage, PendingMessage} from '../common/message';
import {t} from '../../lib/iso-i18n';
import {SingleItemTable} from '../common/single-item-table';
import {fromNow} from '../common/from-now';
import type {TSettleDeposit} from '../../entities/explorer-types';

export class SettleDeposit extends Component {
  props: {
    state: {
      settleDeposit: TSettleDeposit,
      fetching: boolean,
      error: {
        code: string,
        message: string,
      },
    },
    params: {
      id: string,
    },
    fetchSettleDepositId(data: any): void,
  };

  render() {
    return (
      <div className='column container'>
        <Helmet
          title={`${t('deposit.settle.title')} - IoTeX`}
        />
        <div>
          <h1 className='title'>{t('deposit.settle.title')}</h1>
          <SettleDepositSummary
            settleDeposit={this.props.state.settleDeposit}
            fetching={this.props.state.fetching}
            error={this.props.state.error}
            id={this.props.params.id}
            fetchSettleDepositId={this.props.fetchSettleDepositId}
          />
        </div>
        <CommonMargin/>
      </div>
    );
  }
}

export class SettleDepositSummary extends Component {
  props: {
    settleDeposit: TSettleDeposit,
    fetchSettleDepositId(data: any): void,
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
      this.props.fetchSettleDepositId({id: this.props.id});
    }
  }

  render() {
    const settleDeposit: TSettleDeposit = this.props.settleDeposit;
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
    if (!settleDeposit) {
      return (
        <EmptyMessage item={t('meta.settle-deposit')}/>
      );
    }
    if (settleDeposit.isPending) {
      return (
        <PendingMessage/>
      );
    }
    const rows = [
      {
        c1: t('settleDeposit.sender'),
        c2: settleDeposit.sender === '' ? t('settleDeposit.coinBase') : (<Link to={`/address/${settleDeposit.sender}`} className='link'>{settleDeposit.sender}</Link>),
      }, {
        c1: t('settleDeposit.recipient'),
        c2: (<Link to={`/address/${settleDeposit.recipient}`} className='link'>{settleDeposit.recipient}</Link>),
      }, {
        c1: t('meta.amount'),
        c2: (<span>{fromRau(settleDeposit.amount)} Iotx</span>),
      },
      {
        c1: t('meta.nonce'),
        c2: (<span>{settleDeposit.nonce}</span>),
      },
      {
        c1: t('meta.gasLimit'),
        c2: (<span>{settleDeposit.gasLimit}</span>),
      },
      {
        c1: t('meta.gasPrice'),
        c2: (<span>{settleDeposit.gasPrice}</span>),
      },
      {
        c1: t('meta.timestamp'),
        c2: fromNow(settleDeposit.timestamp),
      },
      {
        c1: t('meta.block'),
        c2: (<Link to={`/blocks/${settleDeposit.blockId}`} className='link'>{settleDeposit.blockId}</Link>),
      },
    ];
    return (
      <SingleItemTable
        subtitle={settleDeposit.id}
        rows={rows}
      />
    );
  }
}
