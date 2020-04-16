import fetch from "node-fetch";

export const fetchTotalSupply = async (): Promise<string> => {
  const result = await fetch("https://analytics.iotexscan.io/query", {
    headers: {
      accept: "*/*",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      operationName: null,
      variables: {},
      query: "{ account { totalAccountSupply } }"
    }),
    method: "POST"
  });
  const jsonResult = await result.json();
  return (
    jsonResult && jsonResult.data && jsonResult.data.account.totalAccountSupply
  );
};
