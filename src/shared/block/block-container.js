import {connect} from 'inferno-redux';

import * as actions from '../block/block-actions';
import {Block} from './block';

export const BlockContainer = connect(
  function mapStateToProps(state) {
    return {
      state: state.block,
      width: state.app.width,
    };
  },
  dispatch => ({
    fetchBlockId: data => dispatch(actions.fetchBlockId(data)),
    fetchBlockExecutionsId: data => dispatch(actions.fetchBlockExecutionsId(data)),
    fetchBlockTransfersId: data => dispatch(actions.fetchBlockTransfersId(data)),
    fetchBlockVotesId: data => dispatch(actions.fetchBlockVotesId(data)),
  }),
)(Block);
