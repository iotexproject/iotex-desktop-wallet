import {CONSENSUS_API} from '../common/site-url';
import {jsonCall} from '../common/actions';

export function fetchConsensusMetrics(data) {
  return jsonCall(data, 'FETCH_CONSENSUS_METRICS', CONSENSUS_API);
}
