import { connect } from "react-redux";
import { withRouter } from "react-router";

import { App } from "./app";

type Props = {
  googleTid: string;
  locale: string;
};

const connected = connect(
  (state: {
    base: {
      locale: string;
      analytics: {
        googleTid: string;
      };
    };
  }): Props => {
    return {
      googleTid: state.base.analytics.googleTid,
      locale: state.base.locale
    };
  }
)(App);

export const AppContainer = withRouter(connected);
