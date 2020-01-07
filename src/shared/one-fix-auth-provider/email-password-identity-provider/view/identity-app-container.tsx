import { connect } from "react-redux";
import { withRouter } from "react-router";
import { IdentityApp } from "./identity-app";

export const IdentityAppContainer = withRouter(
  connect(
    (state: {
      base: {
        analytics: { googleTid: string };
        locale: string;
        isEnterprise: boolean;
      };
    }) => {
      return {
        googleTid: state.base.analytics.googleTid,
        locale: state.base.locale,
        isEnterprise: state.base.isEnterprise
      };
    }
  )(IdentityApp)
);
