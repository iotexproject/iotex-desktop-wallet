module.exports = {
  server: {
    cdnBase: "https://iotex-explorer.b-cdn.net/",
    cookie: {
      secrets: JSON.parse(
        process.env.COOKIE_SECRETS || '["please specify COOKIE_SECRETS in env"]'
      )
    },
    proxy: true
  },
  gateways: {
    logger: {
      level: "info"
    }
  },
  enableSignIn: false
};
