import { Input } from "antd";
import { SearchProps } from "antd/lib/input";
import { get } from "dottie";
// @ts-ignore
import window from "global/window";
import { publicKeyToAddress } from "iotex-antenna/lib/crypto/crypto";
// @ts-ignore
import { t } from "onefx/lib/iso-i18n";
import React, { Component } from "react";
import { withApollo, WithApolloClient } from "react-apollo";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { GetBlockMetasRequest } from "../../api-gateway/resolvers/antenna-types";
import { GET_BLOCK_METAS } from "../queries";

type SearchBoxProps = SearchProps &
  RouteComponentProps &
  WithApolloClient<{}> & {};

class SearchBoxComponent extends Component<SearchBoxProps> {
  public componentDidMount(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get("search");
    if (search) {
      this.handleSearch(search);
    }
  }

  public handleSearch = async (query: string): Promise<void> => {
    const { history, client } = this.props;
    const value = query.trim();

    if (value.startsWith("io")) {
      return history.push(`/address/${value}`);
    }
    if (value.length === 130) {
      return history.push(`/address/${publicKeyToAddress(value)}`);
    }
    if (`${parseInt(value, 10)}` === `${value}`) {
      try {
        const { data } = await client.query({
          query: GET_BLOCK_METAS,
          variables: {
            byIndex: {
              start: parseInt(value, 10) || 0,
              count: 1
            },
            ignoreErrorNotification: true
          } as GetBlockMetasRequest
        });
        if (data) {
          const hash = get<string>(data, "getBlockMetas.blkMetas.0.hash");
          if (hash) {
            return history.push(`/block/${hash}`);
          }
        }
      } catch (e) {
        return history.push("/notfound");
      }
    }
    try {
      const validBlock = await client.query({
        query: GET_BLOCK_METAS,
        variables: {
          byHash: {
            blkHash: value
          },
          ignoreErrorNotification: true
        } as GetBlockMetasRequest
      });
      if (validBlock) {
        return history.push(`/block/${value}`);
      }
    } catch (error) {
      // Block not found
    }
    // Default route to action page (Ref. #497)
    return history.push(`/action/${value}`);
  };

  public render(): JSX.Element {
    const { ...searchprops } = this.props;
    return (
      <Input.Search
        {...searchprops}
        onSearch={(query: string) => {
          this.handleSearch(query);
        }}
      />
    );
  }
}

export const SearchBox = withRouter(withApollo(SearchBoxComponent));
