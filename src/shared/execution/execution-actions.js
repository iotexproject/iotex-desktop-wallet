import {ADDRESS, EXECUTION} from '../common/site-url';
import {jsonCall} from '../common/actions';

export function fetchExecutionId(data) {
  return jsonCall(data, 'FETCH_EXECUTION', EXECUTION.GET);
}

export function fetchExecutionReceipt(data) {
  return jsonCall(data, 'FETCH_EXECUTION_RECEIPT', EXECUTION.GET_RECEIPT);
}

export function fetchExecutions(data) {
  return jsonCall(data, 'FETCH_CONTRACT_EXECUTIONS', ADDRESS.GET_EXECUTIONS);
}
