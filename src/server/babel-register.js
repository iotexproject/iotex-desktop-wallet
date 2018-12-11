require('@babel/register')({
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current',
      },
    }],
    ['@babel/preset-react'],
    ['@babel/preset-flow'],
  ],
  plugins: [
    '@babel/plugin-transform-flow-strip-types',
    '@babel/plugin-proposal-object-rest-spread',
    'transform-class-properties',
    'react-require',
  ],
  ignore: [
    /node_modules\/(?!onefx)/g,
  ],
});
require('@babel/polyfill');
