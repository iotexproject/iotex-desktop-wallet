import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { Store } from "redux";
// @ts-ignore
import { Provider as StyletronProvider } from "styletron-react";

type Props = {
  store: Store<{}>;
  children: JSX.Element;
  // tslint:disable-next-line
  styletron: any;
};

export function RootMemory({ store, children, styletron }: Props): JSX.Element {
  return (
    <StyletronProvider value={styletron}>
      <Provider store={store}>
        <MemoryRouter>{children}</MemoryRouter>
      </Provider>
    </StyletronProvider>
  );
}
