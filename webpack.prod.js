const fs = require('fs');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const glob = require('glob');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const ANALYZE = false;

module.exports = {
  mode: 'production',
  entry: glob
    .sync('./src/client/javascripts/*.js')
    .reduce(
      (entries, entry) =>
        Object.assign(entries, {[entry.replace('./src/client/javascripts/', '').replace('.js', '')]: entry}), {}
    ),
  output: {
    filename: '[name]-[chunkhash].js',
    path: path.resolve(__dirname, 'dist/'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: JSON.parse(fs.readFileSync('./.babelrc')),
        },
      },
    ],
  },
  plugins: [
    ...(ANALYZE ? [new BundleAnalyzerPlugin()] : []),
    new UglifyJSPlugin({
      cache: true,
      parallel: true,
      uglifyOptions: {
        compress: false,
        ecma: 6,
        mangle: true,
        comments: false,
      },
      extractComments: true,
      sourceMap: true,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new ManifestPlugin({
      basePath: '/',
    }),
  ],
};
