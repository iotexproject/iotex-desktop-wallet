// @flow

import Component from 'inferno-component';
import Helmet from 'inferno-helmet';
import {Link} from 'inferno-router';
import isBrowser from 'is-browser';
import {CommonMargin} from '../common/common-margin';
import {TableWrapper} from '../common/table-wrapper';
import {ellipsisText, hideColClass, singleColEllipsisText} from '../common/utils';
import type {Error} from '../../entities/common-types';
import {t} from '../../lib/iso-i18n';
import {EmptyMessage} from '../common/message';
import type {TExecution} from '../../entities/explorer-types';
import {fromNow} from '../common/from-now';
import type {fetchExecutions} from './executions-actions';

type PropsType = {
  statistic: {
    height: number,
  },
};

export class Executions extends Component {
  props: {
    state: {
      fetching: boolean,
      error: Error,
      offset: number,
      count: number,
      items: Array<TExecution>,
      total: number,
      tip: number,
    },
    fetchExecutions: fetchExecutions,
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
      this.props.fetchExecutions({tip: this.state.height, offset: 0, count: this.props.state.count});
    }
  }

  componentWillReceiveProps(nextProps: PropsType, nextContext: any) {
    if (nextProps.statistic && this.state.height !== nextProps.statistic.height) {
      this.setState(state => {
        state.height = nextProps.statistic.height;
      }, () => {
        if (this.props.state.offset === 0) {
          this.props.fetchExecutions({tip: this.state.height, offset: 0, count: this.props.state.count});
        }
      });
    }
  }

  render() {
    return (
      <div className='column container'>
        <Helmet
          title={`${t('meta.executions')} - IoTeX`}
        />
        <div>
          <h1 className='title'>{t('meta.executions')}</h1>
          <TableWrapper
            fetching={this.props.state.fetching}
            error={this.props.state.error}
            offset={this.props.state.offset}
            count={this.props.state.count}
            items={this.props.state.items}
            fetch={this.props.fetchExecutions}
            tip={this.props.state.tip}
            name={t('meta.executions')}
            displayPagination={true}
          >
            {<ExecutionsListOnlyId
              executions={this.props.state.items}
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

export class ExecutionsList extends Component {
  props: {
    executions: Array<TExecution>,
    width: string,
  };

  render() {
    let executions = this.props.executions;
    // null
    if (!executions) {
      return (
        <EmptyMessage item={t('meta.executions')}/>
      );
    }
    // only 1 item
    if (!Array.isArray(executions)) {
      executions = [executions];
    }
    return (
      <table className='bx--data-table-v2'>
        <thead>
          <tr>
            <th className={hideColClass(this.props.width) ? 'first-col' : 'none-on-palm'}>{t('execution.hash')}</th>
            <th className={hideColClass(this.props.width) ? '' : 'second-to-none-header'}>{t('execution.executor')}</th>
            <th>{t('execution.contract')}</th>
            <th>{t('meta.amount')}</th>
          </tr>
        </thead>
        <tbody>
          {executions.map((execution: TExecution) => (
            <tr className='bx--parent-row-v2' data-parent-row>
              <td className={hideColClass(this.props.width) ? 'first-col' : 'none-on-palm'}><Link
                to={`/executions/${execution.id}`} className='link'>{ellipsisText(execution.id, this.props.width)}</Link>
              </td>
              <td className={hideColClass(this.props.width) ? '' : 'second-to-none'}><Link
                to={`/address/${execution.executor}`}
                className='link'>{ellipsisText(execution.executor, this.props.width)}</Link></td>
              <td><Link to={`/address/${execution.contract}`}
                className='link'>{ellipsisText(execution.contract, this.props.width)}</Link></td>
              <td>{hideColClass(this.props.width) ? execution.amount :
                <Link to={`/executions/${execution.id}`} className='link'>{execution.amount}</Link>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export class ExecutionsListOnlyId extends Component {
  props: {
    executions: Array<TExecution>,
    width: number,
    isHome: boolean,
  };

  render() {
    let executions = this.props.executions;
    const {isHome} = this.props;
    // null
    if (!executions) {
      return (
        <EmptyMessage item={t('meta.executions')}/>
      );
    }
    // only 1 item
    if (!Array.isArray(executions)) {
      executions = [executions];
    }
    return (
      <table className='bx--data-table-v2'>
        <thead>
          <tr>
            <th className={isHome ? 'single-col-header' : ''}>{t('execution.hash')}</th>
            {!isHome && (
              <th>{t('execution.timestamp')}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {executions.map((execution: TExecution) => (
            <tr className='bx--parent-row-v2' data-parent-row>
              <td className={isHome ? 'single-col-row' : ''}>
                <Link to={`/executions/${execution.id}`} className='link'>
                  {singleColEllipsisText(execution.id, this.props.width, isHome)}
                </Link>
              </td>
              {!isHome && (
                <td>
                  {fromNow(execution.timestamp)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

