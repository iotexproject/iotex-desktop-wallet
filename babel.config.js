module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current"
        }
      }
    ],
    ["@babel/preset-react"],
    ["@babel/preset-typescript"]
  ],
  plugins: [
    [
      "@babel/plugin-transform-runtime",
      {
        absoluteRuntime: false,
        corejs: false,
        helpers: true,
        regenerator: true,
        useESModules: false
      }
    ],
    "@babel/plugin-proposal-class-properties"
  ],
  ignore: [/node_modules\/(?!onefx)/g]
};
