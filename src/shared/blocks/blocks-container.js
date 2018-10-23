import {connect} from 'inferno-redux';

import {Blocks} from './blocks';
import * as actions from './blocks-actions';

export const BlocksContainer = connect(
  function mapStateToProps(state) {
    return {
      state: state.blocks,
      width: state.app.width,
      statistic: state.nav.statistic,
    };
  },
  dispatch => ({
    fetchBlocks: data => dispatch(actions.fetchBlocks(data)),
  }),
)(Blocks);
