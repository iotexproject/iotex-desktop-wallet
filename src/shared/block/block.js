// @flow

import Component from 'inferno-component';
import Helmet from 'inferno-helmet';
import isBrowser from 'is-browser';
import window from 'global';
import {CommonMargin} from '../common/common-margin';
import {EmptyMessage, ErrorMessage, LoadingMessage} from '../common/message';
import type {Error} from '../../../src/entities/common-types';
import type {TBlock, TTransfer, TVote} from '../../entities/explorer-types';
import {t} from '../../lib/iso-i18n';
import {SingleItemTable} from '../common/single-item-table';
import {SingleColTable} from '../common/single-col-table';
import {ExecutionsListOnlyId} from '../executions/executions';
import {TransfersListOnlyId} from '../transfers/transfers';
import {VotesListOnlyId} from '../votes/votes';
import type {TExecution} from '../../entities/explorer-types';
import {fromNow} from '../common/from-now';
import {fetchBlockId, fetchBlockExecutionsId, fetchBlockTransfersId, fetchBlockVotesId} from './block-actions';

type PropsType = {
  id: string,
};

export class Block extends Component {
  props: {
    params: {
      id: string,
    },
    state: {
      fetching: boolean,
      error: Error,
      block: TBlock,
      transfers: {
        items: Array<TTransfer>,
        fetching: boolean,
        error: Error,
        offset: number,
        count: number,
      },
      executions: {
        items: Array<TExecution>,
        fetching: boolean,
        error: Error,
        offset: number,
        count: number,
      },
      votes: {
        items: Array<TVote>,
        fetching: boolean,
        error: Error,
        offset: number,
        count: number,
      },
    },
    fetchBlockId: fetchBlockId,
    fetchBlockExecutionsId: fetchBlockExecutionsId,
    fetchBlockTransfersId: fetchBlockTransfersId,
    fetchBlockVotesId: fetchBlockVotesId,
    width: number,
  };

  render() {
    return (
      <div className='column container'>
        <Helmet
          title={`${t('block.title')} - IoTeX`}
        />
        <div>
          <h1 className='title'>{t('block.title')}</h1>
          <BlockSummary
            id={this.props.params.id}
            fetching={this.props.state.fetching}
            error={this.props.state.error}
            block={this.props.state.block}
            fetchBlockId={this.props.fetchBlockId}
            executions={this.props.state.executions}
            transfers={this.props.state.transfers}
            votes={this.props.state.votes}
            fetchBlockExecutionsId={this.props.fetchBlockExecutionsId}
            fetchBlockTransfersId={this.props.fetchBlockTransfersId}
            fetchBlockVotesId={this.props.fetchBlockVotesId}
            width={this.props.width}
          />
        </div>
        <CommonMargin/>
      </div>
    );
  }
}

export class BlockSummary extends Component {
  props: {
    id: string,
    fetching: boolean,
    error: Error,
    block: TBlock,
    fetchBlockId: fetchBlockId,
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
    votes: {
      items: Array<TVote>,
      fetching: boolean,
      error: Error,
      offset: number,
      count: number,
    },
    fetchBlockExecutionsId: fetchBlockExecutionsId,
    fetchBlockTransfersId: fetchBlockTransfersId,
    fetchBlockVotesId: fetchBlockVotesId,
    width: number,
  };

  constructor(props: PropsType) {
    super(props);
    this.state = {
      fetchBlockExecutionsId: 0,
      fetchBlockTransfersId: 0,
      fetchBlockVotesId: 0,
    };
  }

  componentWillMount() {
    if (isBrowser) {
      this.props.fetchBlockId({id: this.props.id});
      this.props.fetchBlockExecutionsId({id: this.props.id, offset: 0, count: this.props.executions.count});
      this.props.fetchBlockTransfersId({id: this.props.id, offset: 0, count: this.props.transfers.count});
      this.props.fetchBlockVotesId({id: this.props.id, offset: 0, count: this.props.votes.count});
    }
  }

  componentDidMount() {
    const fetchBlockExecutionsId = window.setInterval(() => this.props.fetchBlockExecutionsId({id: this.props.id, offset: this.props.executions.offset, count: this.props.executions.count}), 30000);
    this.setState({fetchBlockExecutionsId});

    const fetchBlockTransfersId = window.setInterval(() => this.props.fetchBlockTransfersId({id: this.props.id, offset: this.props.transfers.offset, count: this.props.transfers.count}), 30000);
    this.setState({fetchBlockTransfersId});

    const fetchBlockVotesId = window.setInterval(() => this.props.fetchBlockVotesId({id: this.props.id, offset: this.props.votes.offset, count: this.props.votes.count}), 30000);
    this.setState({fetchBlockVotesId});
  }

  componentWillUnmount() {
    window.clearInterval(this.state.fetchBlockExecutionsId);
    window.clearInterval(this.state.fetchBlockTransfersId);
    window.clearInterval(this.state.fetchBlockVotesId);
  }

  componentWillReceiveProps(nextProps: PropsType, nextContext: any) {
    if (this.props.id !== nextProps.id) {
      if (isBrowser) {
        this.props.fetchBlockId({id: nextProps.id});
        this.props.fetchBlockExecutionsId({id: nextProps.id, offset: this.props.executions.offset, count: this.props.executions.count});
        this.props.fetchBlockTransfersId({id: nextProps.id, offset: this.props.transfers.offset, count: this.props.transfers.count});
        this.props.fetchBlockVotesId({id: this.props.id, offset: this.props.votes.offset, count: this.props.votes.count});
      }
    }
  }

  // eslint-disable-next-line complexity
  render() {
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
    const b = this.props.block;
    if (!b) {
      return (
        <EmptyMessage item={t('meta.block')}/>
      );
    }
    const rows = [
      {
        c1: t('meta.transactions'),
        c2: ((b.transfers || 0) + (b.votes || 0)),
      }, {
        c1: t('meta.height'),
        c2: (b.height || 0),
      },
      // {
      //   c1: t('block.totalForged'),
      //   c2: (b.forged || 0),
      // },
      {
        c1: t('block.totalAmount'),
        c2: (b.amount || 0),
      }, {
        c1: t('block.size'),
        c2: (b.size || 0),
      }, {
        c1: t('meta.timestamp'),
        c2: (fromNow(b.timestamp) || 0),
      }, {
        c1: t('block.generatedBy'),
        c2: b.generateBy ? b.generateBy.name || b.generateBy.address : '',
      },
    ];
    return (
      <div>
        <SingleItemTable
          subtitle={b.id || 0}
          rows={rows}
        />
        <br></br>
        <div className='columns'>
          <div className='column'>
            <SingleColTable
              title={t('block.listOfExecutions')}
              items={this.props.executions.items}
              fetching={this.props.executions.fetching}
              error={this.props.executions.error}
              offset={this.props.executions.offset}
              count={this.props.executions.count}
              fetch={this.props.fetchBlockExecutionsId}
              name={t('meta.executions')}
              displayPagination={true}
              id={this.props.id}
            >
              <ExecutionsListOnlyId
                executions={this.props.executions.items}
                width={this.props.width}
                isHome={false}
              />
            </SingleColTable>
          </div>
          <div className='column'>
            <SingleColTable
              title={t('block.listOfTransfers')}
              items={this.props.transfers.items}
              fetching={this.props.transfers.fetching}
              error={this.props.transfers.error}
              offset={this.props.transfers.offset}
              count={this.props.transfers.count}
              fetch={this.props.fetchBlockTransfersId}
              name={t('meta.transfers')}
              displayPagination={true}
              id={this.props.id}
            >
              <TransfersListOnlyId
                transfers={this.props.transfers.items}
                width={this.props.width}
                isHome={false}
              />
            </SingleColTable>
          </div>
          <div className='column'>
            <SingleColTable
              title={t('block.listOfVotes')}
              items={this.props.votes.items}
              fetching={this.props.votes.fetching}
              error={this.props.votes.error}
              offset={this.props.votes.offset}
              count={this.props.votes.count}
              fetch={this.props.fetchBlockVotesId}
              name={t('votes.title')}
              displayPagination={true}
              id={this.props.id}
            >
              <VotesListOnlyId
                votes={this.props.votes.items}
                width={this.props.width}
                isHome={false}
              />
            </SingleColTable>
          </div>
        </div>
      </div>
    );
  }
}
