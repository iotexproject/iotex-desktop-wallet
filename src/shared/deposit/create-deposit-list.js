// @flow
import Component from 'inferno-component';
import {Link} from 'inferno-router';
import {singleColEllipsisText} from '../common/utils';
import {t} from '../../lib/iso-i18n';
import {EmptyMessage} from '../common/message';
import type {TCreateDeposit} from '../../entities/wallet-types';
import {fromNow} from '../common/from-now';

export class CreateDepositsListOnlyId extends Component {
  props: {
    createDeposits: Array<TCreateDeposit>,
    width: number,
    isHome: boolean,
  };

  render() {
    let createDeposits = this.props.createDeposits;
    const {isHome} = this.props;
    // null
    if (!createDeposits) {
      return (
        <EmptyMessage item={t('meta.createDeposits')}/>
      );
    }
    // only 1 item
    if (!Array.isArray(createDeposits)) {
      createDeposits = [createDeposits];
    }
    return (
      <table className='bx--data-table-v2'>
        <thead>
          <tr>
            <th className={isHome ? 'single-col-header' : ''}>{t('createDeposits.id')}</th>
            {!isHome && (
              <th>{t('createDeposits.timestamp')}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {createDeposits.map((settleDeposit: TSettleDeposit) => (
            <tr className='bx--parent-row-v2' data-parent-row>
              <td className={isHome ? 'single-col-row' : ''}>
                <Link to={`/create-deposit/${settleDeposit.id}`} className='link'>
                  {singleColEllipsisText(settleDeposit.id, this.props.width, isHome)}
                </Link>
              </td>
              {!isHome && (
                <td>
                  {fromNow(settleDeposit.timestamp)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

