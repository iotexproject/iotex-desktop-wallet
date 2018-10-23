// @flow

import {EXECUTIONS, TRANSFERS, VOTES} from '../common/site-url';
import {t} from '../../lib/iso-i18n';
import {greenButton} from '../common/buttons';

export function BroadcastSuccess(txHash: string, type: string, action: any) {
  let index;
  switch (type) {
  case 'transfer':
    index = TRANSFERS.INDEX;
    break;
  case 'vote':
    index = VOTES.INDEX;
    break;
  case 'contract':
    index = EXECUTIONS.INDEX;
    break;
  default:
    return null;
  }
  return (
    <div>
      <p style={{fontSize: '34px', fontWeight: 'bold'}}><i style={{color: '#07a35a'}} className='far fa-check-circle'/> {t('broadcast.success')}</p>

      <p>{t('broadcast.warn.one')}</p>
      <p>{t('broadcast.warn.two')}</p>
      <p>{t('broadcast.warn.three')} <strong>{txHash}</strong></p>

      {greenButton(t('broadcast.button.check'), false, null, false, `${index}${txHash}`, '_blank')}
      {'\u0020'}
      {action}
    </div>
  );
}

export function BroadcastFail(errorMessage: string, suggestedMessage: string, action: any) {
  return (
    <div>
      <p style={{fontSize: '34px', fontWeight: 'bold'}}><i style={{color: '#e54837'}} className='far fa-times-circle'/> {t('broadcast.fail')}</p>

      <p>{t('broadcast.fail.network')}</p>
      <ul>
        <li>{t('broadcast.error.message')} {t(errorMessage)}</li>
        <li>{t('broadcast.suggested.action')} <strong>{t(suggestedMessage)}</strong></li>
      </ul>
      {action}
    </div>
  );
}
