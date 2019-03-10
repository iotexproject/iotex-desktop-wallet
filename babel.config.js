module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current',
      },
    }],
    ['@babel/preset-react'],
    ['@babel/preset-typescript'],
  ],
  plugins: [],
  ignore: [
    /node_modules\/(?!onefx)/g,
  ],
};
