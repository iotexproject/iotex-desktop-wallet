import Input from "antd/lib/input";
import { SearchProps } from "antd/lib/input";
import React, { Component } from "react";
import { withApollo, WithApolloClient } from "react-apollo";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { handleSearch } from "../common/search-handler";

type SearchBoxProps = SearchProps &
  RouteComponentProps &
  WithApolloClient<{}> & {
    autoFocus?: boolean;
  };

class SearchBoxComponent extends Component<SearchBoxProps> {
  private readonly inputRef: React.RefObject<
    HTMLDivElement
  > = React.createRef();

  public componentDidMount(): void {
    if (!this.props.autoFocus) {
      return;
    }
    if (!this.inputRef.current) {
      return;
    }
    const input: HTMLInputElement | null = this.inputRef.current.querySelector(
      "input"
    );
    if (input && this.props.autoFocus) {
      input.focus({ preventScroll: false });
    }
  }

  public render(): JSX.Element {
    const { staticContext, ...searchprops } = this.props;
    return (
      <div ref={this.inputRef}>
        <Input.Search
          className={"search-box"}
          {...searchprops}
          onSearch={(query: string) => {
            handleSearch(this.props, query);
          }}
        />
      </div>
    );
  }
}

export const SearchBox = withRouter(withApollo(SearchBoxComponent));
