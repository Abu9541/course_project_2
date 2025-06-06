const { override } = require('customize-cra');
const { addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(
  addWebpackAlias({
    '@services': path.resolve(__dirname, 'src/services'),
    '@components': path.resolve(__dirname, 'src/components'),
    '@hocs': path.resolve(__dirname, 'src/hocs'),
    '@auth': path.resolve(__dirname, 'src/auth'),
    '@pages': path.resolve(__dirname, 'src/pages')
  })
);
