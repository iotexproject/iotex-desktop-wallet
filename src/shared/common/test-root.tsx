// @ts-ignore
import { configureStore } from "onefx/lib/iso-react-render/root/configure-store";
// @ts-ignore
import { RootServer } from "onefx/lib/iso-react-render/root/root-server";
// @ts-ignore
import Helmet from "onefx/lib/react-helmet";
import React from "react";
// @ts-ignore
import { Client as StyletronClient } from "styletron-engine-atomic";
import { HtmlHead } from "./html-head";

const STYLETRON_GLOBAL = "styletron-global";

export function TestRoot({ children }: { children: JSX.Element }): JSX.Element {
  const store = configureStore(
    { base: { translations: {} } },
    (state: object) => state
  );
  const stylesheets = document.getElementsByClassName(STYLETRON_GLOBAL);
  const styletron = new StyletronClient({ hydrate: stylesheets, prefix: "_" });

  return (
    <RootServer store={store} styletron={styletron} context={{}} location={""}>
      <div>
        <HtmlHead locale={"en"} />
        <Helmet>
          <link
            rel="stylesheet"
            type="text/css"
            href="https://member.iotex.io/antd.css"
          />
        </Helmet>
        {children}
      </div>
    </RootServer>
  );
}
