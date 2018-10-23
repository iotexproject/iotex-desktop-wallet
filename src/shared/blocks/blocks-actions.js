import {BLOCKS} from '../common/site-url';
import {jsonCall} from '../common/actions';

export function fetchBlocks(data) {
  return jsonCall(data, 'FETCH_BLOCKS', BLOCKS.GET);
}
