/* eslint-disable */
import {DIALOGUE_ACTIONS} from './dialogue-actions';

let msgSeq = 0;

export default function reducer(state = {
  message: '',
  msgSeq: 0,
}, action) {
  switch (action.type) {
    case DIALOGUE_ACTIONS.SHOW_MESSAGE: {
      return {
        ...state,
        message: action.payload.message,
        msgSeq: ++msgSeq,
      }
    }

    default:
      return state;
  }
}
