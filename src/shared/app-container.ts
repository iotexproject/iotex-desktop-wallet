import { connect } from "react-redux";
import { withRouter } from "react-router";

import { App } from "./app";

type Props = {
  googleTid: string;
  locale: string;
  toEthAddress: boolean
};

const connected = connect(
  (state: {
    base: {
      locale: string;
      analytics: {
        googleTid: string;
      };
      toEthAddress: boolean
    };
  }): Props => {
    return {
      googleTid: state.base.analytics.googleTid,
      locale: state.base.locale,
      toEthAddress: state.base.toEthAddress
    };
  }
)(App);

export const AppContainer = withRouter(connected);
