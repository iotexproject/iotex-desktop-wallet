import isBrowser from "is-browser";
import React from "react";
import Iframe from "react-iframe";

export function ExplorerPlayground({
  isExplorer
}: {
  isExplorer: boolean;
}): JSX.Element {
  const url = isExplorer ? "/api-gateway/" : "/query";
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {isBrowser && (
        <Iframe
          url={url}
          width="100%"
          height="100%"
          display="block"
          position="relative"
        />
      )}
    </div>
  );
}
