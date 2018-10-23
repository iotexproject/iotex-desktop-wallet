import {connect} from 'inferno-redux';

import {Nav} from './nav';
import * as actions from './nav-actions';

export const NavContainer = connect(
  function mapStateToProps(state) {
    return {
      statistic: state.nav.statistic,
      price: state.nav.price,
      fetching: state.nav.fetching,
      error: state.nav.error,
    };
  },
  dispatch => ({
    fetchCoinStatistic: () => dispatch(actions.fetchCoinStatistic()),
    fetchCoinPrice: () => dispatch(actions.fetchCoinPrice()),
  }),
)(Nav);
