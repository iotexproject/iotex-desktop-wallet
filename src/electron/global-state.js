// Important note: this file can be used for dev and compiling by webpack only.
const process = require("global/process");
process.env.NODE_CONFIG_DIR = __dirname + "/../../config";
const {
  bidContractAddress,
  vitaTokens,
  multiChain,
  defaultERC20Tokens
} = require("config");

const translations = require("yaml-js").load(
  `${require("fs").readFileSync(__dirname + "/../../translations/en.yaml")}`
);

module.exports = {
  state: {
    base: {
      bidContractAddress,
      vitaTokens,
      multiChain,
      defaultERC20Tokens,
      analytics: {
        googleTid: "UA-111756489-15"
      },
      webBpApiGatewayUrl: "https://member.iotex.io/api-gateway/",
      enableSignIn: false,
      apiGatewayUrl: "https://iotexscan.io/api-gateway/",
      locale: "en",
      csrfToken: "itiKEcT0-ZQfe54u8YdmJn0MAXxZKKKIxqKg",
      translations
    },
    apolloState: {
      "$ROOT_QUERY.fetchVersionInfo": {
        explorerVersion: "v1.2.0",
        iotexCoreVersion: "v0.6.2",
        __typename: "VersionInfo"
      },
      ROOT_QUERY: {
        fetchVersionInfo: {
          type: "id",
          generated: true,
          id: "$ROOT_QUERY.fetchVersionInfo",
          typename: "VersionInfo"
        }
      }
    },
    wallet: {
      customRPCs: [],
      tokens: {},
      defaultNetworkTokens: []
    }
  }
};
