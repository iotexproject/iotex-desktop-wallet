const path = require("path");
const merge = require("webpack-merge");
const nodeExternals = require("webpack-node-externals");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const translateEnvToMode = env => {
  if (env === "production") {
    return "production";
  }
  return "development";
};

const base = env => {
  return {
    target: "electron-renderer",
    mode: translateEnvToMode(env),
    node: {
      __dirname: false,
      __filename: false
    },
    externals: [nodeExternals()],
    resolve: {
      alias: {
        env: path.resolve(__dirname, `../config/env_${env}.json`)
      }
    },
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ["babel-loader"]
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        }
      ]
    },
    plugins: [
      new FriendlyErrorsWebpackPlugin({ clearConsole: env === "development" }),
      new CopyPlugin([
        { from: "./src/index.html" },
        { from: "../../dist/stylesheets/main.css" },
        { from: "../../dist/antd.css" }
      ])
    ]
  };
};

module.exports = env => {
  return merge(base(env), {
    entry: {
      main: "./src/main.js",
      renderer: "./src/renderer.js"
    },
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "./dist/app")
    }
  });
};
