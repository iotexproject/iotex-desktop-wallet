import {VOTES} from '../common/site-url';
import {jsonCall} from '../common/actions';

export function fetchVotes(data) {
  return jsonCall(data, 'FETCH_VOTES', VOTES.GET);
}
