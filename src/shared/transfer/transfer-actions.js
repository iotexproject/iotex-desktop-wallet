import {TRANSFER} from '../common/site-url';
import {jsonCall} from '../common/actions';

export function fetchTransferId(data) {
  return jsonCall(data, 'FETCH_TRANSFER', TRANSFER.GET);
}
