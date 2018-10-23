import {EXECUTIONS} from '../common/site-url';
import {jsonCall} from '../common/actions';

export function fetchExecutions(data) {
  return jsonCall(data, 'FETCH_EXECUTIONS', EXECUTIONS.GET);
}
