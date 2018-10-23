// @flow

import {combineReducers} from 'redux';
import execution from '../../execution/execution-reducer';
import executions from '../../executions/executions-reducer';
import transfer from '../../transfer/transfer-reducer';
import transfers from '../../transfers/transfers-reducer';
import block from '../../block/block-reducer';
import blocks from '../../blocks/blocks-reducer';
import address from '../../address/address-reducer';
import vote from '../../vote/vote-reducer';
import votes from '../../votes/votes-reducer';
import nav from '../nav/nav-reducer';
import app from '../../app-container';
import consensus from '../../consensus-metrics/consensus-metrics-reducer';
import dialogue from '../dialogue/dialogue-reducer';
import delegates from '../../delegates/delegates-reducer';

export type Reducer = (state: any, action: any) => any;

export function noopReducer(state: any = {}, action: any) {
  return state;
}

export const rootReducer = combineReducers({
  base: noopReducer,
  nav,
  app,
  execution,
  executions,
  transfer,
  transfers,
  block,
  blocks,
  address,
  vote,
  votes,
  consensus,
  dialogue,
  delegates,
});
