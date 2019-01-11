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
import type {TCreateDeposit} from '../../entities/explorer-types';

export class CreateDeposit extends Component {
  props: {
    state: {
      createDeposit: TCreateDeposit,
      fetching: boolean,
      error: {
        code: string,
        message: string,
      },
    },
    params: {
      id: string,
    },
    fetchCreateDepositId(data: any): void,
  };

  render() {
    return (
      <div className='column container'>
        <Helmet
          title={`${t('deposit.create.title')} - IoTeX`}
        />
        <div>
          <h1 className='title'>{t('deposit.create.title')}</h1>
          <CreateDepositSummary
            createDeposit={this.props.state.createDeposit}
            fetching={this.props.state.fetching}
            error={this.props.state.error}
            id={this.props.params.id}
            fetchCreateDepositId={this.props.fetchCreateDepositId}
          />
        </div>
        <CommonMargin/>
      </div>
    );
  }
}

export class CreateDepositSummary extends Component {
  props: {
    createDeposit: TCreateDeposit,
    fetchCreateDepositId(data: any): void,
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
      this.props.fetchCreateDepositId({id: this.props.id});
    }
  }

  render() {
    const createDeposit: TCreateDeposit = this.props.createDeposit;
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
    if (!createDeposit) {
      return (
        <EmptyMessage item={t('meta.create-deposit')}/>
      );
    }

    if (createDeposit.isPending) {
      return (
        <PendingMessage/>
      );
    }
    const rows = [
      {
        c1: t('createDeposit.sender'),
        c2: createDeposit.sender === '' ? t('createDeposit.coinBase') : (<Link to={`/address/${createDeposit.sender}`} className='link'>{createDeposit.sender}</Link>),
      }, {
        c1: t('createDeposit.recipient'),
        c2: (<Link to={`/address/${createDeposit.recipient}`} className='link'>{createDeposit.recipient}</Link>),
      }, {
        c1: t('meta.amount'),
        c2: (<span>{fromRau(createDeposit.amount)} Iotx</span>),
      },
      {
        c1: t('meta.nonce'),
        c2: (<span>{createDeposit.nonce}</span>),
      },
      {
        c1: t('meta.gasLimit'),
        c2: (<span>{createDeposit.gasLimit}</span>),
      },
      {
        c1: t('meta.gasPrice'),
        c2: (<span>{createDeposit.gasPrice}</span>),
      },
      {
        c1: t('meta.timestamp'),
        c2: fromNow(createDeposit.timestamp),
      },
      {
        c1: t('meta.block'),
        c2: (<Link to={`/blocks/${createDeposit.blockId}`} className='link'>{createDeposit.blockId}</Link>),
      },
    ];
    return (
      <SingleItemTable
        subtitle={createDeposit.id}
        rows={rows}
      />
    );
  }
}
