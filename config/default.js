const { config } = require("dotenv");
config();

const getApiGatewayUrl = () => {
  const initial = process.env.API_GATEWAY_URL;

  if (!!initial) {
    return initial.endsWith("/") ? initial : initial + "/";
  } else {
    return "";
  }
};

module.exports = {
  project: "iotex-explorer",
  server: {
    port: process.env.PORT || 4004,
    staticDir: "./dist",
    delayInitMiddleware: false,
    cookie: {
      secrets: ["insecure plain text", "insecure secret here"]
    },
    noSecurityHeadersRoutes: {
      "/api-gateway/": true,
      "/api/": true
    },
    noCsrfRoutes: {
      "/api-gateway/": true,
      "/api/": true,
      "/iotex-core-proxy/": true
    }
  },
  ssm: {
    enabled: false
  },
  gateways: {
    logger: {
      enabled: true,
      level: "debug"
    },
    iotexAntenna: process.env.IOTEX_CORE || "35.239.122.109:80",
    sendgridApiKey:
      process.env.SENDGRID_API_KEY ||
      "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",
    sendgrid: {
      url: "/v3/contactdb/recipients",
      method: "POST"
    }
  },
  analytics: {
    googleTid: "UA-111756489-2"
  },
  csp: {
    "default-src": ["none"],
    "manifest-src": ["self"],
    "style-src": [
      "self",
      "unsafe-inline",
      "https://fonts.googleapis.com/css",
      "https://use.fontawesome.com/releases/v5.0.13/",
      "https://translate.googleapis.com/"
    ],
    "frame-src": [],
    "connect-src": [
      "self",
      "https://api.coinmarketcap.com/v1/ticker/iotex/",
      "https://member.iotex.io/api-gateway/",
      "https://api.github.com/",
      "https://iotexscan.io/",
      "https://testnet.iotexscan.io/",
      "https://analytics.iotexscan.io/",
      "https://iotex-analytics-testnet.herokuapp.com/",
      "wss://local.get-scatter.com:64102/",
      process.env.API_GATEWAY_URL
    ],
    "child-src": ["self"],
    "font-src": [
      "self",
      "https://fonts.gstatic.com/",
      "https://use.fontawesome.com/releases/v5.0.13/",
      "data: https://use.fontawesome.com/releases/v5.0.13/"
    ],
    "img-src": ["*", "data:"],
    "media-src": ["self"],
    "object-src": ["self"],
    "script-src": [
      "self",
      "unsafe-eval",
      "https://www.google-analytics.com/",
      "https://translate.google.com/",
      "https://translate.googleapis.com/",
      "https://ethereum.github.io/solc-bin/bin/"
    ]
  },
  apiGatewayUrl: getApiGatewayUrl() || "http://localhost:4004/api-gateway/",
  webBpApiGatewayUrl: "https://member.iotex.io/api-gateway/",
  analyticsApiGatewayUrl:
    process.env.CURRENT_CHAIN_NAME == "testnet"
      ? "https://iotex-analytics-testnet.herokuapp.com/query"
      : "https://analytics.iotexscan.io/query",
  multiChain: {
    current: process.env.CURRENT_CHAIN_NAME || "mainnet",
    chains: [
      {
        name: "mainnet",
        url: "https://iotexscan.io/"
      },
      {
        name: "testnet",
        url: "https://testnet.iotexscan.io/"
      }
    ]
  },
  bidContractAddress: "io16alj8sw7pt0d5wv22gdyphuyz9vas5dk8czk88",
  vitaTokens: [
    "io1hp6y4eqr90j7tmul4w2wa8pm7wx462hq0mg4tw", // VITA Production
    "io14j96vg9pkx28htpgt2jx0tf3v9etpg4j9h384m" // VITA Testnet
  ],
  defaultERC20Tokens: [
    "io1hp6y4eqr90j7tmul4w2wa8pm7wx462hq0mg4tw",
    "io14j96vg9pkx28htpgt2jx0tf3v9etpg4j9h384m"
  ],
  enableSignIn: true
};
