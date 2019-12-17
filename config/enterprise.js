module.exports = {
  isEnterprise: true,
  server: {
    cookie: {
      secrets: JSON.parse(
        process.env.COOKIE_SECRETS || '["please specify COOKIE_SECRETS in env"]'
      )
    }
  },
  gateways: {
    logger: {
      level: "info"
    }
  },
  enableSignIn: false,
  analyticsApiGatewayUrl: process.env.ANALYTICS_API_GATEWAY_URL,
  webBpApiGatewayUrl: ""
};
