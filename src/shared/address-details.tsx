import { notification } from "antd";
import React, { PureComponent } from "react";
import { Query } from "react-apollo";
import { RouteComponentProps, withRouter } from "react-router";
// @ts-ignore
import { SpinPreloader } from "./common/spin-preloader";
import { ContentPadding } from "./common/styles/style-padding";
import { GET_ACCOUNT } from "./queries";

type PathParamsType = {
  address: string;
};

type Props = RouteComponentProps<PathParamsType> & {};

class AddressDetailsInner extends PureComponent<Props> {
  public render(): JSX.Element {
    const {
      match: {
        params: { address }
      }
    } = this.props;
    return (
      <ContentPadding>
        <Query query={GET_ACCOUNT} variables={{ address }}>
          {({ loading, error, data }) => {
            if (error) {
              notification.error({
                message: "Error",
                description: `failed to get account: ${error}`,
                duration: 3
              });
              return null;
            }
            return (
              <SpinPreloader spinning={loading}>
                {JSON.stringify(data)}
              </SpinPreloader>
            );
          }}
        </Query>
      </ContentPadding>
    );
  }
}

export const AddressDetails = withRouter(AddressDetailsInner);
