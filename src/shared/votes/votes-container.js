import {connect} from 'inferno-redux';

import * as actions from './votes-actions';
import {Votes} from './votes';

export const VotesContainer = connect(
  function mapStateToProps(state) {
    return {
      state: state.votes,
      width: state.app.width,
      statistic: state.nav.statistic,
    };
  },
  dispatch => ({
    fetchVotes: data => dispatch(actions.fetchVotes(data)),
  }),
)(Votes);
