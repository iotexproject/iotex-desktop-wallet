import {BLOCK} from '../common/site-url';
import {jsonCall} from '../common/actions';

export function fetchBlockId(data) {
  return jsonCall(data, 'FETCH_BLOCK', BLOCK.GET_BLOCK);
}

export function fetchBlockExecutionsId(data) {
  return jsonCall(data, 'FETCH_BLOCK_EXECUTIONS', BLOCK.GET_EXECUTIONS);
}

export function fetchBlockTransfersId(data) {
  return jsonCall(data, 'FETCH_BLOCK_TRANSFERS', BLOCK.GET_TRANSFERS);
}

export function fetchBlockVotesId(data) {
  return jsonCall(data, 'FETCH_BLOCK_VOTES', BLOCK.GET_VOTES);
}
