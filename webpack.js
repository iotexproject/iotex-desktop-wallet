const path = require("path");
const UglifyJSPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
const ManifestPlugin = require("webpack-manifest-plugin");
const glob = require("glob");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const process = require("global/process");
const SWPrecacheWebpackPlugin = require("sw-precache-webpack-plugin");

const ANALYZE = false;
const PROD = process.env.NODE_ENV === "production";
const OUTPUT_DIR = "dist/";

module.exports = {
  mode: PROD ? "production" : "development",
  entry: glob.sync("./src/client/javascripts/*.ts*").reduce(
    (entries, entry) =>
      Object.assign(entries, {
        [entry
          .replace("./src/client/javascripts/", "")
          .replace(/(\.ts|\.tsx)$/, "")]: entry
      }),
    {}
  ),
  output: {
    filename: PROD ? "[name]-[chunkhash].js" : "[name].js",
    path: path.resolve(__dirname, OUTPUT_DIR)
  },
  ...(PROD ? {} : { devtool: "source-map" }),
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: require("./babel.config")
        }
      }
    ]
  },
  resolve: {
    // options for resolving module requests
    // (does not apply to resolving to loaders)
    modules: ["node_modules", path.resolve(__dirname, "src")],
    // directories where to look for modules
    extensions: [".js", ".json", ".jsx", ".ts", ".tsx"],
    // extensions that are used
    alias: {}
    /* Alternative alias syntax (click to show) */
    /* Advanced resolve configuration (click to show) */
  },
  plugins: [
    new ManifestPlugin({
      basePath: "/",
      fileName: "asset-manifest.json"
    }),
    ...(ANALYZE ? [new BundleAnalyzerPlugin()] : []),
    ...(PROD
      ? [
          new UglifyJSPlugin({
            cache: true,
            parallel: true
          }),
          new webpack.DefinePlugin({
            "process.env": {
              NODE_ENV: JSON.stringify("production")
            }
          })
        ]
      : []),
    new SWPrecacheWebpackPlugin({
      mergeStaticsConfig: true,
      dontCacheBustUrlsMatching: /\.\w{8}\./,
      filename: "service-worker.js",
      minify: false,
      navigateFallback: "/",
      navigateFallbackWhitelist: [/^(?!\/__).*/],
      staticFileGlobs: [`${OUTPUT_DIR}/**`],
      stripPrefix: OUTPUT_DIR,
      staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
      dynamicUrlToDependencies: {
        "/index.html": glob.sync(path.resolve(`${OUTPUT_DIR}/**/*.js`)),
        "/notes": glob.sync(path.resolve(`${OUTPUT_DIR}/**/*.js`)),
        "/notes/": glob.sync(path.resolve(`${OUTPUT_DIR}/**/*.js`))
      }
    })
  ]
};
