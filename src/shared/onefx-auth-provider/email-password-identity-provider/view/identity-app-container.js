import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {IdentityApp} from './identity-app';

export const IdentityAppContainer = withRouter(connect(
  function mapStateToProps(state) {
    return {
      googleTid: state.base.analytics.googleTid,
      locale: state.base.locale,
    };
  },
)(IdentityApp));
