import {TRANSFERS} from '../common/site-url';
import {jsonCall} from '../common/actions';

export function fetchTransfers(data) {
  return jsonCall(data, 'FETCH_TRANSFERS', TRANSFERS.GET);
}
