const { config } = require("dotenv");
config();

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
    iotexAntenna: process.env.IOTEX_CORE || "35.239.122.109:80"
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
      "https://use.fontawesome.com/releases/v5.0.13/"
    ],
    "frame-src": [],
    "connect-src": [
      "self",
      "https://api.coinmarketcap.com/v1/ticker/iotex/",
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
    "script-src": ["self", "unsafe-eval", "https://www.google-analytics.com/"]
  },
  apiGatewayUrl:
    process.env.API_GATEWAY_URL || "http://localhost:4004/api-gateway/",
  webBpApiGatewayUrl: "https://member.iotex.io/api-gateway/"
};
