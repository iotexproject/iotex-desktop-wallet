import {DELEGATES} from '../common/site-url';
import {jsonCall} from '../common/actions';

export function fetchDelegates(data) {
  return jsonCall(data, 'FETCH_DELEGATES', DELEGATES.GET);
}
