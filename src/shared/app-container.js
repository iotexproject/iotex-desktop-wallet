import {connect} from 'react-redux';
import {withRouter} from 'react-router';

import {App} from './app';

export const AppContainer = withRouter(connect(
  function mapStateToProps(state) {
    return {
      googleTid: state.base.analytics.googleTid,
      locale: state.base.locale,
    };
  },
)(App));
