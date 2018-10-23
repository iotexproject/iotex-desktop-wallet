// @flow
import Component from 'inferno-component';
import Helmet from 'inferno-helmet';
import isBrowser from 'is-browser';
import {Link} from 'inferno-router';
import {ExecutionsListOnlyId} from '../executions/executions';
import {CommonMargin} from '../common/common-margin';
import type {TExecution, TReceipt} from '../../entities/explorer-types';
import {EmptyMessage, ErrorMessage, LoadingMessage, PendingMessage} from '../common/message';
import {t} from '../../lib/iso-i18n';
import {SingleItemTable} from '../common/single-item-table';
import {SingleColTable} from '../common/single-col-table';
import type {Error} from '../../entities/common-types';
import {fromNow} from '../common/from-now';

export class Execution extends Component {
  props: {
    state: {
      execution: TExecution,
      fetching: boolean,
      receipt: TReceipt,
      fetchingReceipt: boolean,
      executions: any,
      receiptError: {
        code: string,
        message: string,
      },
      error: {
        code: string,
        message: string,
      },
    },
    params: {
      id: string,
    },
    fetchExecutionId(data: any): void,
    fetchExecutionReceipt(data: any): void,
    fetchExecutions(data: any): void,
  };

  render() {
    let executions = null;
    const {receipt, receiptError, fetchingReceipt} = this.props.state;
    const {contractAddress} = receipt || {contractAddress: null};

    if (this.props.state.execution && this.props.state.execution.isPending) {
      return (
        <div className='column container'>
          <PendingMessage/>
        </div>
      );
    }
    if (contractAddress) {
      executions = (
        <Executions
          executions={this.props.state.executions}
          id={contractAddress}
          fetchExecutions={this.props.fetchExecutions}
        />
      );
    }
    return (
      <div className='column container'>
        <Helmet
          title={`${t('execution.title')} - IoTeX`}
        />
        <div>
          <h1 className='title'>{t('execution.title')}</h1>
          <ExecutionSummary
            execution={this.props.state.execution}
            fetching={this.props.state.fetching}
            error={this.props.state.error}
            id={this.props.params.id}
            fetchExecutionId={this.props.fetchExecutionId}
          />
          <Receipt
            receipt={receipt}
            fetching={fetchingReceipt}
            error={receiptError}
            id={this.props.params.id}
            fetchReceipt={this.props.fetchExecutionReceipt}
          />
          {executions}
        </div>
        <CommonMargin/>
      </div>
    );
  }
}

class Executions extends Component {
  props: {
    id: string,
    executions: {
      items: Array<TExecution>,
      fetching: boolean,
      error: Error,
      offset: number,
      count: number,
    },
    fetchExecutions(data: any): void,
  };

  componentWillMount() {
    if (isBrowser) {
      this.props.fetchExecutions({id: this.props.id, offset: 0, count: 10});
    }
  }

  render() {
    if (!this.props.executions) {
      return null;
    }
    return (
      <SingleColTable
        title={t('address.listOfExecutions')}
        items={this.props.executions.items}
        fetching={this.props.executions.fetching}
        error={this.props.executions.error}
        offset={this.props.executions.offset}
        count={this.props.executions.count}
        fetch={this.props.fetchExecutions}
        id={this.props.id}
        name={t('meta.executions')}
        displayPagination={true}>
        <ExecutionsListOnlyId
          executions={this.props.executions.items}
          isHome={false}
        />
      </SingleColTable>
    );
  }
}

class Receipt extends Component {
  props: {
    id: string,
    receipt: TReceipt,
    fetching: boolean,
    fetchReceipt(data: any): void,
    error: {
      code: string,
      message: string,
    },
  };

  componentWillMount() {
    if (isBrowser) {
      this.props.fetchReceipt({id: this.props.id});
    }
  }

  render() {
    const receipt: TReceipt = this.props.receipt;
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
          code={this.props.error.code}
          message={this.props.error.message}
        />
      );
    }
    if (!receipt) {
      return null;
    }
    const rows = [];
    if (receipt.contractAddress) {
      rows.push({c1: t('receipt.contract'), c2: (receipt.contractAddress)});
    }
    rows.push({c1: t('receipt.status'), c2: (receipt.status ? t('receipt.success') : t('receipt.fail'))});
    rows.push({c1: t('receipt.gas'), c2: (receipt.gasConsumed)});
    if (receipt.retval) {
      rows.push({c1: t('receipt.retval'), c2: (receipt.retval)});
    }
    return (
      <SingleItemTable
        subtitle={t('receipt.title')}
        rows={rows}
      />
    );
  }
}

export class ExecutionSummary extends Component {
  props: {
    execution: TExecution,
    fetchExecutionId(data: any): void,
    error: Error,
    fetching: boolean,
    id: string,
  };

  componentWillMount() {
    if (isBrowser) {
      this.props.fetchExecutionId({id: this.props.id});
    }
  }

  // eslint-disable-next-line max-statements
  render() {
    const execution: TExecution = this.props.execution;
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
    if (!execution) {
      return (
        <EmptyMessage item={t('meta.execution')}/>
      );
    }
    const rows = [];
    rows.push({c1: t('execution.executor'), c2: (<Link to={`/address/${execution.executor}`} className='link'>{execution.executor}</Link>)});
    if (execution.contract) {
      rows.push({c1: t('execution.contract'), c2: (<Link to={`/address/${execution.contract}`} className='link'>{execution.contract}</Link>)});
    }
    rows.push({c1: t('meta.amount'), c2: (execution.amount)});
    rows.push({c1: t('execution.gas'), c2: (execution.gas)});
    rows.push({c1: t('execution.input'), c2: (execution.data)});
    rows.push({c1: t('execution.nonce'), c2: (execution.nonce)});
    rows.push({c1: t('meta.timestamp'), c2: fromNow(execution.timestamp)});
    rows.push({c1: t('block.title'), c2: (<Link to={`/blocks/${execution.blockId}`} className='link'>{execution.blockId}</Link>)});
    return (
      <SingleItemTable
        subtitle={execution.id}
        rows={rows}
      />
    );
  }
}
