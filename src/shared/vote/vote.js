// @flow

import Component from 'inferno-component';
import Helmet from 'inferno-helmet';
import isBrowser from 'is-browser';
import {Link} from 'inferno-router';
import {CommonMargin} from '../common/common-margin';
import {EmptyMessage, ErrorMessage, LoadingMessage, PendingMessage} from '../common/message';
import type {Error} from '../../entities/common-types';
import {t} from '../../lib/iso-i18n';
import {SingleItemTable} from '../common/single-item-table';
import type {TVote} from '../../entities/explorer-types';
import {fromNow} from '../common/from-now';
import {fetchVoteId} from './vote-actions';

type PropsType = {
  id: string,
};

export class Vote extends Component {
  props: {
    fetchVoteId: fetchVoteId;
    params: {
      id: string
    },
    state: {
      vote: TVote,
      fetching: boolean,
      error: Error,
    },
    width: number,
  };

  render() {
    return (
      <div className='column container'>
        <Helmet
          title={`${t('vote.title')} - IoTeX`}
        />
        <div>
          <h1 className='title'>{t('vote.title')}</h1>
          <VoteSummary
            vote={this.props.state.vote}
            fetching={this.props.state.fetching}
            error={this.props.state.error}
            id={this.props.params.id}
            fetchVoteId={this.props.fetchVoteId}
          />
        </div>
        <CommonMargin/>
      </div>
    );
  }
}

export class VoteSummary extends Component {
  props: {
    vote: TVote,
    fetching: boolean,
    error: Error,
    id: string,
    width: number,
    fetchVoteId: fetchVoteId;
  };

  componentWillMount() {
    if (isBrowser) {
      this.props.fetchVoteId({id: this.props.id});
    }
  }

  componentWillReceiveProps(nextProps: PropsType, nextContext: any) {
    if (this.props.id !== nextProps.id) {
      if (isBrowser) {
        this.props.fetchVoteId({id: this.props.id});
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
    if (this.props.error) {
      return (
        <div>
          <ErrorMessage
            error={this.props.error}
          />
        </div>
      );
    }
    const v = this.props.vote;
    if (!v) {
      return (
        <EmptyMessage item={t('meta.vote')}/>
      );
    }
    if (v.isPending) {
      return (
        <PendingMessage/>
      );
    }
    const rows = [
      {
        c1: t('vote.nonce'),
        c2: (v.nonce || 0),
      },
      {
        c1: t('meta.timestamp'),
        c2: (fromNow(v.timestamp) || 0),
      },
      {
        c1: t('vote.voter'),
        c2: (<Link to={`/address/${v.voter}`} className='link'>{v.voter || 0}</Link>),
      },
      {
        c1: t('vote.votee'),
        c2: (<Link to={`/address/${v.votee}`} className='link'>{v.votee || 0}</Link>),
      },
      {
        c1: t('vote.blockId'),
        c2: (<Link to={`/blocks/${v.blockID}`} className='link'>{v.blockID || 0}</Link>),
      },
    ];
    return (
      <div>
        <SingleItemTable
          subtitle={v.id}
          rows={rows}
        />
      </div>
    );
  }
}
