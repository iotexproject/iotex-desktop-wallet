import {VOTE} from '../common/site-url';
import {jsonCall} from '../common/actions';

export function fetchVoteId(data) {
  return jsonCall(data, 'FETCH_VOTE', VOTE.GET_VOTE);
}

export function fetchVoteesId(data) {
  return jsonCall(data, 'FETCH_VOTEES', VOTE.GET_VOTEES);
}

export function fetchVotersId(data) {
  return jsonCall(data, 'FETCH_VOTERS', VOTE.GET_VOTERS);
}
