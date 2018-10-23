// @flow

import Component from 'inferno-component';
import {t} from '../../lib/iso-i18n';
import type {Error} from '../../entities/common-types';

export class ErrorMessage extends Component {
  props: {
    error: Error,
  };

  render() {
    const {message, data} = this.props.error;

    return (
      <table className='bx--data-table-v2'>
        <thead>
          <tr className='bx--parent-row-v2' data-parent-row>
            <th className='single-col-header'>{t('meta.error')}</th>
          </tr>
        </thead>
        <tbody>
          <tr className='bx--parent-row-v2' data-parent-row>
            <td>
              {message !== '' ? t(message, data) : t('error.unknown')}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export class EmptyMessage extends Component {
  props: {
    item: string,
    more: ?boolean,
  };

  render() {
    return (
      <table className='bx--data-table-v2'>
        <thead>
          <tr className='bx--parent-row-v2' data-parent-row>
            {this.props.more ?
              <th className='single-col-header'>{t('empty.noMore')} {this.props.item}</th> :
              <th className='single-col-header'>{t('empty.no')} {this.props.item} {t('empty.yet')}</th>
            }
          </tr>
        </thead>
      </table>
    );
  }
}

export class PendingMessage extends Component {
  render() {
    return (
      <table className='bx--data-table-v2'>
        <thead>
          <tr className='bx--parent-row-v2' data-parent-row>
            <th className='single-col-header'>{t('transaction.pending.title')}</th>
          </tr>
        </thead>
        <tbody>

          <tr className='bx--parent-row-v2' data-parent-row>
            <td>
              {t('transaction.pending')}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export class LoadingMessage extends Component {
  props: {
    fakeRows: boolean,
  };

  createBlankRows = () => {
    const r = [];
    // use 10 rows for now
    for (let i = 0; i < 10; i++) {
      r.push(
        <tr className='bx--parent-row-v2' data-parent-row/>
      );
    }
    return r;
  };

  render() {
    return (
      <table className='bx--data-table-v2'>
        <thead>
          <tr className='bx--parent-row-v2' data-parent-row>
            <th className='single-col-header'>{t('meta.loading')} <i className='fa fa-spinner fa-spin'/></th>
          </tr>
        </thead>
        {this.props.fakeRows ?
          <tbody>
            {this.createBlankRows()}
          </tbody> : null
        }
      </table>
    );
  }
}
