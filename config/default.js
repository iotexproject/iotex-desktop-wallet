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
    sendgridApiKey: process.env.SENDGRID_API_KEY,
    sendgrid: {
      url: "/v3/api_keys",
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
  vitaTokens: [
    "io1hp6y4eqr90j7tmul4w2wa8pm7wx462hq0mg4tw", // VITA Production
    "io1zkn0kk7syqf6ayetr2uh2qtwqenu268r9vl9gt"
  ],
  defaultERC20Tokens: [
    "io1hp6y4eqr90j7tmul4w2wa8pm7wx462hq0mg4tw",
    "io1zkn0kk7syqf6ayetr2uh2qtwqenu268r9vl9gt", // vita contrat address for testnet
    "io1dzx73lvpmarj4hy2af6h86yh4qxhgsxmhqv6yp", // vote system contract address
    "io13zt8sznez2pf0q0hqdz2hyl938wak2fsjgdeml" // genesisPoolAddress, rewardPoolAddress, tradingPoolAddress
  ],
  enableSignIn: true
};
