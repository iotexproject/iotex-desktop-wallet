import { connect } from "react-redux";
import { withRouter } from "react-router";

import { App } from "./app";

type Props = {
  googleTid: string;
  locale: string;
  isEnterprise: boolean;
};

const connected = connect(
  (state: {
    base: {
      locale: string;
      isEnterprise: boolean;
      analytics: {
        googleTid: string;
      };
    };
  }): Props => {
    return {
      googleTid: state.base.analytics.googleTid,
      locale: state.base.locale,
      isEnterprise: state.base.isEnterprise
    };
  }
)(App);

export const AppContainer = withRouter(connected);
