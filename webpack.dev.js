const fs = require('fs');
const path = require('path');
const ManifestPlugin = require('webpack-manifest-plugin');
const glob = require('glob');

module.exports = {
  mode: 'development',
  entry: glob
    .sync('./src/client/javascripts/*.js')
    .reduce(
      (entries, entry) =>
        Object.assign(entries, {[entry.replace('./src/client/javascripts/', '').replace('.js', '')]: entry}), {}
    ),
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/'),
  },
  devtool: 'inline-cheap-module-source-map',
  plugins: [
    new ManifestPlugin({
      basePath: '/',
    }),
  ],
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
};
