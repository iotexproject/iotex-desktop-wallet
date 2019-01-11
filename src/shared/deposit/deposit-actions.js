import {DEPOSIT} from '../common/site-url';
import {jsonCall} from '../common/actions';

export function fetchCreateDepositId(data) {
  return jsonCall(data, 'FETCH_CREATE_DEPOSIT', DEPOSIT.GET_CREATE);
}

export function fetchSettleDepositId(data) {
  return jsonCall(data, 'FETCH_SETTLE_DEPOSIT', DEPOSIT.GET_SETTLE);
}
