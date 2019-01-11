// @flow
import Component from 'inferno-component';
import {Link} from 'inferno-router';
import {singleColEllipsisText} from '../common/utils';
import {t} from '../../lib/iso-i18n';
import {EmptyMessage} from '../common/message';
import type {TSettleDeposit} from '../../entities/wallet-types';
import {fromNow} from '../common/from-now';

export class SettleDepositsListOnlyId extends Component {
  props: {
    settleDeposits: Array<TSettleDeposit>,
    width: number,
    isHome: boolean,
  };

  render() {
    let settleDeposits = this.props.settleDeposits;
    const {isHome} = this.props;
    // null
    if (!settleDeposits) {
      return (
        <EmptyMessage item={t('meta.settleDeposits')}/>
      );
    }
    // only 1 item
    if (!Array.isArray(settleDeposits)) {
      settleDeposits = [settleDeposits];
    }
    return (
      <table className='bx--data-table-v2'>
        <thead>
          <tr>
            <th className={isHome ? 'single-col-header' : ''}>{t('settleDeposits.id')}</th>
            {!isHome && (
              <th>{t('settleDeposits.timestamp')}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {settleDeposits.map((settleDeposit: TSettleDeposit) => (
            <tr className='bx--parent-row-v2' data-parent-row>
              <td className={isHome ? 'single-col-row' : ''}>
                <Link to={`/settle-deposit/${settleDeposit.id}`} className='link'>
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

