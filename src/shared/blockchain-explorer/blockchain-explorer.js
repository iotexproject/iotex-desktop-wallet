// @flow

import Component from 'inferno-component';
import Helmet from 'inferno-helmet';
import isBrowser from 'is-browser';
import window from 'global';
import {CommonMargin} from '../common/common-margin';
import {PlasmaBall} from '../common/plasma-ball';
import {fetchExecutions} from '../executions/executions-actions';
import {fetchTransfers} from '../transfers/transfers-actions';
import {fetchBlocks} from '../blocks/blocks-actions';
import type {Error} from '../../entities/common-types';
import type {TBlock, TCoinStatistic, TTransfer, TVote} from '../../entities/explorer-types';
import {t} from '../../lib/iso-i18n';
import {SingleColTable} from '../common/single-col-table';
import {ExecutionsListOnlyId} from '../executions/executions';
import {TransfersListOnlyId} from '../transfers/transfers';
import {BlocksListOnlyId} from '../blocks/blocks';
import {VotesListOnlyId} from '../votes/votes';
import {fetchVotes} from '../votes/votes-actions';
import {fetchConsensusMetrics} from '../consensus-metrics/consensus-metrics-actions';
import type {TConsensusMetrics} from '../../entities/explorer-types';
import {ToolTip} from '../common/tooltip';
import type {TExecution} from '../../entities/explorer-types';
import {Dashboard} from './dashboard';

type PropsType = {
  statistic: TCoinStatistic,
};

export class BlockchainExplorer extends Component {
  props: {
    fetchExecutions: fetchExecutions,
    fetchTransfers: fetchTransfers,
    fetchBlocks: fetchBlocks,
    fetchVotes: fetchVotes,
    fetchConsensusMetrics: fetchConsensusMetrics,
    executions: {
      offset: number,
      count: number,
      fetching: boolean,
      error: Error,
      items: Array<TExecution>,
      tip: number,
    },
    transfers: {
      offset: number,
      count: number,
      fetching: boolean,
      error: Error,
      items: Array<TTransfer>,
      tip: number,
    },
    blocks: {
      offset: number,
      count: number,
      fetching: boolean,
      error: Error,
      items: Array<TBlock>,
      tip: number,
    },
    votes: {
      offset: number,
      count: number,
      fetching: boolean,
      error: Error,
      items: Array<TVote>,
      tip: number,
    },
    width: number,
    statistic: TCoinStatistic,
    consensus: {
      metrics: TConsensusMetrics,
    },
  };

  constructor(props: any) {
    super(props);
    this.state = {
      fetchConsensusMetricsId: 0,
      height: 0,
    };
  }

  componentWillMount() {
    if (isBrowser) {
      this.props.fetchConsensusMetrics();
      this.props.fetchExecutions({offset: 0, count: this.props.executions.count, tip: this.state.height});
      this.props.fetchTransfers({offset: 0, count: this.props.transfers.count, tip: this.state.height, showCoinBase: false});
      this.props.fetchBlocks({offset: 0, count: this.props.blocks.count, tip: this.state.height});
      this.props.fetchVotes({offset: 0, count: this.props.votes.count, tip: this.state.height});
    }
  }

  componentWillReceiveProps(nextProps: PropsType, nextContext: any) {
    if (nextProps.statistic && this.state.height !== nextProps.statistic.height) {
      this.setState(state => {
        state.height = nextProps.statistic.height;
      }, () => {
        this.props.fetchExecutions({offset: 0, count: this.props.executions.count, tip: this.state.height});
        this.props.fetchTransfers({offset: 0, count: this.props.transfers.count, tip: this.state.height, showCoinBase: false});
        this.props.fetchBlocks({offset: 0, count: this.props.blocks.count, tip: this.state.height});
        this.props.fetchVotes({offset: 0, count: this.props.votes.count, tip: this.state.height});
      });
    }
  }

  componentDidMount() {
    const fetchConsensusMetricsId = window.setInterval(
      () => this.props.fetchConsensusMetrics(),
      5000,
    );
    this.setState({fetchConsensusMetricsId});
  }

  componentWillUnmount() {
    window.clearInterval(this.state.fetchConsensusMetricsId);

    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  // eslint-disable-next-line complexity
  render() {
    const stats = this.props.statistic;

    const consensusMetrics = this.props.consensus && this.props.consensus.metrics || {};
    const delegates = consensusMetrics.latestDelegates || [];
    const currentProducer = consensusMetrics.latestBlockProducer;
    const candidates = consensusMetrics.candidates || [];

    return (
      <div className='container'>
        <Helmet
          title={`${t('blockchainExplorer.title')} - IoTeX`}
        />
        <div className='column'>
          <div className='columns'>
            <div className='column is-half'>
              <div className='box-custom' style='width: 100%;height:100%;min-height:300px'>
                <div>
                  <h1 className='title roll-dpos-title'>{t('rolldpos:title')}</h1>
                  <ToolTip
                    iconClass={'fas fa-question-circle'}
                    message={t('rolldpos:msg')}
                    customPadClass={'rollDpos-tooltip'}
                  />
                </div>
                <PlasmaBall delegates={delegates} currentProducer={currentProducer} offline={[]} candidates={candidates}/>
              </div>
            </div>
            <Dashboard
              epochs={Number(consensusMetrics ? (consensusMetrics.latestEpoch || 0) : 0).toLocaleString()}
              blocks={Number(stats ? (stats.height || 0) + 1 : 0).toLocaleString()}
              executions={Number(stats ? stats.executions || 0 : 0).toLocaleString()}
              transfers={Number(stats ? stats.transfers || 0 : 0).toLocaleString()}
              votes={Number(stats ? stats.votes || 0 : 0).toLocaleString()}
              faps={Number(stats ? stats.aps || 0 : 0).toLocaleString()}
              bbh={stats ? stats.bh || 0 : 0}
            />
          </div>
        </div>
        <br></br>
        <div className='column'>
          <div className='columns'>
            <div className='column'>
              <SingleColTable
                title={t('latestBlocks.title')}
                items={this.props.blocks.items}
                fetching={this.props.blocks.fetching}
                error={this.props.blocks.error}
                offset={this.props.blocks.offset}
                count={this.props.blocks.count}
                fetch={this.props.fetchBlocks}
                tip={this.props.blocks.tip}
                name={t('blocks.title')}
                displayViewMore={true}
              >
                <BlocksListOnlyId
                  blocks={this.props.blocks.items}
                  width={this.props.width}
                  isHome={true}
                />
              </SingleColTable>
            </div>
            <div className='column'>
              <SingleColTable
                title={t('latestExecutions.title')}
                items={this.props.executions.items}
                fetching={this.props.executions.fetching}
                error={this.props.executions.error}
                offset={this.props.executions.offset}
                count={this.props.executions.count}
                fetch={this.props.executions}
                tip={this.props.executions.tip}
                name={t('meta.executions')}
                displayViewMore={true}
              >
                <ExecutionsListOnlyId
                  executions={this.props.executions.items}
                  width={this.props.width}
                  isHome={true}
                />
              </SingleColTable>
            </div>
            <div className='column'>
              <SingleColTable
                title={t('latestTransfers.title')}
                items={this.props.transfers.items}
                fetching={this.props.transfers.fetching}
                error={this.props.transfers.error}
                offset={this.props.transfers.offset}
                count={this.props.transfers.count}
                fetch={this.props.transfers}
                tip={this.props.transfers.tip}
                name={t('meta.transfers')}
                displayViewMore={true}
              >
                <TransfersListOnlyId
                  transfers={this.props.transfers.items}
                  width={this.props.width}
                  isHome={true}
                />
              </SingleColTable>
            </div>
            <div className='column'>
              <SingleColTable
                title={t('latestVotes.title')}
                items={this.props.votes.items}
                fetching={this.props.votes.fetching}
                error={this.props.votes.error}
                offset={this.props.votes.offset}
                count={this.props.votes.count}
                fetch={this.props.fetchVotes}
                tip={this.props.votes.tip}
                name={t('votes.title')}
                displayViewMore={true}
              >
                <VotesListOnlyId
                  votes={this.props.votes.items}
                  width={this.props.width}
                  isHome={true}
                />
              </SingleColTable>
            </div>
          </div>
        </div>

        <CommonMargin/>
      </div>
    );
  }
}
