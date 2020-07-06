import fetch from "node-fetch";

export interface ISupply {
  totalSupply: string;
  totalCirculatingSupply: string;
}

const fetchSupply = async (): Promise<ISupply> => {
  const result = await fetch("https://analytics.iotexscan.io/query", {
    headers: {
      accept: "*/*",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      operationName: null,
      variables: {},
      query: `query {
chain {
    totalSupply
    totalCirculatingSupply
  }
}`
    }),
    method: "POST"
  });
  const jsonResult = await result.json();
  return jsonResult && jsonResult.data && jsonResult.data.chain;
};

const totalNumberOfHolders = async (): Promise<string> => {
  const result = await fetch("https://analytics.iotexscan.io/query", {
    headers: {
      accept: "*/*",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      operationName: null,
      variables: {},
      query: `query {
  account {
    totalNumberOfHolders
  }
}`
    }),
    method: "POST"
  });
  const jsonResult = await result.json();
  return (
    jsonResult &&
    jsonResult.data &&
    jsonResult.data.account &&
    jsonResult.data.account.totalNumberOfHolders
  );
};

export const analytics = {
  fetchSupply,
  totalNumberOfHolders
};
