import {connect} from 'inferno-redux';

import * as actions from './vote-actions';
import {Vote} from './vote';

export const VoteContainer = connect(
  function mapStateToProps(state) {
    return {
      state: state.vote,
      width: state.app.width,
    };
  },
  dispatch => ({
    fetchVoteId: data => dispatch(actions.fetchVoteId(data)),
  }),
)(Vote);
