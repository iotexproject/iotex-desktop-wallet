// @flow

import Component from 'inferno-component';
import Helmet from 'inferno-helmet';
import {Link} from 'inferno-router';
import isBrowser from 'is-browser';
import {CommonMargin} from '../common/common-margin';
import {TableWrapper} from '../common/table-wrapper';
import {ellipsisText, singleColEllipsisText} from '../common/utils';
import type {Error} from '../../entities/common-types';
import {t} from '../../lib/iso-i18n';
import {EmptyMessage} from '../common/message';
import type {TVote} from '../../entities/explorer-types';
import {ToolTip} from '../common/tooltip';
import {fromNow} from '../common/from-now';
import type {fetchVotes} from './votes-actions';

type PropsType = {
  statistic: {
    height: number,
  },
};

export class Votes extends Component {
  props: {
    state: {
      fetching: boolean,
      error: Error,
      offset: number,
      count: number,
      items: Array<TVote>,
      tip: number,
    },
    fetchVotes: fetchVotes,
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
      this.props.fetchVotes({tip: this.state.height, offset: 0, count: this.props.state.count});
    }
  }

  componentWillReceiveProps(nextProps: PropsType, nextContext: any) {
    if (nextProps.statistic && this.state.height !== nextProps.statistic.height) {
      this.setState(state => {
        state.height = nextProps.statistic.height;
      }, () => {
        if (this.props.state.offset === 0) {
          this.props.fetchVotes({tip: this.state.height, offset: 0, count: this.props.state.count});
        }
      });
    }
  }

  render() {
    return (
      <div className='column container'>
        <Helmet
          title={`${t('meta.votes')} - IoTeX`}
        />
        <div>
          <h1 className='title'>{t('meta.votes')}</h1>
          <TableWrapper
            fetching={this.props.state.fetching}
            error={this.props.state.error}
            offset={this.props.state.offset}
            count={this.props.state.count}
            items={this.props.state.items}
            fetch={this.props.fetchVotes}
            tip={this.props.state.tip}
            name={t('meta.votes')}
            displayPagination={true}
          >
            {<VotesListOnlyId
              votes={this.props.state.items}
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

export class VotesList extends Component {
  props: {
    votes: Array<TVote>,
    width: number,
  };

  render() {
    let votes = this.props.votes;
    // null
    if (!votes) {
      return (
        <EmptyMessage item={t('meta.votes')}/>
      );
    }
    // only 1 item
    if (!Array.isArray(votes)) {
      votes = [votes];
    }
    return (
      <table className='bx--data-table-v2'>
        <thead>
          <tr>
            <th>{t('vote.id')}</th>
            <th>{t('meta.timestamp')}</th>
            <th>{t('vote.blockId')}</th>
          </tr>
        </thead>
        <tbody>
          {votes.map((vote: TVote) => (
            <tr className='bx--parent-row-v2' data-parent-row>
              <td><Link to={`/votes/${vote.id}`} className='link'>{ellipsisText(vote.id, this.props.width)}</Link></td>
              <td>{fromNow(vote.timestamp)}</td>
              <td><Link to={`/blocks/${vote.blockID}`} className='link'>{ellipsisText(vote.blockID, this.props.width)}</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export class VotesListOnlyId extends Component {
  props: {
    votes: Array<TVote>,
    showIcons: ?boolean,
    width: number,
    isHome: boolean,
  };

  render() {
    let votes = this.props.votes;
    // null
    if (!votes) {
      return (
        <EmptyMessage item={t('meta.votes')}/>
      );
    }
    // only 1 item
    if (!Array.isArray(votes)) {
      votes = [votes];
    }
    return (
      <table className='bx--data-table-v2'>
        <thead>
          <tr>
            <th className='single-col-header'>{t('vote.id')}</th>
          </tr>
        </thead>
        <tbody>
          {votes.map((vote: TVote) => (
            <tr className='bx--parent-row-v2' data-parent-row>
              <td className='single-col-row'>
                {this.props.showIcons ?
                  <ToolTip
                    iconClass={vote.out ? 'fas fa-arrow-alt-circle-right force-teal vote-arrow' : 'fas fa-arrow-alt-circle-left force-teal vote-arrow'}
                    message={t(vote.out ? 'votes.out' : 'votes.in')}
                  /> : null
                }
                <Link to={`/votes/${vote.id}`} className='link'>{singleColEllipsisText(vote.id, this.props.width, this.props.isHome)}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
