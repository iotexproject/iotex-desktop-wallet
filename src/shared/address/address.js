// @flow
import {fromRau} from 'iotex-client-js/dist/account/utils';
import Component from 'inferno-component';
import Helmet from 'inferno-helmet';
import isBrowser from 'is-browser';
import window from 'global/window';
import {CommonMargin} from '../common/common-margin';
import {ExecutionsListOnlyId} from '../executions/executions';
import {TransfersListOnlyId} from '../transfers/transfers';
import type {TAddressDetails, TTransfer, TVote} from '../../entities/explorer-types';
import {EmptyMessage, ErrorMessage, LoadingMessage} from '../common/message';
import type {Error} from '../../entities/common-types';
import {t} from '../../lib/iso-i18n';
import {SingleItemTable} from '../common/single-item-table';
import {SingleColTable} from '../common/single-col-table';
import {VotesListOnlyId} from '../votes/votes';
import {SettleDepositsListOnlyId} from '../deposit/settle-deposit';
import {CreateDepositsListOnlyId} from '../deposit/create-deposit';
import {isValidRawAddress} from '../wallet/validator';
import type {TExecution} from '../../entities/explorer-types';
import type {TSettleDeposit} from '../../entities/wallet-types';
import type {fetchAddressId,
  fetchAddressTransfersId,
  fetchAddressExecutionsId,
  fetchAddressSettleDepositsId,
  fetchAddressCreateDepositsId,
} from './address-actions';
import {fetchAddressVotersId} from './address-actions';

type PropsType = {
  id: string,
};

export class Address extends Component {
  props: {
    fetchAddressId: fetchAddressId;
    fetchAddressExecutionsId: fetchAddressExecutionsId;
    fetchAddressTransfersId: fetchAddressTransfersId;
    fetchAddressVotersId: fetchAddressVotersId;
    fetchAddressSettleDepositsId: fetchAddressSettleDepositsId;
    fetchAddressCreateDepositsId: fetchAddressCreateDepositsId;
    params: {
      id: string
    },
    state: any,
    width: number,
  };

  render() {
    return (
      <div className='column container'>
        <Helmet
          title={`${t('address.title')} - IoTeX`}
        />
        <div>
          <h1 className='title'>{t('address.title')}</h1>
          <AddressSummary
            id={this.props.params.id}
            state={this.props.state}
            fetchAddressId={this.props.fetchAddressId}
            fetchAddressExecutionsId={this.props.fetchAddressExecutionsId}
            fetchAddressTransfersId={this.props.fetchAddressTransfersId}
            fetchAddressVotersId={this.props.fetchAddressVotersId}
            fetchAddressSettleDepositsId={this.props.fetchAddressSettleDepositsId}
            fetchAddressCreateDepositsId={this.props.fetchAddressCreateDepositsId}
            width={this.props.width}
          />
        </div>
        <CommonMargin/>
      </div>
    );
  }
}

export class AddressSummary extends Component {
  props: {
    fetchAddressId: fetchAddressId,
    fetchAddressExecutionsId: fetchAddressExecutionsId,
    fetchAddressTransfersId: fetchAddressTransfersId,
    fetchAddressVotersId: fetchAddressVotersId,
    fetchAddressSettleDepositsId: fetchAddressSettleDepositsId,
    fetchAddressCreateDepositsId: fetchAddressCreateDepositsId,
    state: {
      address: TAddressDetails,
      error: Error,
      executions: {
        items: Array<TExecution>,
        fetching: boolean,
        error: Error,
        offset: number,
        count: number,
      },
      transfers: {
        items: Array<TTransfer>,
        fetching: boolean,
        error: Error,
        offset: number,
        count: number,
      },
      voters: {
        items: Array<TVote>,
        fetching: boolean,
        error: Error,
        offset: number,
        count: number,
      },
      settleDeposits: {
        items: Array<TSettleDeposit>,
        fetching: boolean,
        error: Error,
        offset: number,
        count: number,
      },
      createDeposits: {
        items: Array<TCreateDeposit>,
        fetching: boolean,
        error: Error,
        offset: number,
        count: number,
      },
    },
    fetching: boolean,
    id: string,
    width: number,
  };

  constructor(props: PropsType) {
    super(props);
    this.state = {
      fetchAddressExecutionsId: 0,
      fetchAddressTransfersId: 0,
      fetchAddressVotersId: 0,
      fetchAddressSettleDepositsId: 0,
      fetchAddresscreateDepositsId: 0,
    };
  }

  componentWillMount() {
    if (isBrowser) {
      this.props.fetchAddressId({id: this.props.id});
      this.props.fetchAddressExecutionsId({id: this.props.id, offset: 0, count: this.props.state.executions.count});
      this.props.fetchAddressTransfersId({id: this.props.id, offset: 0, count: this.props.state.transfers.count});
      this.props.fetchAddressVotersId({id: this.props.id, offset: 0, count: this.props.state.voters.count});
      this.props.fetchAddressSettleDepositsId({id: this.props.id, offset: 0, count: this.props.state.settleDeposits.count});
      this.props.fetchAddressCreateDepositsId({id: this.props.id, offset: 0, count: this.props.state.createDeposits.count});
    }
  }

  componentDidMount() {
    const fetchAddressExecutionsId = window.setInterval(() => {
      if (this.props.state.executions.offset === 0) {
        this.props.fetchAddressExecutionsId({
          id: this.props.id,
          offset: this.props.state.executions.offset,
          count: this.props.state.executions.count,
        });
      }
    }, 30000);
    this.setState({fetchAddressExecutionsId});

    const fetchAddressTransfersId = window.setInterval(() => {
      if (this.props.state.transfers.offset === 0 && isValidRawAddress(this.props.id) === '') {
        this.props.fetchAddressTransfersId({
          id: this.props.id,
          offset: this.props.state.transfers.offset,
          count: this.props.state.transfers.count,
        });
      }
    }, 30000);
    this.setState({fetchAddressTransfersId});

    const fetchAddressVotersId = window.setInterval(() => {
      if (this.props.state.voters.offset === 0 && isValidRawAddress(this.props.id) === '') {
        this.props.fetchAddressVotersId({
          id: this.props.id,
          offset: this.props.state.voters.offset,
          count: this.props.state.voters.count,
        });
      }
    }, 30000);
    this.setState({fetchAddressVotersId});

    const fetchAddressSettleDepositsId = window.setInterval(() => {
      if (this.props.state.settleDeposits.offset === 0 && isValidRawAddress(this.props.id) === '') {
        this.props.fetchAddressSettleDepositsId({
          id: this.props.id,
          offset: this.props.state.settleDeposits.offset,
          count: this.props.state.settleDeposits.count,
        });
      }
    }, 30000);
    this.setState({fetchAddressSettleDepositsId});

    const fetchAddressCreateDepositsId = window.setInterval(() => {
      if (this.props.state.createDeposits.offset === 0 && isValidRawAddress(this.props.id) === '') {
        this.props.fetchAddressCreateDepositsId({
          id: this.props.id,
          offset: this.props.state.createDeposits.offset,
          count: this.props.state.createDeposits.count,
        });
      }
    }, 30000);
    this.setState({fetchAddressCreateDepositsId});

  }

  componentWillUnmount() {
    window.clearInterval(this.state.fetchAddressVotersId);
    window.clearInterval(this.state.fetchAddressTransfersId);
    window.clearInterval(this.state.fetchAddressExecutionsId);
    window.clearInterval(this.state.fetchAddressSettleDepositsId);
    window.clearInterval(this.state.fetchAddresscreateDepositsId);
  }

  componentWillReceiveProps(nextProps: PropsType, nextContext: any) {
    if (this.props.id !== nextProps.id) {
      if (isBrowser) {
        this.props.fetchAddressId({id: nextProps.id});
        this.props.fetchAddressVotersId({id: nextProps.id, offset: 0, count: this.props.state.voters.count});
        this.props.fetchAddressTransfersId({id: nextProps.id, offset: 0, count: this.props.state.transfers.count});
        this.props.fetchAddressExecutionsId({id: nextProps.id, offset: 0, count: this.props.state.executions.count});
        this.props.fetchAddressSettleDepositsId({id: nextProps.id, offset: 0, count: this.props.state.settleDeposits.count});
        this.props.fetchAddressCreateDepositsId({id: nextProps.id, offset: 0, count: this.props.state.createDeposits.count});
      }
    }
  }

  render() {
    if (this.props.fetching) {
      return (
        <LoadingMessage
          fakeRows={false}
        />
      );
    }
    if (this.props.state.error) {
      return (
        <div>
          <ErrorMessage
            error={this.props.state.error}
          />
        </div>
      );
    }
    const a = this.props.state.address;
    if (!a) {
      return (
        <EmptyMessage item={t('meta.address')}/>
      );
    }
    const rows = [
      {
        c1: t('address.totalBalance'),
        c2: <span>{fromRau(a.totalBalance || 0)} Iotx</span>,
      }, {
        c1: t('address.nonce'),
        c2: (a.nonce || 0),
      },
    ];
    return (
      <div>
        <SingleItemTable
          subtitle={a.address || ''}
          rows={rows}
        />
        <br></br>
        <SingleColTable
          title={t('address.voteDetails')}
          items={this.props.state.voters.items}
          fetching={this.props.state.voters.fetching}
          error={this.props.state.voters.error}
          offset={this.props.state.voters.offset}
          count={this.props.state.voters.count}
          fetch={this.props.fetchAddressVotersId}
          id={this.props.id}
          name={t('votes.title')}
          displayPagination={true}
        >
          <VotesListOnlyId
            votes={this.props.state.voters.items}
            width={this.props.width}
            showIcons={true}
            isHome={false}
          />
        </SingleColTable>
        <br></br>
        <SingleColTable
          title={t('address.listOfTransfers')}
          items={this.props.state.transfers.items}
          fetching={this.props.state.transfers.fetching}
          error={this.props.state.transfers.error}
          offset={this.props.state.transfers.offset}
          count={this.props.state.transfers.count}
          fetch={this.props.fetchAddressTransfersId}
          id={this.props.id}
          name={t('meta.transfers')}
          displayPagination={true}
        >
          <TransfersListOnlyId
            transfers={this.props.state.transfers.items}
            width={this.props.width}
            isHome={false}
          />
        </SingleColTable>
        <br></br>
        <SingleColTable
          title={t('address.listOfExecutions')}
          items={this.props.state.executions.items}
          fetching={this.props.state.executions.fetching}
          error={this.props.state.executions.error}
          offset={this.props.state.executions.offset}
          count={this.props.state.executions.count}
          fetch={this.props.fetchAddressExecutionsId}
          id={this.props.id}
          name={t('meta.executions')}
          displayPagination={true}
        >
          <ExecutionsListOnlyId
            executions={this.props.state.executions.items}
            width={this.props.width}
            isHome={false}
          />
        </SingleColTable>
        {this.props.state.settleDeposits &&
        <SingleColTable
          title={t('address.listOfSettleDeposits')}
          items={this.props.state.settleDeposits.items}
          fetching={this.props.state.settleDeposits.fetching}
          error={this.props.state.settleDeposits.error}
          offset={this.props.state.settleDeposits.offset}
          count={this.props.state.settleDeposits.count}
          fetch={this.props.fetchAddressSettleDepositsId}
          id={this.props.id}
          name={t('meta.settleDeposits')}
          displayPagination={true}
        >
          <SettleDepositsListOnlyId
            settleDeposits={this.props.state.settleDeposits.items}
            width={this.props.width}
            isHome={false}
          />
        </SingleColTable>}
        {this.props.state.createDeposits &&
        <SingleColTable
          title={t('address.listOfCreateDeposits')}
          items={this.props.state.createDeposits.items}
          fetching={this.props.state.createDeposits.fetching}
          error={this.props.state.createDeposits.error}
          offset={this.props.state.createDeposits.offset}
          count={this.props.state.createDeposits.count}
          fetch={this.props.fetchAddressCreateDepositsId}
          id={this.props.id}
          name={t('meta.createDeposits')}
          displayPagination={true}
        >
          <CreateDepositsListOnlyId
            createDeposits={this.props.state.createDeposits.items}
            width={this.props.width}
            isHome={false}
          />
        </SingleColTable>}
      </div>
    );
  }
}
