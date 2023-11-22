module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          ie: "11"
        }
      }
    ],
    ["@babel/preset-react"],
    ["@babel/preset-typescript"]
  ],
  plugins: ["@babel/plugin-proposal-class-properties"]
  // ignore: [/node_modules\/(?!onefx)/g]
};
