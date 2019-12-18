import { connect } from "react-redux";
import { withRouter } from "react-router";
import { IdentityApp } from "./identity-app";

type ReduxProps = {
  googleTid: string;
  locale: string;
};

export const IdentityAppContainer = withRouter(
  // @ts-ignore
  connect<ReduxProps>(state => {
    return {
      // @ts-ignore
      googleTid: state.base.analytics.googleTid,
      // @ts-ignore
      locale: state.base.locale
    };
  })(IdentityApp)
);
