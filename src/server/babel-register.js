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
    ['@babel/plugin-proposal-decorators', {
      decoratorsBeforeExport: true,
    }],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-flow-strip-types',
    'react-require',
    'transform-class-properties',
  ],
  ignore: [
    /node_modules\/(?!onefx)/g,
  ],
});
require('@babel/polyfill');
